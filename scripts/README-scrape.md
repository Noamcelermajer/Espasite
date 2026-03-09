# UN2720 backend scraper (no GitHub → no extra rebuilds)

Data is scraped by a **backend job** (Python + Playwright). The app reads from a URL (e.g. GCS); no commit, no rebuild.

## 1. Remove GitHub Action (done)

The workflow that committed `public/data/un2720.json` was removed so Cloud Build is not triggered on data updates.

## 2. Run the scraper and store in GCS

### Option A: Manual setup (copy-paste)

Replace `YOUR_PROJECT` with your GCP project ID. Run from **repo root**.

**1. Set project and enable APIs**
```bash
gcloud config set project YOUR_PROJECT
gcloud services enable cloudbuild.googleapis.com run.googleapis.com storage.googleapis.com cloudscheduler.googleapis.com --project YOUR_PROJECT
```

**2. Create bucket and make it public**
```bash
gsutil mb -p YOUR_PROJECT -l europe-west1 gs://YOUR_PROJECT-un2720-data
gsutil iam ch allUsers:objectViewer gs://YOUR_PROJECT-un2720-data
```

**3. Build scraper image**
```bash
gcloud builds submit --project YOUR_PROJECT --tag gcr.io/YOUR_PROJECT/un2720-scraper --timeout=1200 scripts/ -f scripts/Dockerfile.scrape
```

**4. Deploy Cloud Run Job**
```bash
gcloud run jobs create un2720-scraper --image gcr.io/YOUR_PROJECT/un2720-scraper --region europe-west1 --project YOUR_PROJECT --set-env-vars "GCS_BUCKET=YOUR_PROJECT-un2720-data,GCS_OBJECT=un2720.json" --task-timeout 600
```

**5. Get project number and grant invoker**
```bash
# Replace YOUR_PROJECT_NUMBER with output of:
gcloud projects describe YOUR_PROJECT --format="value(projectNumber)"

gcloud run jobs add-iam-policy-binding un2720-scraper --region europe-west1 --project YOUR_PROJECT --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" --role="roles/run.invoker"
```

**6. Create Scheduler job (every 6 hours)**
```bash
gcloud scheduler jobs create http un2720-scrape --location europe-west1 --project YOUR_PROJECT --schedule "0 */6 * * *" --uri "https://run.googleapis.com/v2/projects/YOUR_PROJECT/locations/europe-west1/jobs/un2720-scraper:run" --http-method POST --oauth-service-account-email YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com
```

**7. Run job once to populate the file**
```bash
gcloud run jobs execute un2720-scraper --region europe-west1 --project YOUR_PROJECT --wait
```

**8. Set app env so the site uses GCS**
```bash
gcloud run services update espa-israel --region europe-west1 --project YOUR_PROJECT --set-env-vars "UN2720_DATA_URL=https://storage.googleapis.com/YOUR_PROJECT-un2720-data/un2720.json"
```

Data URL: `https://storage.googleapis.com/YOUR_PROJECT-un2720-data/un2720.json`

---

### Option B: Script (bash or PowerShell)

From repo root: `bash scripts/setup-un2720-backend.sh` or `.\scripts\setup-un2720-backend.ps1`. Same steps as above, with defaults from `gcloud config`.

### Option C: Run locally or on a VM

```bash
 cd scripts
 pip install -r requirements-scrape.txt
 playwright install chromium
 export GCS_BUCKET=your-bucket
 export GCS_OBJECT=un2720.json
 python scrape_un2720.py
```

Without `GCS_BUCKET`, the script prints JSON to stdout (e.g. redirect to `../public/data/un2720.json` if you still want to commit manually).

## 3. App config

- **UN2720_DATA_URL** (optional): URL of the scraped JSON. If set, the app fetches from here (e.g. GCS public URL). If not set, it falls back to `{NEXT_PUBLIC_SITE_URL}/data/un2720.json` (static file from the last deploy).
