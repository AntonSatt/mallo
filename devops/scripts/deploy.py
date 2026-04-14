#!/usr/bin/env python3
"""Deploy (create or update) a Portainer stack for the current GitLab CI ref."""

import os
import sys

import requests
from envsubst import envsubst


def req_env(var_name):
    value = os.getenv(var_name)
    if not value:
        print(f"Missing required variable: {var_name}")
        sys.exit(1)
    return value


def main():
    ci_commit_ref_slug = req_env("CI_COMMIT_REF_SLUG")
    ci_commit_ref_name = req_env("CI_COMMIT_REF_NAME")
    ci_default_branch = req_env("CI_DEFAULT_BRANCH")
    ci_registry_image = req_env("CI_REGISTRY_IMAGE")
    usr = req_env("PORTAINER_USR")
    pwd = req_env("PORTAINER_PWD")
    portainer_url = req_env("PORTAINER_URL")

    stack_name = f"gr8-{ci_commit_ref_slug}"
    image_tag = "latest" if ci_commit_ref_name == ci_default_branch else ci_commit_ref_slug

    os.environ["stack_name"] = stack_name
    os.environ["image_tag"] = image_tag
    os.environ["CI_REGISTRY_IMAGE"] = ci_registry_image

    try:
        auth = requests.post(
            f"{portainer_url}/auth",
            json={"username": usr, "password": pwd},
        )
        auth.raise_for_status()
        token = auth.json()["jwt"]
        headers = {"Authorization": f"Bearer {token}"}

        endpoints = requests.get(f"{portainer_url}/endpoints", headers=headers)
        endpoints.raise_for_status()
        endpoint_id = next(
            (e["Id"] for e in endpoints.json() if e["Name"] == "local-swarm"),
            None,
        )
        if endpoint_id is None:
            print("No 'local-swarm' endpoint found")
            sys.exit(1)

        swarm = requests.get(
            f"{portainer_url}/endpoints/{endpoint_id}/docker/swarm",
            headers=headers,
        )
        swarm.raise_for_status()
        swarm_id = swarm.json()["ID"]

        with open("../../docker-compose.yml", "r") as f:
            compose_src = f.read()
        deployable = envsubst(compose_src)
        with open("deployable-compose.yml", "w") as f:
            f.write(deployable)

        stacks = requests.get(
            f"{portainer_url}/stacks?endpointId={endpoint_id}",
            headers=headers,
        )
        stacks.raise_for_status()
        match = next(
            (s for s in stacks.json()
             if s["Name"] == stack_name and s["EndpointId"] == endpoint_id),
            None,
        )
        stack_id = match["Id"] if match else None

        if stack_id is None:
            print(f"Creating new stack '{stack_name}'")
            with open("deployable-compose.yml", "rb") as f:
                resp = requests.post(
                    f"{portainer_url}/stacks/create/swarm/file?endpointId={endpoint_id}",
                    headers=headers,
                    data={"Name": stack_name, "SwarmID": swarm_id},
                    files={"file": f},
                )
            resp.raise_for_status()
        else:
            print(f"Updating existing stack '{stack_name}' (id {stack_id})")
            payload = {
                "prune": True,
                "RepullImageAndRedeploy": True,
                "stackFileContent": deployable,
            }
            resp = requests.put(
                f"{portainer_url}/stacks/{stack_id}?endpointId={endpoint_id}",
                headers=headers,
                json=payload,
            )
            resp.raise_for_status()

        print(f"Deploy OK: {stack_name}")

    except requests.HTTPError as e:
        print(f"HTTP error: {e}")
        if e.response is not None:
            print(f"Response: {e.response.text}")
        sys.exit(1)


if __name__ == "__main__":
    main()
