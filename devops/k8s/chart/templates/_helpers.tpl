{{/*
Common labels applied to every resource.
The instance label = release name (e.g. gr8-develop-extras) — used to filter
resources owned by this release.
*/}}
{{- define "gr8.labels" -}}
app.kubernetes.io/name: gr8
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: gr8
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" }}
{{- end -}}

{{/*
Per-component selector labels. Currently only "api" since api/frontend/db
moved to plain manifests in devops/k8s/manifests/.
*/}}
{{- define "gr8.selectorLabels" -}}
app.kubernetes.io/name: gr8
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: {{ .component }}
{{- end -}}

{{/*
Fully-qualified resource name per component, e.g. gr8-develop-extras-api.
Used by observability templates (ServiceMonitor/PrometheusRule/Dashboard).
*/}}
{{- define "gr8.fullname" -}}
{{ printf "%s-%s" .Release.Name .component | trunc 63 | trimSuffix "-" }}
{{- end -}}
