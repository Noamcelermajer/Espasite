# Allow a domain to invoke the Cloud Run service (run.invoker).
# Use the identity domain, e.g. espa-israel.com (not www.espa-israel.com).
# For custom URL www.espa-israel.com use: .\scripts\map-domain-cloudrun.ps1
param([Parameter(Mandatory=$true)] [string]$Domain)

$REGION = "europe-west1"
$SERVICE = "espa-israel"
$gcloudPath = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin"
$env:Path = "$gcloudPath;$env:Path"

$member = "domain:$Domain"
gcloud run services add-iam-policy-binding $SERVICE `
  --region $REGION `
  --member=$member `
  --role="roles/run.invoker"
