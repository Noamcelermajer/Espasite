#!/usr/bin/env bash
# One-time setup: GCS bucket, Cloud Run Job (scraper), Cloud Scheduler (every 6h).
# Run from repo root: bash scripts/setup-un2720-backend.sh
# Requires: gcloud CLI, same project as your main app.

set -e

PROJECT="${GCP_PROJECT:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${GCP_REGION:-europe-west1}"
BUCKET="${UN2720_BUCKET:-${PROJECT}-un2720-data}"
JOB_NAME="${UN2720_JOB_NAME:-un2720-scraper}"
SCHEDULER_NAME="${UN2720_SCHEDULER_NAME:-un2720-scrape}"
IMAGE="gcr.io/${PROJECT}/${JOB_NAME}"
GCS_OBJECT="un2720.json"

if [ -z "$PROJECT" ]; then
  echo "Error: set GCP_PROJECT or run gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo "Project: $PROJECT | Region: $REGION | Bucket: gs://$BUCKET | Job: $JOB_NAME"

# APIs
echo "Enabling APIs..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com storage.googleapis.com cloudscheduler.googleapis.com --project "$PROJECT"

# Bucket (same region as Run for low latency)
echo "Creating bucket gs://$BUCKET..."
gsutil ls -b "gs://${BUCKET}" 2>/dev/null || gsutil mb -p "$PROJECT" -l "$REGION" "gs://${BUCKET}"
# Public read so the app can fetch un2720.json without auth
echo "Making bucket publicly readable..."
gsutil iam ch allUsers:objectViewer "gs://${BUCKET}"

# Build scraper image (context = scripts/ so Dockerfile.scrape can COPY)
echo "Building image $IMAGE..."
gcloud builds submit --project "$PROJECT" --tag "$IMAGE" --timeout=1200 scripts/ -f scripts/Dockerfile.scrape

# Deploy Cloud Run Job
echo "Deploying Cloud Run Job $JOB_NAME..."
gcloud run jobs describe "$JOB_NAME" --region "$REGION" --project "$PROJECT" 2>/dev/null && \
  gcloud run jobs update "$JOB_NAME" --image "$IMAGE" --region "$REGION" --project "$PROJECT" \
    --set-env-vars "GCS_BUCKET=${BUCKET},GCS_OBJECT=${GCS_OBJECT}" --task-timeout 600 || \
  gcloud run jobs create "$JOB_NAME" --image "$IMAGE" --region "$REGION" --project "$PROJECT" \
    --set-env-vars "GCS_BUCKET=${BUCKET},GCS_OBJECT=${GCS_OBJECT}" --task-timeout 600

# Allow default compute SA to run the job (for Scheduler)
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT" --format='value(projectNumber)')
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
echo "Granting $COMPUTE_SA permission to run the job..."
gcloud run jobs add-iam-policy-binding "$JOB_NAME" --region "$REGION" --project "$PROJECT" \
  --member="serviceAccount:${COMPUTE_SA}" --role="roles/run.invoker"

# Cloud Scheduler: run job every 6 hours
echo "Creating Cloud Scheduler job $SCHEDULER_NAME..."
RUN_URI="https://run.googleapis.com/v2/projects/${PROJECT}/locations/${REGION}/jobs/${JOB_NAME}:run"
gcloud scheduler jobs describe "$SCHEDULER_NAME" --location "$REGION" --project "$PROJECT" 2>/dev/null && \
  gcloud scheduler jobs update http "$SCHEDULER_NAME" --location "$REGION" --project "$PROJECT" \
    --schedule "0 */6 * * *" --uri "$RUN_URI" --http-method POST \
    --oauth-service-account-email "$COMPUTE_SA" || \
  gcloud scheduler jobs create http "$SCHEDULER_NAME" --location "$REGION" --project "$PROJECT" \
    --schedule "0 */6 * * *" --uri "$RUN_URI" --http-method POST \
    --oauth-service-account-email "$COMPUTE_SA"

# Run once so first file exists
echo "Running job once to populate gs://${BUCKET}/${GCS_OBJECT}..."
gcloud run jobs execute "$JOB_NAME" --region "$REGION" --project "$PROJECT" --wait

DATA_URL="https://storage.googleapis.com/${BUCKET}/${GCS_OBJECT}"
echo ""
echo "--- Done ---"
echo "UN2720 data URL: $DATA_URL"
echo ""
echo "Set this env var on your main Cloud Run service (espa-israel) so the site uses it:"
echo "  UN2720_DATA_URL=$DATA_URL"
echo ""
echo "Example (update service env):"
echo "  gcloud run services update espa-israel --region $REGION --set-env-vars UN2720_DATA_URL=$DATA_URL"
echo ""
