# Deploy ESPA Israel site to Cloud Run (region with domain mapping support)
# See: https://cloud.google.com/run/docs/locations#domain_mappings
# If --allow-unauthenticated fails (org policy), run: .\scripts\allow-public-cloudrun.ps1
$REGION = "europe-west1"
$SERVICE = "espa-israel"
$gcloudPath = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin"
$env:Path = "$gcloudPath;$env:Path"

Set-Location $PSScriptRoot\..
gcloud run deploy $SERVICE `
  --source . `
  --region $REGION `
  --port 8080 `
  --cpu 1 `
  --memory 1Gi `
  --min-instances 0 `
  --max-instances 3 `
  --allow-unauthenticated
