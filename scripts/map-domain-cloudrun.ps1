# Map custom domain www.espa-israel.com to the Cloud Run service.
# 1. Verify base domain first (one-time): opens Search Console for espa-israel.com
# 2. Create domain mapping
# 3. Add the DNS records shown by step 2 at your registrar (CNAME/A/AAAA)
$REGION = "europe-west1"
$SERVICE = "espa-israel"
$DOMAIN = "www.espa-israel.com"
$BASE_DOMAIN = "espa-israel.com"
$gcloudPath = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin"
$env:Path = "$gcloudPath;$env:Path"

Write-Host "Step 1: Verify base domain $BASE_DOMAIN (one-time, opens browser)..." -ForegroundColor Cyan
gcloud domains verify $BASE_DOMAIN

Write-Host "`nStep 2: Create domain mapping $DOMAIN -> $SERVICE..." -ForegroundColor Cyan
gcloud beta run domain-mappings create --service $SERVICE --domain $DOMAIN --region $REGION

Write-Host "`nStep 3: Get DNS records to add at your registrar:" -ForegroundColor Cyan
gcloud beta run domain-mappings describe --domain $DOMAIN --region $REGION --format="yaml(spec.resourceRecords)"
