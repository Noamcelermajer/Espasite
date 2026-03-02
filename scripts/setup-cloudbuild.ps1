# One-time setup for Cloud Build push-to-deploy.
# Run from repo root: .\scripts\setup-cloudbuild.ps1
# Requires: gcloud authenticated, project set (gcloud config set project PROJECT_ID)

$REGION = "europe-west1"
$PROJECT_ID = $(gcloud config get-value project 2>$null)
if (-not $PROJECT_ID) {
  Write-Error "No GCP project set. Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
}

Write-Host "Enabling APIs (if not already)..." -ForegroundColor Cyan
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com --project $PROJECT_ID

Write-Host "Creating Artifact Registry repo (ignore error if it already exists)..." -ForegroundColor Cyan
gcloud artifacts repositories create docker --repository-format=docker --location=$REGION --project $PROJECT_ID 2>$null

$PROJECT_NUMBER = $(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
$CB_SA = "${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
Write-Host "Granting Cloud Build SA permission to deploy to Cloud Run..." -ForegroundColor Cyan
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${CB_SA}" --role="roles/run.admin" --quiet 2>$null
gcloud iam service-accounts add-iam-policy-binding "${PROJECT_ID}@appspot.gserviceaccount.com" --member="serviceAccount:${CB_SA}" --role="roles/iam.serviceAccountUser" --project $PROJECT_ID --quiet 2>$null

Write-Host "`nDone. Next: create a push trigger in the Console:" -ForegroundColor Green
Write-Host "  1. Open: https://console.cloud.google.com/cloud-build/triggers?project=$PROJECT_ID" -ForegroundColor White
Write-Host "  2. Connect your repository (GitHub / GitLab / Cloud Source Repositories)." -ForegroundColor White
Write-Host "  3. Create Trigger > Push to a branch." -ForegroundColor White
Write-Host "  4. Branch: ^main$ (or your default branch)." -ForegroundColor White
Write-Host "  5. Build configuration: Cloud Build configuration file (yaml or json)." -ForegroundColor White
Write-Host "  6. Location: cloudbuild.yaml (repo root)." -ForegroundColor White
Write-Host "  7. Save. Push to the branch to run the build." -ForegroundColor White
