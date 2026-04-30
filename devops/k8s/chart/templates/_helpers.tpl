{{/*
Common labels applied to every resource.
The instance label = release name (e.g. gr8-feature-foo) — used by stop_review_k3s
to delete all resources for a branch via -l app.kubernetes.io/instance=...
*/}}
{{- define "gr8.labels" -}}
app.kubernetes.io/name: gr8
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: gr8
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" }}
{{- end -}}

{{/*
Per-component selector labels. Component is one of: api, frontend, db.
*/}}
{{- define "gr8.selectorLabels" -}}
app.kubernetes.io/name: gr8
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: {{ .component }}
{{- end -}}

{{/*
Fully-qualified resource name per component, e.g. gr8-feature-foo-api.
Use this for Deployment/Service/StatefulSet names so multiple branches
coexist in a single namespace.
*/}}
{{- define "gr8.fullname" -}}
{{ printf "%s-%s" .Release.Name .component | trunc 63 | trimSuffix "-" }}
{{- end -}}

{{/*
Public hostname for this release. Single host, path-routed.
Wildcard cert at *.labb.k3s.chas-lab.dev is school-managed; ingress just declares the host.
*/}}
{{- define "gr8.host" -}}
{{ printf "%s.%s" .Release.Name .Values.hostBase }}
{{- end -}}

{{/*
Image reference for a component. Pass component name in $.component.
*/}}
{{- define "gr8.image" -}}
{{- $repo := index .Values.image (.component) "repository" -}}
{{ printf "%s/%s:%s" .Values.image.registry $repo .Values.image.tag }}
{{- end -}}

{{/*
Connection string the api uses. Targets the per-release db service.
*/}}
{{- define "gr8.dbConnectionString" -}}
{{- $dbHost := printf "%s-db" .Release.Name -}}
Server={{ $dbHost }};Database=CommunityDB;User Id=sa;Password=$(DB_PASSWORD);TrustServerCertificate=true
{{- end -}}
