---
title: ☁️ Google Cloud Build & Deploy
---

# Google Cloud Build & Deploy

Google Cloud Platform offers a comprehensive suite of CI/CD tools including Cloud Build, Cloud Source Repositories, Cloud Deploy, and Artifact Registry. This guide covers the complete native GCP CI/CD solution.

---

## Table of Contents

1. [Introduction & GCP CI/CD Services](#introduction--gcp-cicd-services)
2. [Architecture & Components](#architecture--components)
3. [Getting Started](#getting-started)
4. [Cloud Source Repositories](#cloud-source-repositories)
5. [Cloud Build](#cloud-build)
6. [Cloud Deploy](#cloud-deploy)
7. [Artifact Registry](#artifact-registry)
8. [IAM Permissions & Security](#iam-permissions--security)
9. [Container Deployments](#container-deployments)
10. [Cloud Run Deployments](#cloud-run-deployments)
11. [GKE Deployments](#gke-deployments)
12. [Cloud Functions Deployments](#cloud-functions-deployments)
13. [Advanced Pipeline Patterns](#advanced-pipeline-patterns)
14. [Monitoring & Notifications](#monitoring--notifications)
15. [Best Practices](#best-practices)
16. [Troubleshooting](#troubleshooting)
17. [Example Pipelines](#example-pipelines)

---

## Introduction & GCP CI/CD Services

### GCP Developer Tools Ecosystem

Google Cloud provides a complete suite of CI/CD tools:

| Service | Function | Comparable to |
|---------|----------|---------------|
| **Cloud Source Repositories** | Git Repository | GitHub, GitLab, AWS CodeCommit |
| **Cloud Build** | Build & Test | Jenkins, GitHub Actions, AWS CodeBuild |
| **Cloud Deploy** | Deployment Pipeline | Spinnaker, AWS CodeDeploy |
| **Artifact Registry** | Artifact Repository | Docker Hub, Nexus, AWS CodeArtifact |
| **Binary Authorization** | Deployment Security | Policy enforcement |
| **Cloud Scheduler** | Scheduled Builds | Cron jobs |

### Why GCP-native CI/CD?

**Advantages:**

- ✅ Seamless GCP integration (GCE, GKE, Cloud Run, Cloud Functions)
- ✅ IAM-based security and permissions
- ✅ No server management (fully managed)
- ✅ Pay-per-use pricing (billed per build minute)
- ✅ Automatic scaling
- ✅ Native Docker/container support
- ✅ Integration with GitHub, Bitbucket, GitLab

**Disadvantages:**

- ❌ Vendor lock-in
- ❌ Less mature than established tools
- ❌ Limited plugin ecosystem
- ❌ Fewer third-party integrations

### Typical Workflow

```text
Developer Push
    ↓
Cloud Source Repositories / GitHub
    ↓
Cloud Build Trigger
    ↓
Cloud Build (Build & Test)
    ↓
Artifact Registry (Store Images/Artifacts)
    ↓
Cloud Deploy (Deployment Pipeline)
    ↓
GKE / Cloud Run / Cloud Functions / Compute Engine
```

---

## Architecture & Components

### Cloud Build Pipeline Structure

```text
Cloud Build
├── Trigger: Push to main branch
├── Build Steps:
│   ├── Step 1: Install dependencies
│   ├── Step 2: Run tests
│   ├── Step 3: Build Docker image
│   ├── Step 4: Push to Artifact Registry
│   └── Step 5: Deploy to GKE/Cloud Run
└── Notifications: Pub/Sub, Email, Slack
```

### Build Steps vs Stages

Unlike AWS CodePipeline's stages, Cloud Build uses **steps** that execute sequentially or in parallel:

```yaml
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', 'gcr.io/$PROJECT_ID/myapp', '.']
  
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', 'gcr.io/$PROJECT_ID/myapp']
  
- name: 'gcr.io/cloud-builders/gcloud'
  args: ['run', 'deploy', 'myapp', '--image', 'gcr.io/$PROJECT_ID/myapp']
```

### Artifact Flow

```text
Source Code → Cloud Build → Artifact Registry → Cloud Deploy → Target Environment
```

---

## Getting Started

### Prerequisites

1. **GCP Account** with billing enabled
2. **gcloud CLI** installed and configured
3. **Git** for version control
4. **Project with required APIs enabled:**
   - Cloud Build API
   - Cloud Source Repositories API
   - Artifact Registry API
   - Cloud Deploy API

### gcloud CLI Installation

```bash
# macOS
brew install --cask google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Windows
# Download installer from https://cloud.google.com/sdk/docs/install

# Initialize gcloud
gcloud init

# Login
gcloud auth login

# Set project
gcloud config set project PROJECT_ID
```

### Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable sourcerepo.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable clouddeploy.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable container.googleapis.com
```

### Verify Installation

```bash
gcloud --version
gcloud config list
gcloud projects list
```

---

## Cloud Source Repositories

### Creating a Repository

**Via gcloud CLI:**

```bash
gcloud source repos create my-app --project=PROJECT_ID
```

**Via Console:**

1. Navigate to **Cloud Source Repositories → Add repository**
2. Create new repository: `my-app`
3. Click **Create**

### Configure Git Credentials

**Option 1: gcloud credentials helper**

```bash
git config --global credential.https://source.developers.google.com.helper gcloud.sh
```

**Clone repository:**

```bash
gcloud source repos clone my-app --project=PROJECT_ID
cd my-app
```

**Option 2: Manual authentication**

```bash
# Generate credentials
gcloud auth application-default login

# Clone with generated credentials
git clone https://source.developers.google.com/p/PROJECT_ID/r/my-app
```

### Mirror from GitHub/GitLab

**Connect GitHub repository:**

```bash
# Via Console: Cloud Source Repositories → Add repository → Connect external repository
# Select GitHub and authorize
# Choose repository to mirror
```

**Manual mirroring:**

```bash
# Clone GitHub repo
git clone https://github.com/username/repo.git
cd repo

# Add Cloud Source Repo as remote
git remote add google https://source.developers.google.com/p/PROJECT_ID/r/my-app

# Push to Google Cloud
git push google main
```

### Working with Cloud Source Repositories

```bash
# Add files
echo "# My App" > README.md
git add README.md
git commit -m "Initial commit"

# Push to Cloud Source Repositories
git push origin main

# Create feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature
```

---

## Cloud Build

### What is Cloud Build?

Fully managed CI/CD platform that:

- Executes builds in containerized environments
- Supports Docker, custom builders
- Integrates with GitHub, Bitbucket, Cloud Source Repositories
- Scales automatically
- Pay per build minute (120 free minutes/day)

### Build Configuration (cloudbuild.yaml)

The `cloudbuild.yaml` defines build steps:

```yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: npm
    args: ['ci']
    
  # Run linter
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'lint']
    
  # Run tests
  - name: 'node:18'
    entrypoint: npm
    args: ['test']
    env:
      - 'CI=true'
    
  # Build application
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'build']
    
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/my-app:$COMMIT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/my-app:latest'
      - '.'
    
  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'gcr.io/$PROJECT_ID/my-app:$COMMIT_SHA'

images:
  - 'gcr.io/$PROJECT_ID/my-app:$COMMIT_SHA'
  - 'gcr.io/$PROJECT_ID/my-app:latest'

options:
  machineType: 'N1_HIGHCPU_8'
  logging: CLOUD_LOGGING_ONLY
```

### Built-in Substitutions

Cloud Build provides automatic variables:

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/myapp:$SHORT_SHA', '.']
```

**Available substitutions:**

- `$PROJECT_ID` - GCP Project ID
- `$BUILD_ID` - Unique build ID
- `$COMMIT_SHA` - Full git commit SHA
- `$SHORT_SHA` - Short commit SHA (7 characters)
- `$REPO_NAME` - Repository name
- `$BRANCH_NAME` - Branch name
- `$TAG_NAME` - Tag name
- `$REVISION_ID` - Source revision ID

### Creating Build Triggers

**Via gcloud CLI:**

```bash
gcloud builds triggers create cloud-source-repositories \
    --repo=my-app \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml \
    --region=us-central1
```

**Via Console:**

1. Navigate to **Cloud Build → Triggers → Create trigger**
2. **Name:** `my-app-trigger`
3. **Event:** Push to branch
4. **Source:** Cloud Source Repositories
5. **Repository:** `my-app`
6. **Branch:** `^main$` (regex)
7. **Build configuration:** Cloud Build configuration file
8. **Location:** `/cloudbuild.yaml`
9. Click **Create**

### GitHub Integration

**Connect GitHub repository:**

```bash
gcloud builds triggers create github \
    --repo-name=my-app \
    --repo-owner=username \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml
```

**Via Console:**

1. Cloud Build → Triggers → Create trigger
2. Connect repository → GitHub → Authorize
3. Select repository
4. Configure trigger (branch, PR, tag)

### Manual Build Trigger

```bash
# Trigger build from local source
gcloud builds submit --config=cloudbuild.yaml .

# Trigger build from repository
gcloud builds triggers run my-app-trigger --branch=main
```

### Parallel Steps

```yaml
steps:
  # Run tests in parallel
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'test:unit']
    id: 'unit-tests'
    waitFor: ['-']  # Start immediately
    
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'test:integration']
    id: 'integration-tests'
    waitFor: ['-']  # Start immediately
    
  # Build after tests complete
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'build']
    waitFor: ['unit-tests', 'integration-tests']
```

### Caching

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        docker pull gcr.io/$PROJECT_ID/my-app:latest || exit 0
        docker build \
          --cache-from gcr.io/$PROJECT_ID/my-app:latest \
          -t gcr.io/$PROJECT_ID/my-app:$SHORT_SHA \
          .
```

### Build Secrets

**Create secret in Secret Manager:**

```bash
echo -n "my-api-key" | gcloud secrets create api-key --data-file=-
```

**Use in Cloud Build:**

```yaml
availableSecrets:
  secretManager:
    - versionName: projects/PROJECT_ID/secrets/api-key/versions/latest
      env: 'API_KEY'

steps:
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['run', 'deploy']
    secretEnv: ['API_KEY']
```

---

## Cloud Deploy

### What is Cloud Deploy?

Managed continuous delivery service for GKE and Cloud Run:

- Progressive delivery strategies
- Automated rollouts
- Approval workflows
- Rollback capabilities

### Creating a Delivery Pipeline

**clouddeploy.yaml:**

```yaml
apiVersion: deploy.cloud.google.com/v1
kind: DeliveryPipeline
metadata:
  name: my-app-pipeline
description: Deployment pipeline for my-app
serialPipeline:
  stages:
    - targetId: dev
      profiles: [dev]
    - targetId: staging
      profiles: [staging]
    - targetId: prod
      profiles: [prod]
      strategy:
        standard:
          verify: true
```

**Define targets:**

```yaml
---
apiVersion: deploy.cloud.google.com/v1
kind: Target
metadata:
  name: dev
description: Development environment
gke:
  cluster: projects/PROJECT_ID/locations/us-central1/clusters/dev-cluster

---
apiVersion: deploy.cloud.google.com/v1
kind: Target
metadata:
  name: staging
description: Staging environment
requireApproval: false
gke:
  cluster: projects/PROJECT_ID/locations/us-central1/clusters/staging-cluster

---
apiVersion: deploy.cloud.google.com/v1
kind: Target
metadata:
  name: prod
description: Production environment
requireApproval: true
gke:
  cluster: projects/PROJECT_ID/locations/us-central1/clusters/prod-cluster
```

**Apply pipeline:**

```bash
gcloud deploy apply --file=clouddeploy.yaml --region=us-central1
```

### Creating a Release

```bash
gcloud deploy releases create release-001 \
    --delivery-pipeline=my-app-pipeline \
    --region=us-central1 \
    --images=my-app=gcr.io/PROJECT_ID/my-app:v1.0.0
```

**Automated release from Cloud Build:**

```yaml
steps:
  # Build and push image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/my-app:$SHORT_SHA', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/my-app:$SHORT_SHA']
  
  # Create Cloud Deploy release
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'deploy'
      - 'releases'
      - 'create'
      - 'release-${SHORT_SHA}'
      - '--delivery-pipeline=my-app-pipeline'
      - '--region=us-central1'
      - '--images=my-app=gcr.io/$PROJECT_ID/my-app:$SHORT_SHA'
```

### Approval Workflow

**Approve deployment:**

```bash
gcloud deploy rollouts approve ROLLOUT_NAME \
    --delivery-pipeline=my-app-pipeline \
    --region=us-central1 \
    --release=release-001
```

### Progressive Delivery Strategies

**Canary deployment:**

```yaml
apiVersion: deploy.cloud.google.com/v1
kind: Target
metadata:
  name: prod
gke:
  cluster: projects/PROJECT_ID/locations/us-central1/clusters/prod-cluster
strategy:
  canary:
    runtimeConfig:
      kubernetes:
        gatewayServiceMesh:
          service: my-app-service
          deployment: my-app-deployment
    canaryDeployment:
      percentages: [25, 50, 100]
      verify: true
```

---

## Artifact Registry

### What is Artifact Registry?

Universal package manager for:

- Docker/OCI container images
- npm packages
- Maven artifacts
- Python packages (PyPI)
- APT packages
- YUM packages

### Creating a Repository

```bash
# Docker repository
gcloud artifacts repositories create my-app-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository for my-app"

# npm repository
gcloud artifacts repositories create npm-repo \
    --repository-format=npm \
    --location=us-central1

# Maven repository
gcloud artifacts repositories create maven-repo \
    --repository-format=maven \
    --location=us-central1
```

### Configure Docker Authentication

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### Push/Pull Docker Images

```bash
# Tag image
docker tag my-app:latest us-central1-docker.pkg.dev/PROJECT_ID/my-app-repo/my-app:latest

# Push image
docker push us-central1-docker.pkg.dev/PROJECT_ID/my-app-repo/my-app:latest

# Pull image
docker pull us-central1-docker.pkg.dev/PROJECT_ID/my-app-repo/my-app:latest
```

### Use in Cloud Build

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '.'
  
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'

images:
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
```

### npm with Artifact Registry

**Authenticate:**

```bash
npx google-artifactregistry-auth --repo-config=.npmrc --location=us-central1
```

**.npmrc:**

```text
registry=https://us-central1-npm.pkg.dev/PROJECT_ID/npm-repo/
//us-central1-npm.pkg.dev/PROJECT_ID/npm-repo/:always-auth=true
```

**Publish package:**

```bash
npm publish
```

### Maven with Artifact Registry

**pom.xml:**

```xml
<distributionManagement>
  <repository>
    <id>artifact-registry</id>
    <url>artifactregistry://us-central1-maven.pkg.dev/PROJECT_ID/maven-repo</url>
  </repository>
</distributionManagement>

<repositories>
  <repository>
    <id>artifact-registry</id>
    <url>artifactregistry://us-central1-maven.pkg.dev/PROJECT_ID/maven-repo</url>
    <releases>
      <enabled>true</enabled>
    </releases>
    <snapshots>
      <enabled>true</enabled>
    </snapshots>
  </repository>
</repositories>
```

**Configure authentication:**

```bash
gcloud artifacts print-settings mvn \
    --repository=maven-repo \
    --location=us-central1
```

---

## IAM Permissions & Security

### Cloud Build Service Account

Default service account: `PROJECT_NUMBER@cloudbuild.gserviceaccount.com`

**Grant permissions:**

```bash
# Allow Cloud Build to deploy to Cloud Run
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member=serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/run.admin

# Allow Cloud Build to act as Cloud Run runtime service account
gcloud iam service-accounts add-iam-policy-binding \
    PROJECT_NUMBER-compute@developer.gserviceaccount.com \
    --member=serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/iam.serviceAccountUser

# Allow Cloud Build to access GKE
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member=serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/container.developer
```

### Custom Service Account

```bash
# Create service account
gcloud iam service-accounts create cloud-build-sa \
    --display-name="Cloud Build Service Account"

# Grant roles
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member=serviceAccount:cloud-build-sa@PROJECT_ID.iam.gserviceaccount.com \
    --role=roles/cloudbuild.builds.builder

# Use in build trigger
gcloud builds triggers update my-app-trigger \
    --service-account=projects/PROJECT_ID/serviceAccounts/cloud-build-sa@PROJECT_ID.iam.gserviceaccount.com
```

### Secret Manager Integration

```yaml
availableSecrets:
  secretManager:
    - versionName: projects/PROJECT_ID/secrets/database-password/versions/latest
      env: 'DB_PASSWORD'
    - versionName: projects/PROJECT_ID/secrets/api-key/versions/latest
      env: 'API_KEY'

steps:
  - name: 'gcr.io/cloud-builders/gcloud'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        echo "Deploying with secrets..."
        echo "DB Password: $${DB_PASSWORD}"
    secretEnv: ['DB_PASSWORD', 'API_KEY']
```

### Binary Authorization

**Enable Binary Authorization:**

```bash
gcloud services enable binaryauthorization.googleapis.com

# Create policy
cat > policy.yaml <<EOF
admissionWhitelistPatterns:
- namePattern: gcr.io/google-containers/*
defaultAdmissionRule:
  requireAttestationsBy:
  - projects/PROJECT_ID/attestors/prod-attestor
  evaluationMode: REQUIRE_ATTESTATION
  enforcementMode: ENFORCED_BLOCK_AND_AUDIT_LOG
globalPolicyEvaluationMode: ENABLE
EOF

gcloud container binauthz policy import policy.yaml
```

---

## Container Deployments

### Complete GKE Deployment Pipeline

#### 1. Create GKE Cluster

```bash
gcloud container clusters create my-app-cluster \
    --num-nodes=3 \
    --machine-type=n1-standard-2 \
    --region=us-central1 \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=5 \
    --enable-autorepair \
    --enable-autoupgrade
```

#### 2. Kubernetes Manifests

**k8s/deployment.yaml:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: us-central1-docker.pkg.dev/PROJECT_ID/my-app-repo/my-app:latest
        ports:
        - containerPort: 8080
        env:
        - name: PORT
          value: "8080"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 8080
```

#### 3. Cloud Build for GKE

**cloudbuild.yaml:**

```yaml
steps:
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:latest'
      - '.'
  
  # Push Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
  
  # Deploy to GKE
  - name: 'gcr.io/cloud-builders/gke-deploy'
    args:
      - 'run'
      - '--filename=k8s/'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '--location=us-central1'
      - '--cluster=my-app-cluster'

images:
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:latest'
```

#### 4. Deploy with kubectl

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA']
  
  - name: 'gcr.io/cloud-builders/kubectl'
    args:
      - 'set'
      - 'image'
      - 'deployment/my-app'
      - 'my-app=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
    env:
      - 'CLOUDSDK_COMPUTE_REGION=us-central1'
      - 'CLOUDSDK_CONTAINER_CLUSTER=my-app-cluster'
```

---

## Cloud Run Deployments

### What is Cloud Run?

Fully managed serverless platform for containers:

- Auto-scaling from 0 to N instances
- Pay per request
- HTTPS endpoint automatically provisioned
- Blue/green deployments

### Deploy to Cloud Run

**cloudbuild.yaml:**

```yaml
steps:
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '.'
  
  # Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
  
  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'my-app'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
      - '--allow-unauthenticated'
      - '--memory=512Mi'
      - '--cpu=1'
      - '--max-instances=10'
      - '--min-instances=0'
      - '--port=8080'
      - '--set-env-vars=NODE_ENV=production'

images:
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
```

### Cloud Run with Traffic Splitting

```bash
# Deploy new revision without traffic
gcloud run deploy my-app \
    --image=us-central1-docker.pkg.dev/PROJECT_ID/my-app-repo/my-app:v2 \
    --region=us-central1 \
    --no-traffic \
    --tag=v2

# Gradually shift traffic (canary)
gcloud run services update-traffic my-app \
    --region=us-central1 \
    --to-revisions=v2=10,LATEST=90

# Full rollout
gcloud run services update-traffic my-app \
    --region=us-central1 \
    --to-latest
```

### Cloud Run with Secrets

```yaml
steps:
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'my-app'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '--region=us-central1'
      - '--update-secrets=DATABASE_URL=database-url:latest'
      - '--update-secrets=API_KEY=api-key:latest'
```

---

## GKE Deployments

### Helm Chart Deployment

**cloudbuild.yaml:**

```yaml
steps:
  # Build and push image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA']
  
  # Deploy with Helm
  - name: 'gcr.io/$PROJECT_ID/helm'
    args:
      - 'upgrade'
      - '--install'
      - 'my-app'
      - './helm/my-app'
      - '--set'
      - 'image.repository=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app'
      - '--set'
      - 'image.tag=$SHORT_SHA'
      - '--namespace=production'
    env:
      - 'CLOUDSDK_COMPUTE_REGION=us-central1'
      - 'CLOUDSDK_CONTAINER_CLUSTER=my-app-cluster'
      - 'TILLERLESS=true'
```

### Kustomize Deployment

**cloudbuild.yaml:**

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA']
  
  - name: 'gcr.io/cloud-builders/kubectl'
    args:
      - 'kustomize'
      - 'edit'
      - 'set'
      - 'image'
      - 'my-app=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
    dir: 'k8s/overlays/production'
  
  - name: 'gcr.io/cloud-builders/kubectl'
    args: ['apply', '-k', 'k8s/overlays/production']
    env:
      - 'CLOUDSDK_COMPUTE_REGION=us-central1'
      - 'CLOUDSDK_CONTAINER_CLUSTER=my-app-cluster'
```

---

## Cloud Functions Deployments

### Deploy Cloud Function (Gen 2)

**cloudbuild.yaml:**

```yaml
steps:
  # Deploy Cloud Function
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'functions'
      - 'deploy'
      - 'my-function'
      - '--gen2'
      - '--runtime=nodejs18'
      - '--region=us-central1'
      - '--source=.'
      - '--entry-point=myFunction'
      - '--trigger-http'
      - '--allow-unauthenticated'
      - '--set-env-vars=NODE_ENV=production'
      - '--memory=256MB'
      - '--timeout=60s'
```

### Cloud Function with Pub/Sub Trigger

```yaml
steps:
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'functions'
      - 'deploy'
      - 'my-pubsub-function'
      - '--gen2'
      - '--runtime=python311'
      - '--region=us-central1'
      - '--source=.'
      - '--entry-point=process_message'
      - '--trigger-topic=my-topic'
      - '--set-env-vars=DATABASE_URL=${_DATABASE_URL}'
```

---

## Advanced Pipeline Patterns

### Multi-Environment Deployment

```yaml
steps:
  # Build
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA']
  
  # Deploy to Dev
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'my-app-dev'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
    id: 'deploy-dev'
  
  # Deploy to Staging (after dev succeeds)
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'my-app-staging'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
    waitFor: ['deploy-dev']
    id: 'deploy-staging'
  
  # Manual approval step would be here (use Cloud Deploy for this)
  
  # Deploy to Production
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'my-app-prod'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
    waitFor: ['deploy-staging']
```

### Multi-Region Deployment

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA']
  
  # Deploy to us-central1
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'my-app'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
    id: 'deploy-us-central1'
    waitFor: ['-']
  
  # Deploy to europe-west1 (parallel)
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'my-app'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '--region=europe-west1'
      - '--platform=managed'
    id: 'deploy-europe-west1'
    waitFor: ['-']
  
  # Deploy to asia-east1 (parallel)
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'my-app'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '--region=asia-east1'
      - '--platform=managed'
    id: 'deploy-asia-east1'
    waitFor: ['-']
```

### Integration Tests

```yaml
steps:
  # Build
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'my-app:test', '.']
  
  # Run unit tests
  - name: 'my-app:test'
    args: ['npm', 'test']
    id: 'unit-tests'
  
  # Deploy to test environment
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'my-app-test'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'
      - '--region=us-central1'
    waitFor: ['unit-tests']
    id: 'deploy-test'
  
  # Run integration tests
  - name: 'gcr.io/cloud-builders/curl'
    args:
      - '-f'
      - 'https://my-app-test-xyz.run.app/health'
    waitFor: ['deploy-test']
  
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['run', 'test:integration']
    env:
      - 'TEST_URL=https://my-app-test-xyz.run.app'
    waitFor: ['deploy-test']
```

### Custom Builder Images

**Create custom builder:**

```dockerfile
# cloudbuild-builder/Dockerfile
FROM node:18-alpine

RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

RUN npm install -g firebase-tools

ENTRYPOINT ["npm"]
```

**Build and push:**

```bash
cd cloudbuild-builder
gcloud builds submit --tag=us-central1-docker.pkg.dev/PROJECT_ID/builders/node-firebase
```

**Use in cloudbuild.yaml:**

```yaml
steps:
  - name: 'us-central1-docker.pkg.dev/$PROJECT_ID/builders/node-firebase'
    args: ['run', 'deploy:firebase']
```

---

## Monitoring & Notifications

### Cloud Build Pub/Sub Notifications

**Create Pub/Sub topic:**

```bash
gcloud pubsub topics create cloud-builds
```

**Subscribe to build events:**

```bash
gcloud pubsub subscriptions create cloud-builds-sub \
    --topic=cloud-builds
```

**Configure Cloud Build to publish:**

Cloud Build automatically publishes to `cloud-builds` topic.

**Listen to events:**

```python
from google.cloud import pubsub_v1
import json

subscriber = pubsub_v1.SubscriberClient()
subscription_path = subscriber.subscription_path('PROJECT_ID', 'cloud-builds-sub')

def callback(message):
    build = json.loads(message.data.decode('utf-8'))
    print(f"Build {build['id']}: {build['status']}")
    message.ack()

subscriber.subscribe(subscription_path, callback=callback)
```

### Slack Notifications

**Cloud Function for Slack:**

```javascript
const {IncomingWebhook} = require('@slack/webhook');

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

exports.notifySlack = async (message, context) => {
  const build = message.data
    ? JSON.parse(Buffer.from(message.data, 'base64').toString())
    : null;

  const status = build.status;
  
  if (status === 'SUCCESS' || status === 'FAILURE' || status === 'TIMEOUT') {
    await webhook.send({
      text: `Build ${build.id} ${status}`,
      attachments: [{
        color: status === 'SUCCESS' ? 'good' : 'danger',
        fields: [
          {title: 'Project', value: build.projectId, short: true},
          {title: 'Branch', value: build.substitutions.BRANCH_NAME, short: true},
          {title: 'Commit', value: build.substitutions.SHORT_SHA, short: true},
          {title: 'Logs', value: build.logUrl, short: false}
        ]
      }]
    });
  }
};
```

**Deploy function:**

```bash
gcloud functions deploy notifySlack \
    --gen2 \
    --runtime=nodejs18 \
    --region=us-central1 \
    --source=. \
    --entry-point=notifySlack \
    --trigger-topic=cloud-builds \
    --set-env-vars=SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Email Notifications

**cloudbuild.yaml with email:**

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'my-app', '.']

options:
  logging: CLOUD_LOGGING_ONLY

# Email notifications configured in trigger settings
```

**Via gcloud:**

```bash
gcloud builds triggers update my-app-trigger \
    --subscription=projects/PROJECT_ID/topics/cloud-builds
```

### Cloud Monitoring Integration

**Custom metrics:**

```yaml
steps:
  - name: 'gcr.io/cloud-builders/gcloud'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        gcloud logging write build-metric \
          "Build completed successfully" \
          --severity=INFO \
          --resource=build \
          --labels=build_id=${BUILD_ID},status=SUCCESS
```

---

## Best Practices

### 1. Use Artifact Registry (not Container Registry)

```yaml
# ✅ Recommended
images:
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA'

# ❌ Deprecated
images:
  - 'gcr.io/$PROJECT_ID/my-app:$SHORT_SHA'
```

### 2. Cache Docker Layers

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        docker pull us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:latest || exit 0
        docker build \
          --cache-from us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:latest \
          -t us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA \
          .
```

### 3. Use Multi-Stage Dockerfiles

```dockerfile
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

### 4. Implement Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

### 5. Use Substitutions for Configuration

```yaml
substitutions:
  _REGION: 'us-central1'
  _SERVICE_NAME: 'my-app'
  _MIN_INSTANCES: '0'
  _MAX_INSTANCES: '10'

steps:
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - '${_SERVICE_NAME}'
      - '--region=${_REGION}'
      - '--min-instances=${_MIN_INSTANCES}'
      - '--max-instances=${_MAX_INSTANCES}'
```

### 6. Separate Build and Deploy

```yaml
# build-cloudbuild.yaml (triggered on push)
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:$SHORT_SHA']

# deploy-cloudbuild.yaml (triggered manually or via Cloud Deploy)
steps:
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'my-app', '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-app:${_IMAGE_TAG}']
```

### 7. Use Cloud Deploy for Progressive Delivery

```yaml
apiVersion: deploy.cloud.google.com/v1
kind: DeliveryPipeline
metadata:
  name: my-app-pipeline
serialPipeline:
  stages:
    - targetId: staging
      profiles: [staging]
    - targetId: prod
      profiles: [prod]
      strategy:
        canary:
          runtimeConfig:
            kubernetes:
              gatewayServiceMesh:
                service: my-app-service
          canaryDeployment:
            percentages: [25, 50, 100]
            verify: true
```

### 8. Implement Rollback Strategy

```bash
# List revisions
gcloud run revisions list --service=my-app --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic my-app \
    --to-revisions=my-app-00002-abc=100 \
    --region=us-central1
```

### 9. Use Build Tags

```yaml
tags:
  - 'node18'
  - 'production'
  - 'my-app'
```

### 10. Optimize Build Performance

```yaml
options:
  machineType: 'E2_HIGHCPU_8'  # Faster builds
  diskSizeGb: 100
  logging: CLOUD_LOGGING_ONLY
  substitutionOption: 'ALLOW_LOOSE'
```

---

## Troubleshooting

### Build Failing

**Check logs:**

```bash
gcloud builds list --limit=10
gcloud builds log BUILD_ID
```

**Common issues:**

- Missing API permissions
- Insufficient IAM roles on service account
- Docker build context too large
- Timeout (default: 10 minutes)

**Increase timeout:**

```yaml
timeout: 1800s  # 30 minutes
```

### Permission Denied Errors

**Check service account:**

```bash
gcloud projects get-iam-policy PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com"
```

**Grant missing permissions:**

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member=serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/run.admin
```

### Image Pull Errors

**Configure Docker authentication:**

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

**Check Artifact Registry permissions:**

```bash
gcloud artifacts repositories get-iam-policy my-app-repo \
    --location=us-central1
```

### Trigger Not Firing

**Check trigger configuration:**

```bash
gcloud builds triggers describe my-app-trigger --region=us-central1
```

**Common issues:**

- Branch pattern doesn't match
- Repository not connected
- Webhook not configured (for GitHub/Bitbucket)

**Test trigger manually:**

```bash
gcloud builds triggers run my-app-trigger --branch=main
```

### Cloud Deploy Errors

**Check deployment status:**

```bash
gcloud deploy rollouts list \
    --delivery-pipeline=my-app-pipeline \
    --region=us-central1
```

**Describe rollout:**

```bash
gcloud deploy rollouts describe ROLLOUT_NAME \
    --delivery-pipeline=my-app-pipeline \
    --region=us-central1 \
    --release=RELEASE_NAME
```

### Debug Build Locally

**Use cloud-build-local:**

```bash
# Install
gcloud components install cloud-build-local

# Run build locally
cloud-build-local --config=cloudbuild.yaml --dryrun=false .
```

---

## Example Pipelines

### Complete Node.js Application

**Directory structure:**

```text
my-node-app/
├── src/
│   └── index.js
├── tests/
│   └── app.test.js
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
└── cloudbuild.yaml
```

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

EXPOSE 8080

USER node

CMD ["node", "src/index.js"]
```

**cloudbuild.yaml:**

```yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: npm
    args: ['ci']
    id: 'install'
  
  # Run linter
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'lint']
    waitFor: ['install']
    id: 'lint'
  
  # Run unit tests
  - name: 'node:18'
    entrypoint: npm
    args: ['test']
    env:
      - 'CI=true'
    waitFor: ['install']
    id: 'test'
  
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-node-app:$SHORT_SHA'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-node-app:latest'
      - '--cache-from'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-node-app:latest'
      - '.'
    waitFor: ['lint', 'test']
    id: 'build'
  
  # Push Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-node-app:$SHORT_SHA'
    waitFor: ['build']
    id: 'push'
  
  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'my-node-app'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-node-app:$SHORT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
      - '--allow-unauthenticated'
      - '--memory=512Mi'
      - '--cpu=1'
      - '--max-instances=10'
      - '--set-env-vars=NODE_ENV=production,PORT=8080'
    waitFor: ['push']

images:
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-node-app:$SHORT_SHA'
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/my-node-app:latest'

options:
  machineType: 'E2_HIGHCPU_8'
  logging: CLOUD_LOGGING_ONLY

timeout: 1200s
```

### Python Flask Application with GKE

**Directory structure:**

```text
my-flask-app/
├── app.py
├── requirements.txt
├── tests/
│   └── test_app.py
├── Dockerfile
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
└── cloudbuild.yaml
```

**Dockerfile:**

```dockerfile
FROM python:3.11-slim AS builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

COPY . .

FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY --from=builder /app .

ENV PATH=/root/.local/bin:$PATH

EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "4", "app:app"]
```

**k8s/deployment.yaml:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flask-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: flask-app
  template:
    metadata:
      labels:
        app: flask-app
    spec:
      containers:
      - name: flask-app
        image: us-central1-docker.pkg.dev/PROJECT_ID/my-app-repo/flask-app:latest
        ports:
        - containerPort: 8080
        env:
        - name: FLASK_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

**cloudbuild.yaml:**

```yaml
steps:
  # Install dependencies
  - name: 'python:3.11-slim'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        pip install -r requirements.txt
        pip install pytest pytest-cov
    id: 'install'
  
  # Run tests
  - name: 'python:3.11-slim'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        pip install -r requirements.txt
        pip install pytest pytest-cov
        pytest --cov=app tests/
    waitFor: ['install']
    id: 'test'
  
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/flask-app:$SHORT_SHA'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/flask-app:latest'
      - '.'
    waitFor: ['test']
    id: 'build'
  
  # Push Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/flask-app:$SHORT_SHA'
    waitFor: ['build']
    id: 'push'
  
  # Update Kubernetes deployment
  - name: 'gcr.io/cloud-builders/kubectl'
    args:
      - 'set'
      - 'image'
      - 'deployment/flask-app'
      - 'flask-app=us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/flask-app:$SHORT_SHA'
      - '-n'
      - 'production'
    env:
      - 'CLOUDSDK_COMPUTE_REGION=us-central1'
      - 'CLOUDSDK_CONTAINER_CLUSTER=my-gke-cluster'
    waitFor: ['push']

images:
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/flask-app:$SHORT_SHA'
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/my-app-repo/flask-app:latest'

options:
  machineType: 'E2_HIGHCPU_8'
  logging: CLOUD_LOGGING_ONLY
```

---

## Resources

- **Cloud Build Documentation:** [https://cloud.google.com/build/docs](https://cloud.google.com/build/docs)
- **Cloud Deploy Documentation:** [https://cloud.google.com/deploy/docs](https://cloud.google.com/deploy/docs)
- **Artifact Registry Documentation:** [https://cloud.google.com/artifact-registry/docs](https://cloud.google.com/artifact-registry/docs)
- **Cloud Source Repositories Documentation:** [https://cloud.google.com/source-repositories/docs](https://cloud.google.com/source-repositories/docs)
- **Cloud Run Documentation:** [https://cloud.google.com/run/docs](https://cloud.google.com/run/docs)
- **GKE Documentation:** [https://cloud.google.com/kubernetes-engine/docs](https://cloud.google.com/kubernetes-engine/docs)
- **cloudbuild.yaml Schema:** [https://cloud.google.com/build/docs/build-config-file-schema](https://cloud.google.com/build/docs/build-config-file-schema)
- **Community Builders:** [https://github.com/GoogleCloudPlatform/cloud-builders-community](https://github.com/GoogleCloudPlatform/cloud-builders-community)

---

**Note:** All examples use `us-central1` as the default region. Adjust regions according to your requirements and compliance needs.
