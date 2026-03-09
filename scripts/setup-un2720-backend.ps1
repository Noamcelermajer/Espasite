# One-time setup: GCS bucket, Cloud Run Job (scraper), Cloud Scheduler (every 6h).
# Run from repo root: .\scripts\setup-un2720-backend.ps1
# Requires: gcloud CLI installed and gcloud auth login.

$ErrorActionPreference = "Stop"

$PROJECT = if ($env:GCP_PROJECT) { $env:GCP_PROJECT } else { (gcloud config get-value project 2>$null) }
$REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { "europe-west1" }
$BUCKET = if ($env:UN2720_BUCKET) { $env:UN2720_BUCKET } else { "$PROJECT-un2720-data" }
$JOB_NAME = if ($env:UN2720_JOB_NAME) { $env:UN2720_JOB_NAME } else { "un2720-scraper" }
$SCHEDULER_NAME = if ($env:UN2720_SCHEDULER_NAME) { $env:UN2720_SCHEDULER_NAME } else { "un2720-scrape" }
$IMAGE = "gcr.io/$PROJECT/$JOB_NAME"
$GCS_OBJECT = "un2720.json"

if (-not $PROJECT) {
  Write-Error "Set GCP_PROJECT or run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
}

Write-Host "Project: $PROJECT | Region: $REGION | Bucket: gs://$BUCKET | Job: $JOB_NAME"

# APIs
Write-Host "Enabling APIs..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com storage.googleapis.com cloudscheduler.googleapis.com --project $PROJECT

# Bucket
Write-Host "Creating bucket gs://$BUCKET..."
$bucketExists = gsutil ls -b "gs://$BUCKET" 2>$null
if (-not $bucketExists) { gsutil mb -p $PROJECT -l $REGION "gs://$BUCKET" }
Write-Host "Making bucket publicly readable..."
gsutil iam ch allUsers:objectViewer "gs://$BUCKET"

# Build
Write-Host "Building image $IMAGE..."
gcloud builds submit --project $PROJECT --tag $IMAGE --timeout=1200 scripts/ -f scripts/Dockerfile.scrape

# Deploy Cloud Run Job
Write-Host "Deploying Cloud Run Job $JOB_NAME..."
$jobExists = gcloud run jobs describe $JOB_NAME --region $REGION --project $PROJECT 2>$null
if ($jobExists) {
  gcloud run jobs update $JOB_NAME --image $IMAGE --region $REGION --project $PROJECT `
    --set-env-vars "GCS_BUCKET=$BUCKET,GCS_OBJECT=$GCS_OBJECT" --task-timeout 600
} else {
  gcloud run jobs create $JOB_NAME --image $IMAGE --region $REGION --project $PROJECT `
    --set-env-vars "GCS_BUCKET=$BUCKET,GCS_OBJECT=$GCS_OBJECT" --task-timeout 600
}

# IAM for Scheduler
$PROJECT_NUMBER = (gcloud projects describe $PROJECT --format="value(projectNumber)")
$COMPUTE_SA = "$PROJECT_NUMBER-compute@developer.gserviceaccount.com"
Write-Host "Granting $COMPUTE_SA permission to run the job..."
gcloud run jobs add-iam-policy-binding $JOB_NAME --region $REGION --project $PROJECT `
  --member="serviceAccount:$COMPUTE_SA" --role="roles/run.invoker"

# Scheduler
$RUN_URI = "https://run.googleapis.com/v2/projects/$PROJECT/locations/$REGION/jobs/$JOB_NAME`:run"
Write-Host "Creating Cloud Scheduler job $SCHEDULER_NAME..."
$schedExists = gcloud scheduler jobs describe $SCHEDULER_NAME --location $REGION --project $PROJECT 2>$null
if ($schedExists) {
  gcloud scheduler jobs update http $SCHEDULER_NAME --location $REGION --project $PROJECT `
    --schedule "0 */6 * * *" --uri $RUN_URI --http-method POST --oauth-service-account-email $COMPUTE_SA
} else {
  gcloud scheduler jobs create http $SCHEDULER_NAME --location $REGION --project $PROJECT `
    --schedule "0 */6 * * *" --uri $RUN_URI --http-method POST --oauth-service-account-email $COMPUTE_SA
}

# Run once
Write-Host "Running job once to populate gs://$BUCKET/$GCS_OBJECT..."
gcloud run jobs execute $JOB_NAME --region $REGION --project $PROJECT --wait

$DATA_URL = "https://storage.googleapis.com/$BUCKET/$GCS_OBJECT"
Write-Host ""
Write-Host "--- Done ---"
Write-Host "UN2720 data URL: $DATA_URL"
Write-Host ""
Write-Host "Set this env var on your main Cloud Run service (espa-israel):"
Write-Host "  UN2720_DATA_URL=$DATA_URL"
Write-Host ""
Write-Host "Example:"
Write-Host "  gcloud run services update espa-israel --region $REGION --set-env-vars UN2720_DATA_URL=$DATA_URL"
Write-Host ""
