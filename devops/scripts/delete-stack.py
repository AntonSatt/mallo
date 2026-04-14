#!/usr/bin/env python3
"""Delete the Portainer stack belonging to the current GitLab CI ref."""

import sys

import requests

from deploy import req_env


def main():
    ci_project_name = req_env("CI_PROJECT_NAME")
    ci_commit_ref_slug = req_env("CI_COMMIT_REF_SLUG")
    usr = req_env("PORTAINER_USR")
    pwd = req_env("PORTAINER_PWD")
    portainer_url = req_env("PORTAINER_URL")

    stack_name = f"{ci_project_name}-{ci_commit_ref_slug}"

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

        if match is None:
            print(f"No stack named '{stack_name}' to delete — nothing to do")
            return

        stack_id = match["Id"]
        print(f"Deleting stack '{stack_name}' (id {stack_id})")
        resp = requests.delete(
            f"{portainer_url}/stacks/{stack_id}?endpointId={endpoint_id}",
            headers=headers,
        )
        resp.raise_for_status()
        print("Delete OK")

    except requests.HTTPError as e:
        print(f"HTTP error: {e}")
        if e.response is not None:
            print(f"Response: {e.response.text}")
        sys.exit(1)


if __name__ == "__main__":
    main()
