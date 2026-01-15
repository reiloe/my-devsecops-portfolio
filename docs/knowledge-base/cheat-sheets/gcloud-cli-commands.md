---
title: ☁️ Google Cloud CLI Commands
sidebar_label: Google Cloud CLI
sidebar_position: 7
tags: [gcp, gcloud, google-cloud, cloud, infrastructure, cheat-sheet]
---

# ☁️ Google Cloud CLI (gcloud) Commands Cheat Sheet

Comprehensive reference for the most commonly used Google Cloud CLI (gcloud) commands for cloud administrators and developers.

---

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Authentication & Projects](#authentication--projects)
3. [Compute Engine](#compute-engine)
4. [Cloud Storage](#cloud-storage)
5. [Cloud Run](#cloud-run)
6. [Google Kubernetes Engine (GKE)](#google-kubernetes-engine-gke)
7. [Container Registry & Artifact Registry](#container-registry--artifact-registry)
8. [App Engine](#app-engine)
9. [Cloud Functions](#cloud-functions)
10. [Cloud SQL](#cloud-sql)
11. [Firestore & Datastore](#firestore--datastore)
12. [BigQuery](#bigquery)
13. [Cloud Pub/Sub](#cloud-pubsub)
14. [Virtual Private Cloud (VPC)](#virtual-private-cloud-vpc)
15. [Cloud Load Balancing](#cloud-load-balancing)
16. [Cloud IAM](#cloud-iam)
17. [Cloud Logging & Monitoring](#cloud-logging--monitoring)
18. [Cloud Build](#cloud-build)
19. [Cloud DNS](#cloud-dns)
20. [Secret Manager](#secret-manager)

---

## Setup & Configuration

### Installation

```bash
# Install gcloud CLI (macOS)
brew install --cask google-cloud-sdk

# Install gcloud CLI (Linux)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Install gcloud CLI (Windows)
# Download from: https://cloud.google.com/sdk/docs/install

# Update gcloud CLI
gcloud components update

# List installed components
gcloud components list

# Install additional components
gcloud components install kubectl
gcloud components install docker-credential-gcr
gcloud components install alpha beta

# Check version
gcloud version
```

### Initialization & Configuration

```bash
# Initialize gcloud (interactive setup)
gcloud init

# Re-initialize with new configuration
gcloud init --console-only

# Show current configuration
gcloud config list

# Set project
gcloud config set project PROJECT_ID

# Set default region
gcloud config set compute/region us-central1

# Set default zone
gcloud config set compute/zone us-central1-a

# Unset configuration
gcloud config unset compute/zone

# Show configuration property
gcloud config get-value project
gcloud config get-value compute/region
```

### Configuration Profiles

```bash
# List configurations
gcloud config configurations list

# Create new configuration
gcloud config configurations create dev-config

# Activate configuration
gcloud config configurations activate dev-config

# Delete configuration
gcloud config configurations delete dev-config

# Describe configuration
gcloud config configurations describe dev-config
```

---

## Authentication & Projects

### Authentication

```bash
# Login interactively
gcloud auth login

# Login with service account
gcloud auth activate-service-account --key-file=service-account-key.json

# List authenticated accounts
gcloud auth list

# Set active account
gcloud config set account ACCOUNT_EMAIL

# Revoke credentials
gcloud auth revoke ACCOUNT_EMAIL

# Print access token
gcloud auth print-access-token

# Print identity token
gcloud auth print-identity-token

# Application default credentials
gcloud auth application-default login
gcloud auth application-default revoke
```

### Projects

```bash
# List all projects
gcloud projects list
gcloud projects list --format="table(projectId,name,projectNumber)"

# Show current project
gcloud config get-value project

# Set current project
gcloud config set project PROJECT_ID

# Create new project
gcloud projects create PROJECT_ID --name="Project Name"

# Delete project
gcloud projects delete PROJECT_ID

# Describe project
gcloud projects describe PROJECT_ID

# Get IAM policy for project
gcloud projects get-iam-policy PROJECT_ID

# Add IAM policy binding
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:email@example.com" \
  --role="roles/editor"
```

---

## Compute Engine

### Instance Management

```bash
# List all instances
gcloud compute instances list
gcloud compute instances list --format="table(name,zone,machineType,status)"

# List instances in specific zone
gcloud compute instances list --zones=us-central1-a

# Create instance
gcloud compute instances create my-instance \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud

# Create instance with custom settings
gcloud compute instances create my-instance \
  --zone=us-central1-a \
  --machine-type=e2-standard-2 \
  --boot-disk-size=50GB \
  --boot-disk-type=pd-ssd \
  --tags=http-server,https-server \
  --metadata=startup-script='#!/bin/bash
    apt-get update
    apt-get install -y nginx'

# Create preemptible instance
gcloud compute instances create my-spot-instance \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --preemptible

# Describe instance
gcloud compute instances describe my-instance --zone=us-central1-a

# Delete instance
gcloud compute instances delete my-instance --zone=us-central1-a

# Delete multiple instances
gcloud compute instances delete instance1 instance2 --zone=us-central1-a
```

### Instance Operations

```bash
# Start instance
gcloud compute instances start my-instance --zone=us-central1-a

# Stop instance
gcloud compute instances stop my-instance --zone=us-central1-a

# Restart instance
gcloud compute instances reset my-instance --zone=us-central1-a

# Suspend instance
gcloud compute instances suspend my-instance --zone=us-central1-a

# Resume instance
gcloud compute instances resume my-instance --zone=us-central1-a

# Get instance serial port output
gcloud compute instances get-serial-port-output my-instance --zone=us-central1-a
```

### SSH & Remote Access

```bash
# SSH into instance
gcloud compute ssh my-instance --zone=us-central1-a

# SSH with specific user
gcloud compute ssh USER@my-instance --zone=us-central1-a

# SSH and run command
gcloud compute ssh my-instance --zone=us-central1-a --command="ls -la"

# Copy files to instance
gcloud compute scp local-file.txt my-instance:~/remote-file.txt --zone=us-central1-a

# Copy files from instance
gcloud compute scp my-instance:~/remote-file.txt ./local-file.txt --zone=us-central1-a

# Copy directory recursively
gcloud compute scp --recurse ./local-dir my-instance:~/remote-dir --zone=us-central1-a
```

### Machine Types & Images

```bash
# List machine types
gcloud compute machine-types list
gcloud compute machine-types list --zones=us-central1-a

# Describe machine type
gcloud compute machine-types describe e2-medium --zone=us-central1-a

# List available images
gcloud compute images list
gcloud compute images list --project=ubuntu-os-cloud

# List image families
gcloud compute images list --filter="family:ubuntu-2204-lts"

# Describe image
gcloud compute images describe ubuntu-2204-jammy-v20241201 \
  --project=ubuntu-os-cloud

# Create custom image from disk
gcloud compute images create my-image --source-disk=my-disk --source-disk-zone=us-central1-a

# Delete image
gcloud compute images delete my-image
```

### Disks

```bash
# List disks
gcloud compute disks list

# Create disk
gcloud compute disks create my-disk \
  --size=100GB \
  --zone=us-central1-a \
  --type=pd-standard

# Create SSD disk
gcloud compute disks create my-ssd-disk \
  --size=100GB \
  --zone=us-central1-a \
  --type=pd-ssd

# Attach disk to instance
gcloud compute instances attach-disk my-instance \
  --disk=my-disk \
  --zone=us-central1-a

# Detach disk from instance
gcloud compute instances detach-disk my-instance \
  --disk=my-disk \
  --zone=us-central1-a

# Resize disk
gcloud compute disks resize my-disk --size=200GB --zone=us-central1-a

# Delete disk
gcloud compute disks delete my-disk --zone=us-central1-a

# Create snapshot
gcloud compute disks snapshot my-disk --snapshot-names=my-snapshot --zone=us-central1-a

# List snapshots
gcloud compute snapshots list

# Delete snapshot
gcloud compute snapshots delete my-snapshot
```

### Firewall Rules

```bash
# List firewall rules
gcloud compute firewall-rules list

# Create firewall rule (allow HTTP)
gcloud compute firewall-rules create allow-http \
  --allow=tcp:80 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=http-server

# Create firewall rule (allow HTTPS)
gcloud compute firewall-rules create allow-https \
  --allow=tcp:443 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=https-server

# Create firewall rule (allow SSH)
gcloud compute firewall-rules create allow-ssh \
  --allow=tcp:22 \
  --source-ranges=0.0.0.0/0

# Describe firewall rule
gcloud compute firewall-rules describe allow-http

# Update firewall rule
gcloud compute firewall-rules update allow-http --description="Allow HTTP traffic"

# Delete firewall rule
gcloud compute firewall-rules delete allow-http
```

### Instance Groups

```bash
# Create instance template
gcloud compute instance-templates create my-template \
  --machine-type=e2-medium \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud

# List instance templates
gcloud compute instance-templates list

# Create managed instance group
gcloud compute instance-groups managed create my-instance-group \
  --base-instance-name=my-instance \
  --template=my-template \
  --size=3 \
  --zone=us-central1-a

# List instance groups
gcloud compute instance-groups list

# Resize instance group
gcloud compute instance-groups managed resize my-instance-group \
  --size=5 \
  --zone=us-central1-a

# Enable autoscaling
gcloud compute instance-groups managed set-autoscaling my-instance-group \
  --max-num-replicas=10 \
  --min-num-replicas=2 \
  --target-cpu-utilization=0.6 \
  --zone=us-central1-a

# Delete instance group
gcloud compute instance-groups managed delete my-instance-group --zone=us-central1-a
```

---

## Cloud Storage

### Bucket Operations

```bash
# List all buckets
gsutil ls

# Create bucket
gsutil mb gs://my-bucket-name

# Create bucket in specific location
gsutil mb -l us-central1 gs://my-bucket-name

# Create bucket with storage class
gsutil mb -c STANDARD gs://my-bucket-name
gsutil mb -c NEARLINE gs://my-archive-bucket

# Delete bucket
gsutil rb gs://my-bucket-name

# Delete bucket and all contents
gsutil rm -r gs://my-bucket-name

# Show bucket details
gsutil ls -L -b gs://my-bucket-name

# Set bucket versioning
gsutil versioning set on gs://my-bucket-name
gsutil versioning get gs://my-bucket-name
```

### Object Operations

```bash
# List objects in bucket
gsutil ls gs://my-bucket-name
gsutil ls -l gs://my-bucket-name
gsutil ls -r gs://my-bucket-name  # Recursive

# Upload file
gsutil cp local-file.txt gs://my-bucket-name/

# Upload directory
gsutil cp -r ./local-directory gs://my-bucket-name/

# Download file
gsutil cp gs://my-bucket-name/file.txt ./local-file.txt

# Download directory
gsutil cp -r gs://my-bucket-name/directory ./local-directory

# Move/rename object
gsutil mv gs://my-bucket-name/old-name.txt gs://my-bucket-name/new-name.txt

# Copy between buckets
gsutil cp gs://source-bucket/file.txt gs://dest-bucket/

# Delete object
gsutil rm gs://my-bucket-name/file.txt

# Delete all objects with prefix
gsutil rm gs://my-bucket-name/prefix/**

# Sync local directory with bucket
gsutil rsync -r ./local-directory gs://my-bucket-name/directory

# Sync with deletion
gsutil rsync -r -d ./local-directory gs://my-bucket-name/directory
```

### Access Control

```bash
# Make bucket public
gsutil iam ch allUsers:objectViewer gs://my-bucket-name

# Make object public
gsutil acl ch -u AllUsers:R gs://my-bucket-name/file.txt

# Set bucket IAM policy
gsutil iam ch user:email@example.com:objectViewer gs://my-bucket-name

# Get bucket IAM policy
gsutil iam get gs://my-bucket-name

# Set object ACL
gsutil acl set private gs://my-bucket-name/file.txt
gsutil acl set public-read gs://my-bucket-name/file.txt

# Get object ACL
gsutil acl get gs://my-bucket-name/file.txt

# Generate signed URL (1 hour expiration)
gsutil signurl -d 1h service-account-key.json gs://my-bucket-name/file.txt
```

### Bucket Configuration

```bash
# Set lifecycle policy
gsutil lifecycle set lifecycle-config.json gs://my-bucket-name

# Get lifecycle policy
gsutil lifecycle get gs://my-bucket-name

# Enable uniform bucket-level access
gsutil uniformbucketlevelaccess set on gs://my-bucket-name

# Set CORS configuration
gsutil cors set cors-config.json gs://my-bucket-name

# Get CORS configuration
gsutil cors get gs://my-bucket-name

# Set website configuration
gsutil web set -m index.html -e 404.html gs://my-bucket-name

# Get bucket labels
gsutil label get gs://my-bucket-name

# Set bucket labels
gsutil label set labels.json gs://my-bucket-name
```

---

## Cloud Run

### Service Management

```bash
# Deploy service
gcloud run deploy my-service \
  --image=gcr.io/PROJECT_ID/my-app:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated

# Deploy with environment variables
gcloud run deploy my-service \
  --image=gcr.io/PROJECT_ID/my-app:latest \
  --platform=managed \
  --region=us-central1 \
  --set-env-vars="ENV=production,DEBUG=false"

# Deploy with memory and CPU limits
gcloud run deploy my-service \
  --image=gcr.io/PROJECT_ID/my-app:latest \
  --platform=managed \
  --region=us-central1 \
  --memory=512Mi \
  --cpu=2 \
  --max-instances=10

# List services
gcloud run services list
gcloud run services list --platform=managed --region=us-central1

# Describe service
gcloud run services describe my-service --platform=managed --region=us-central1

# Delete service
gcloud run services delete my-service --platform=managed --region=us-central1

# Get service URL
gcloud run services describe my-service \
  --platform=managed \
  --region=us-central1 \
  --format="value(status.url)"
```

### Service Configuration

```bash
# Update service
gcloud run services update my-service \
  --platform=managed \
  --region=us-central1 \
  --update-env-vars="KEY=value"

# Update concurrency
gcloud run services update my-service \
  --platform=managed \
  --region=us-central1 \
  --concurrency=80

# Update timeout
gcloud run services update my-service \
  --platform=managed \
  --region=us-central1 \
  --timeout=300

# Set minimum instances
gcloud run services update my-service \
  --platform=managed \
  --region=us-central1 \
  --min-instances=1

# Allow unauthenticated access
gcloud run services add-iam-policy-binding my-service \
  --platform=managed \
  --region=us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"

# Require authentication
gcloud run services remove-iam-policy-binding my-service \
  --platform=managed \
  --region=us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

### Revisions & Traffic

```bash
# List revisions
gcloud run revisions list --service=my-service --platform=managed --region=us-central1

# Describe revision
gcloud run revisions describe REVISION_NAME --platform=managed --region=us-central1

# Update traffic split
gcloud run services update-traffic my-service \
  --platform=managed \
  --region=us-central1 \
  --to-revisions=REVISION1=50,REVISION2=50

# Route all traffic to latest
gcloud run services update-traffic my-service \
  --platform=managed \
  --region=us-central1 \
  --to-latest

# Delete revision
gcloud run revisions delete REVISION_NAME --platform=managed --region=us-central1
```

---

## Google Kubernetes Engine (GKE)

### Cluster Management

```bash
# List clusters
gcloud container clusters list

# Create cluster
gcloud container clusters create my-cluster \
  --zone=us-central1-a \
  --num-nodes=3

# Create cluster with specific machine type
gcloud container clusters create my-cluster \
  --zone=us-central1-a \
  --machine-type=e2-standard-2 \
  --num-nodes=3 \
  --disk-size=50

# Create autopilot cluster
gcloud container clusters create-auto my-autopilot-cluster \
  --region=us-central1

# Get cluster credentials
gcloud container clusters get-credentials my-cluster --zone=us-central1-a

# Describe cluster
gcloud container clusters describe my-cluster --zone=us-central1-a

# Delete cluster
gcloud container clusters delete my-cluster --zone=us-central1-a

# Resize cluster
gcloud container clusters resize my-cluster \
  --num-nodes=5 \
  --zone=us-central1-a
```

### Cluster Operations

```bash
# Upgrade cluster
gcloud container clusters upgrade my-cluster --zone=us-central1-a

# Upgrade master
gcloud container clusters upgrade my-cluster \
  --master \
  --zone=us-central1-a

# List available versions
gcloud container get-server-config --zone=us-central1-a

# Enable autoscaling
gcloud container clusters update my-cluster \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=10 \
  --zone=us-central1-a

# Disable autoscaling
gcloud container clusters update my-cluster \
  --no-enable-autoscaling \
  --zone=us-central1-a

# Enable Workload Identity
gcloud container clusters update my-cluster \
  --workload-pool=PROJECT_ID.svc.id.goog \
  --zone=us-central1-a
```

### Node Pools

```bash
# List node pools
gcloud container node-pools list --cluster=my-cluster --zone=us-central1-a

# Create node pool
gcloud container node-pools create my-node-pool \
  --cluster=my-cluster \
  --zone=us-central1-a \
  --machine-type=e2-standard-4 \
  --num-nodes=3

# Create preemptible node pool
gcloud container node-pools create my-spot-pool \
  --cluster=my-cluster \
  --zone=us-central1-a \
  --preemptible \
  --num-nodes=5

# Describe node pool
gcloud container node-pools describe my-node-pool \
  --cluster=my-cluster \
  --zone=us-central1-a

# Resize node pool
gcloud container node-pools update my-node-pool \
  --cluster=my-cluster \
  --zone=us-central1-a \
  --enable-autoscaling \
  --min-nodes=2 \
  --max-nodes=10

# Delete node pool
gcloud container node-pools delete my-node-pool \
  --cluster=my-cluster \
  --zone=us-central1-a
```

---

## Container Registry & Artifact Registry

### Container Registry (GCR)

```bash
# Configure Docker for GCR
gcloud auth configure-docker

# List images
gcloud container images list

# List tags for image
gcloud container images list-tags gcr.io/PROJECT_ID/my-image

# Describe image
gcloud container images describe gcr.io/PROJECT_ID/my-image:tag

# Delete image
gcloud container images delete gcr.io/PROJECT_ID/my-image:tag --quiet

# Add tag to image
gcloud container images add-tag \
  gcr.io/PROJECT_ID/my-image:old-tag \
  gcr.io/PROJECT_ID/my-image:new-tag

# Pull image
docker pull gcr.io/PROJECT_ID/my-image:tag

# Push image
docker tag my-image:latest gcr.io/PROJECT_ID/my-image:latest
docker push gcr.io/PROJECT_ID/my-image:latest
```

### Artifact Registry

```bash
# Create repository
gcloud artifacts repositories create my-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="My Docker repository"

# List repositories
gcloud artifacts repositories list

# Describe repository
gcloud artifacts repositories describe my-repo --location=us-central1

# Delete repository
gcloud artifacts repositories delete my-repo --location=us-central1

# Configure Docker for Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# List images
gcloud artifacts docker images list us-central1-docker.pkg.dev/PROJECT_ID/my-repo

# List tags
gcloud artifacts docker tags list us-central1-docker.pkg.dev/PROJECT_ID/my-repo/my-image

# Delete image
gcloud artifacts docker images delete \
  us-central1-docker.pkg.dev/PROJECT_ID/my-repo/my-image:tag

# Push image
docker tag my-image:latest us-central1-docker.pkg.dev/PROJECT_ID/my-repo/my-image:latest
docker push us-central1-docker.pkg.dev/PROJECT_ID/my-repo/my-image:latest
```

---

## App Engine

### Application Management

```bash
# Deploy application
gcloud app deploy

# Deploy with specific config
gcloud app deploy app.yaml

# Deploy with version
gcloud app deploy --version=v2

# Deploy and promote
gcloud app deploy --promote

# Deploy without promoting
gcloud app deploy --no-promote

# List versions
gcloud app versions list

# Describe version
gcloud app versions describe VERSION_ID

# Delete version
gcloud app versions delete VERSION_ID

# Browse application
gcloud app browse

# Get application logs
gcloud app logs tail -s default
```

### Application Configuration

```bash
# Set default version
gcloud app versions migrate VERSION_ID

# Split traffic between versions
gcloud app services set-traffic default \
  --splits=v1=0.5,v2=0.5

# Set traffic to single version
gcloud app services set-traffic default --splits=v2=1

# List services
gcloud app services list

# Describe service
gcloud app services describe default

# Delete service
gcloud app services delete SERVICE_NAME

# Show application info
gcloud app describe
```

### Deploy Configuration Files

```bash
# Deploy cron jobs
gcloud app deploy cron.yaml

# Deploy dispatch rules
gcloud app deploy dispatch.yaml

# Deploy index configuration
gcloud app deploy index.yaml

# Deploy queue configuration
gcloud app deploy queue.yaml
```

---

## Cloud Functions

### Function Management

```bash
# Deploy function (Gen 1)
gcloud functions deploy my-function \
  --runtime=nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point=helloWorld \
  --source=.

# Deploy function (Gen 2)
gcloud functions deploy my-function \
  --gen2 \
  --runtime=python311 \
  --region=us-central1 \
  --source=. \
  --entry-point=hello_world \
  --trigger-http \
  --allow-unauthenticated

# Deploy with environment variables
gcloud functions deploy my-function \
  --runtime=nodejs20 \
  --trigger-http \
  --set-env-vars=KEY1=value1,KEY2=value2

# Deploy with Pub/Sub trigger
gcloud functions deploy my-function \
  --runtime=python311 \
  --trigger-topic=my-topic \
  --entry-point=hello_pubsub

# Deploy with Cloud Storage trigger
gcloud functions deploy my-function \
  --runtime=nodejs20 \
  --trigger-bucket=my-bucket \
  --entry-point=processFile

# List functions
gcloud functions list

# Describe function
gcloud functions describe my-function

# Delete function
gcloud functions delete my-function

# Call function
gcloud functions call my-function --data='{"name":"World"}'
```

### Function Logs & Details

```bash
# Get function logs
gcloud functions logs read my-function

# Get function logs (follow)
gcloud functions logs read my-function --limit=50

# Get function URL
gcloud functions describe my-function --format="value(httpsTrigger.url)"

# Update function configuration
gcloud functions deploy my-function \
  --update-env-vars=NEW_KEY=new_value

# Set IAM policy
gcloud functions add-iam-policy-binding my-function \
  --member="allUsers" \
  --role="roles/cloudfunctions.invoker"
```

---

## Cloud SQL

### Instance Management

```bash
# List SQL instances
gcloud sql instances list

# Create MySQL instance
gcloud sql instances create my-mysql-instance \
  --database-version=MYSQL_8_0 \
  --tier=db-n1-standard-1 \
  --region=us-central1

# Create PostgreSQL instance
gcloud sql instances create my-postgres-instance \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Describe instance
gcloud sql instances describe my-mysql-instance

# Delete instance
gcloud sql instances delete my-mysql-instance

# Start instance
gcloud sql instances patch my-mysql-instance --activation-policy=ALWAYS

# Stop instance
gcloud sql instances patch my-mysql-instance --activation-policy=NEVER

# Restart instance
gcloud sql instances restart my-mysql-instance
```

### Database Management

```bash
# List databases
gcloud sql databases list --instance=my-mysql-instance

# Create database
gcloud sql databases create mydb --instance=my-mysql-instance

# Delete database
gcloud sql databases delete mydb --instance=my-mysql-instance

# Describe database
gcloud sql databases describe mydb --instance=my-mysql-instance
```

### User Management

```bash
# List users
gcloud sql users list --instance=my-mysql-instance

# Create user
gcloud sql users create myuser \
  --instance=my-mysql-instance \
  --password=mypassword

# Set user password
gcloud sql users set-password myuser \
  --instance=my-mysql-instance \
  --password=newpassword

# Delete user
gcloud sql users delete myuser --instance=my-mysql-instance
```

### Backup & Export

```bash
# Create backup
gcloud sql backups create --instance=my-mysql-instance

# List backups
gcloud sql backups list --instance=my-mysql-instance

# Restore from backup
gcloud sql backups restore BACKUP_ID --backup-instance=my-mysql-instance

# Export database
gcloud sql export sql my-mysql-instance gs://my-bucket/backup.sql \
  --database=mydb

# Import database
gcloud sql import sql my-mysql-instance gs://my-bucket/backup.sql \
  --database=mydb
```

### Connection

```bash
# Connect to instance
gcloud sql connect my-mysql-instance --user=root

# Get connection name
gcloud sql instances describe my-mysql-instance \
  --format="value(connectionName)"

# Add authorized network
gcloud sql instances patch my-mysql-instance \
  --authorized-networks=1.2.3.4/32

# Enable Cloud SQL Auth Proxy
./cloud_sql_proxy -instances=PROJECT_ID:REGION:INSTANCE_NAME=tcp:3306
```

---

## Firestore & Datastore

### Firestore

```bash
# Create database (Firestore Native mode)
gcloud firestore databases create --region=us-central1

# List indexes
gcloud firestore indexes composite list

# Create composite index
gcloud firestore indexes composite create \
  --collection-group=my-collection \
  --field-config field-path=field1,order=ASCENDING \
  --field-config field-path=field2,order=DESCENDING

# Delete index
gcloud firestore indexes composite delete INDEX_ID

# Export data
gcloud firestore export gs://my-bucket/firestore-export

# Import data
gcloud firestore import gs://my-bucket/firestore-export

# List operations
gcloud firestore operations list
```

### Datastore

```bash
# Export entities
gcloud datastore export gs://my-bucket/datastore-export

# Export specific kinds
gcloud datastore export gs://my-bucket/datastore-export --kinds=Kind1,Kind2

# Import entities
gcloud datastore import gs://my-bucket/datastore-export

# List operations
gcloud datastore operations list

# Cancel operation
gcloud datastore operations cancel OPERATION_ID
```

---

## BigQuery

### Dataset Management

```bash
# List datasets
bq ls

# List datasets in specific project
bq ls --project_id=PROJECT_ID

# Create dataset
bq mk my_dataset

# Create dataset with location
bq mk --location=US my_dataset

# Describe dataset
bq show my_dataset

# Delete dataset
bq rm -r -f my_dataset

# Update dataset
bq update --description="My dataset description" my_dataset
```

### Table Management

```bash
# List tables in dataset
bq ls my_dataset

# Create table
bq mk --table my_dataset.my_table schema.json

# Create table from query
bq query --destination_table=my_dataset.my_table \
  --use_legacy_sql=false \
  'SELECT * FROM `bigquery-public-data.samples.shakespeare`'

# Describe table
bq show my_dataset.my_table

# Get table schema
bq show --schema my_dataset.my_table

# Delete table
bq rm -f my_dataset.my_table

# Update table
bq update --description="My table description" my_dataset.my_table
```

### Data Operations

```bash
# Load data from CSV
bq load --source_format=CSV my_dataset.my_table gs://my-bucket/data.csv schema.json

# Load data from JSON
bq load --source_format=NEWLINE_DELIMITED_JSON my_dataset.my_table gs://my-bucket/data.json

# Extract table to Cloud Storage
bq extract my_dataset.my_table gs://my-bucket/output.csv

# Extract to multiple files
bq extract my_dataset.my_table gs://my-bucket/output-*.csv

# Copy table
bq cp my_dataset.my_table my_dataset.my_table_copy

# Query data
bq query --use_legacy_sql=false 'SELECT * FROM `my_dataset.my_table` LIMIT 10'

# Query and save results
bq query --use_legacy_sql=false --destination_table=my_dataset.results \
  'SELECT * FROM `my_dataset.my_table` WHERE column > 100'
```

### Job Management

```bash
# List jobs
bq ls -j

# Show job details
bq show -j JOB_ID

# Cancel job
bq cancel JOB_ID

# Wait for job
bq wait JOB_ID
```

---

## Cloud Pub/Sub

### Topic Management

```bash
# List topics
gcloud pubsub topics list

# Create topic
gcloud pubsub topics create my-topic

# Describe topic
gcloud pubsub topics describe my-topic

# Delete topic
gcloud pubsub topics delete my-topic

# Publish message
gcloud pubsub topics publish my-topic --message="Hello World"

# Publish message with attributes
gcloud pubsub topics publish my-topic \
  --message="Hello" \
  --attribute=key1=value1,key2=value2

# Get IAM policy
gcloud pubsub topics get-iam-policy my-topic

# Set IAM policy
gcloud pubsub topics add-iam-policy-binding my-topic \
  --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
  --role="roles/pubsub.publisher"
```

### Subscription Management

```bash
# List subscriptions
gcloud pubsub subscriptions list

# Create subscription
gcloud pubsub subscriptions create my-subscription --topic=my-topic

# Create subscription with acknowledgment deadline
gcloud pubsub subscriptions create my-subscription \
  --topic=my-topic \
  --ack-deadline=60

# Create push subscription
gcloud pubsub subscriptions create my-push-subscription \
  --topic=my-topic \
  --push-endpoint=https://example.com/push

# Describe subscription
gcloud pubsub subscriptions describe my-subscription

# Delete subscription
gcloud pubsub subscriptions delete my-subscription

# Pull messages
gcloud pubsub subscriptions pull my-subscription --auto-ack

# Pull multiple messages
gcloud pubsub subscriptions pull my-subscription --limit=10 --auto-ack

# Acknowledge messages
gcloud pubsub subscriptions ack my-subscription --ack-ids=ACK_ID

# Seek to timestamp
gcloud pubsub subscriptions seek my-subscription --time=2024-12-01T00:00:00Z

# Seek to snapshot
gcloud pubsub subscriptions seek my-subscription --snapshot=my-snapshot
```

### Snapshots

```bash
# Create snapshot
gcloud pubsub snapshots create my-snapshot --subscription=my-subscription

# List snapshots
gcloud pubsub snapshots list

# Describe snapshot
gcloud pubsub snapshots describe my-snapshot

# Delete snapshot
gcloud pubsub snapshots delete my-snapshot
```

---

## Virtual Private Cloud (VPC)

### Network Management

```bash
# List networks
gcloud compute networks list

# Create network (auto mode)
gcloud compute networks create my-network --subnet-mode=auto

# Create network (custom mode)
gcloud compute networks create my-custom-network --subnet-mode=custom

# Describe network
gcloud compute networks describe my-network

# Delete network
gcloud compute networks delete my-network

# Switch to legacy mode
gcloud compute networks update my-network --switch-to-custom-subnet-mode
```

### Subnet Management

```bash
# List subnets
gcloud compute networks subnets list

# Create subnet
gcloud compute networks subnets create my-subnet \
  --network=my-custom-network \
  --region=us-central1 \
  --range=10.0.0.0/24

# Create subnet with secondary ranges
gcloud compute networks subnets create my-subnet \
  --network=my-custom-network \
  --region=us-central1 \
  --range=10.0.0.0/24 \
  --secondary-range=pods=10.1.0.0/16,services=10.2.0.0/16

# Describe subnet
gcloud compute networks subnets describe my-subnet --region=us-central1

# Delete subnet
gcloud compute networks subnets delete my-subnet --region=us-central1

# Expand subnet range
gcloud compute networks subnets expand-ip-range my-subnet \
  --region=us-central1 \
  --prefix-length=20
```

### VPC Peering

```bash
# Create VPC peering
gcloud compute networks peerings create my-peering \
  --network=my-network \
  --peer-project=PEER_PROJECT_ID \
  --peer-network=peer-network

# List VPC peerings
gcloud compute networks peerings list --network=my-network

# Delete VPC peering
gcloud compute networks peerings delete my-peering --network=my-network
```

### Routes

```bash
# List routes
gcloud compute routes list

# Create route
gcloud compute routes create my-route \
  --network=my-network \
  --destination-range=0.0.0.0/0 \
  --next-hop-gateway=default-internet-gateway

# Delete route
gcloud compute routes delete my-route
```

---

## Cloud Load Balancing

### HTTP(S) Load Balancer

```bash
# Create backend service
gcloud compute backend-services create my-backend-service \
  --protocol=HTTP \
  --port-name=http \
  --health-checks=my-health-check \
  --global

# Add backend to service
gcloud compute backend-services add-backend my-backend-service \
  --instance-group=my-instance-group \
  --instance-group-zone=us-central1-a \
  --global

# Create URL map
gcloud compute url-maps create my-url-map \
  --default-service=my-backend-service

# Create HTTP proxy
gcloud compute target-http-proxies create my-http-proxy \
  --url-map=my-url-map

# Create forwarding rule
gcloud compute forwarding-rules create my-http-rule \
  --global \
  --target-http-proxy=my-http-proxy \
  --ports=80

# Create HTTPS proxy
gcloud compute target-https-proxies create my-https-proxy \
  --url-map=my-url-map \
  --ssl-certificates=my-ssl-cert

# List backend services
gcloud compute backend-services list

# List forwarding rules
gcloud compute forwarding-rules list
```

### Health Checks

```bash
# Create HTTP health check
gcloud compute health-checks create http my-health-check \
  --port=80 \
  --check-interval=30s \
  --timeout=10s \
  --unhealthy-threshold=3

# Create HTTPS health check
gcloud compute health-checks create https my-https-health-check \
  --port=443

# Create TCP health check
gcloud compute health-checks create tcp my-tcp-health-check \
  --port=8080

# List health checks
gcloud compute health-checks list

# Describe health check
gcloud compute health-checks describe my-health-check

# Delete health check
gcloud compute health-checks delete my-health-check
```

### SSL Certificates

```bash
# Create SSL certificate
gcloud compute ssl-certificates create my-ssl-cert \
  --certificate=cert.pem \
  --private-key=key.pem

# Create managed SSL certificate
gcloud compute ssl-certificates create my-managed-cert \
  --domains=example.com,www.example.com \
  --global

# List SSL certificates
gcloud compute ssl-certificates list

# Describe SSL certificate
gcloud compute ssl-certificates describe my-ssl-cert

# Delete SSL certificate
gcloud compute ssl-certificates delete my-ssl-cert
```

---

## Cloud IAM

### IAM Policies

```bash
# Get IAM policy for project
gcloud projects get-iam-policy PROJECT_ID

# Add IAM policy binding
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:email@example.com" \
  --role="roles/editor"

# Add service account binding
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
  --role="roles/storage.admin"

# Remove IAM policy binding
gcloud projects remove-iam-policy-binding PROJECT_ID \
  --member="user:email@example.com" \
  --role="roles/editor"

# Set IAM policy from file
gcloud projects set-iam-policy PROJECT_ID policy.json
```

### Service Accounts

```bash
# List service accounts
gcloud iam service-accounts list

# Create service account
gcloud iam service-accounts create my-service-account \
  --display-name="My Service Account"

# Describe service account
gcloud iam service-accounts describe SERVICE_ACCOUNT_EMAIL

# Delete service account
gcloud iam service-accounts delete SERVICE_ACCOUNT_EMAIL

# Create service account key
gcloud iam service-accounts keys create key.json \
  --iam-account=SERVICE_ACCOUNT_EMAIL

# List service account keys
gcloud iam service-accounts keys list \
  --iam-account=SERVICE_ACCOUNT_EMAIL

# Delete service account key
gcloud iam service-accounts keys delete KEY_ID \
  --iam-account=SERVICE_ACCOUNT_EMAIL

# Impersonate service account
gcloud compute instances list \
  --impersonate-service-account=SERVICE_ACCOUNT_EMAIL
```

### Roles

```bash
# List roles
gcloud iam roles list

# List predefined roles
gcloud iam roles list --project=PROJECT_ID

# Describe role
gcloud iam roles describe roles/editor

# Create custom role
gcloud iam roles create myCustomRole \
  --project=PROJECT_ID \
  --title="My Custom Role" \
  --description="Custom role description" \
  --permissions=compute.instances.get,compute.instances.list

# Update custom role
gcloud iam roles update myCustomRole \
  --project=PROJECT_ID \
  --add-permissions=compute.instances.start

# Delete custom role
gcloud iam roles delete myCustomRole --project=PROJECT_ID

# List testable permissions
gcloud iam list-testable-permissions //cloudresourcemanager.googleapis.com/projects/PROJECT_ID
```

---

## Cloud Logging & Monitoring

### Logging

```bash
# Read logs
gcloud logging read "resource.type=gce_instance" --limit=10

# Read logs with filter
gcloud logging read "severity>=ERROR" --limit=50

# Read logs for specific resource
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=my-service"

# Read logs with timestamp
gcloud logging read "timestamp>=\"2024-12-01T00:00:00Z\"" --limit=10

# Follow logs (tail)
gcloud logging tail "resource.type=gce_instance"

# List logs
gcloud logging logs list

# Delete log
gcloud logging logs delete LOG_ID

# Create log sink
gcloud logging sinks create my-sink \
  storage.googleapis.com/my-bucket \
  --log-filter='severity>=ERROR'

# List sinks
gcloud logging sinks list

# Delete sink
gcloud logging sinks delete my-sink
```

### Monitoring

```bash
# List alert policies
gcloud alpha monitoring policies list

# Create alert policy
gcloud alpha monitoring policies create --policy-from-file=policy.json

# Delete alert policy
gcloud alpha monitoring policies delete POLICY_ID

# List notification channels
gcloud alpha monitoring channels list

# Create notification channel
gcloud alpha monitoring channels create --channel-content-from-file=channel.json

# List uptime checks
gcloud monitoring uptime list

# Create uptime check
gcloud monitoring uptime create HTTP my-check \
  --resource-type=uptime-url \
  --display-name="My Uptime Check" \
  --host=example.com
```

---

## Cloud Build

### Build Management

```bash
# Submit build
gcloud builds submit --config=cloudbuild.yaml

# Submit build with source
gcloud builds submit --config=cloudbuild.yaml .

# Submit build with substitutions
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_TAG=latest,_ENV=production

# Build and push Docker image
gcloud builds submit --tag=gcr.io/PROJECT_ID/my-app:latest

# List builds
gcloud builds list

# Describe build
gcloud builds describe BUILD_ID

# Get build logs
gcloud builds log BUILD_ID

# Stream build logs
gcloud builds log BUILD_ID --stream

# Cancel build
gcloud builds cancel BUILD_ID
```

### Build Triggers

```bash
# List triggers
gcloud builds triggers list

# Create trigger from GitHub
gcloud builds triggers create github \
  --name=my-trigger \
  --repo-name=my-repo \
  --repo-owner=my-org \
  --branch-pattern=^main$ \
  --build-config=cloudbuild.yaml

# Create trigger with inline build config
gcloud builds triggers create github \
  --name=my-trigger \
  --repo-name=my-repo \
  --repo-owner=my-org \
  --branch-pattern=^main$ \
  --inline-config=cloudbuild.yaml

# Describe trigger
gcloud builds triggers describe TRIGGER_ID

# Run trigger
gcloud builds triggers run TRIGGER_ID

# Delete trigger
gcloud builds triggers delete TRIGGER_ID

# Update trigger
gcloud builds triggers update github TRIGGER_ID \
  --branch-pattern=^develop$
```

---

## Cloud DNS

### Managed Zones

```bash
# List managed zones
gcloud dns managed-zones list

# Create managed zone
gcloud dns managed-zones create my-zone \
  --dns-name=example.com. \
  --description="My DNS zone"

# Describe managed zone
gcloud dns managed-zones describe my-zone

# Delete managed zone
gcloud dns managed-zones delete my-zone
```

### DNS Records

```bash
# List record sets
gcloud dns record-sets list --zone=my-zone

# Create A record
gcloud dns record-sets create www.example.com. \
  --zone=my-zone \
  --type=A \
  --ttl=300 \
  --rrdatas=1.2.3.4

# Create CNAME record
gcloud dns record-sets create alias.example.com. \
  --zone=my-zone \
  --type=CNAME \
  --ttl=300 \
  --rrdatas=www.example.com.

# Update record
gcloud dns record-sets update www.example.com. \
  --zone=my-zone \
  --type=A \
  --ttl=300 \
  --rrdatas=1.2.3.5

# Delete record
gcloud dns record-sets delete www.example.com. \
  --zone=my-zone \
  --type=A

# Transaction-based changes
gcloud dns record-sets transaction start --zone=my-zone
gcloud dns record-sets transaction add 1.2.3.4 \
  --name=www.example.com. \
  --ttl=300 \
  --type=A \
  --zone=my-zone
gcloud dns record-sets transaction execute --zone=my-zone
```

---

## Secret Manager

### Secret Management

```bash
# Create secret
gcloud secrets create my-secret --replication-policy="automatic"

# Add secret version
echo -n "my-secret-value" | gcloud secrets versions add my-secret --data-file=-

# Add secret version from file
gcloud secrets versions add my-secret --data-file=secret.txt

# List secrets
gcloud secrets list

# Describe secret
gcloud secrets describe my-secret

# Delete secret
gcloud secrets delete my-secret

# List secret versions
gcloud secrets versions list my-secret

# Access secret version
gcloud secrets versions access latest --secret=my-secret

# Access specific version
gcloud secrets versions access 1 --secret=my-secret

# Disable secret version
gcloud secrets versions disable 1 --secret=my-secret

# Enable secret version
gcloud secrets versions enable 1 --secret=my-secret

# Destroy secret version
gcloud secrets versions destroy 1 --secret=my-secret
```

### Secret IAM

```bash
# Get IAM policy
gcloud secrets get-iam-policy my-secret

# Add IAM binding
gcloud secrets add-iam-policy-binding my-secret \
  --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
  --role="roles/secretmanager.secretAccessor"

# Remove IAM binding
gcloud secrets remove-iam-policy-binding my-secret \
  --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Useful Tips & Tricks

### Output Formatting

```bash
# Table format
gcloud compute instances list --format="table(name,zone,status)"

# JSON format
gcloud compute instances list --format=json

# YAML format
gcloud compute instances list --format=yaml

# CSV format
gcloud compute instances list --format="csv(name,zone,status)"

# Value only (useful for scripting)
gcloud compute instances list --format="value(name)"

# Custom table with headers
gcloud compute instances list \
  --format="table[box](name:label='Instance Name',zone,status:label='Status')"
```

### Filtering & Querying

```bash
# Filter by name
gcloud compute instances list --filter="name:web-*"

# Filter by zone
gcloud compute instances list --filter="zone:us-central1-a"

# Filter by status
gcloud compute instances list --filter="status=RUNNING"

# Multiple filters (AND)
gcloud compute instances list --filter="zone:us-central1-a AND status=RUNNING"

# Multiple filters (OR)
gcloud compute instances list --filter="zone:(us-central1-a OR us-east1-b)"

# Projection (select specific fields)
gcloud compute instances list --format="value(name,networkInterfaces[0].accessConfigs[0].natIP)"
```

### Using Variables

```bash
# Store project ID
PROJECT_ID=$(gcloud config get-value project)

# Store instance name
INSTANCE_NAME=$(gcloud compute instances list --format="value(name)" --limit=1)

# Store service URL
SERVICE_URL=$(gcloud run services describe my-service \
  --platform=managed \
  --region=us-central1 \
  --format="value(status.url)")

# Use in commands
gcloud compute instances describe $INSTANCE_NAME --zone=us-central1-a
```

### Batch Operations

```bash
# Delete multiple instances
gcloud compute instances list --filter="name:temp-*" --format="value(name,zone)" | \
  while read name zone; do
    gcloud compute instances delete $name --zone=$zone --quiet
  done

# Stop all running instances
gcloud compute instances list --filter="status=RUNNING" --format="value(name,zone)" | \
  while read name zone; do
    gcloud compute instances stop $name --zone=$zone
  done
```

### Dry Run & Validation

```bash
# Validate without executing
gcloud compute instances create my-instance --dry-run

# Explain command
gcloud compute instances create --help

# Interactive mode for exploration
gcloud alpha interactive
```

### Metadata & Labels

```bash
# Add labels to instance
gcloud compute instances add-labels my-instance \
  --zone=us-central1-a \
  --labels=env=prod,team=backend

# Update labels
gcloud compute instances update my-instance \
  --zone=us-central1-a \
  --update-labels=version=2

# Remove labels
gcloud compute instances remove-labels my-instance \
  --zone=us-central1-a \
  --labels=env

# Filter by labels
gcloud compute instances list --filter="labels.env=prod"
```

### Debugging

```bash
# Verbose output
gcloud compute instances list --verbosity=debug

# Log HTTP requests
gcloud compute instances list --log-http

# Trace token for support
gcloud compute instances list --trace-token=TOKEN_ID

# Validate API access
gcloud auth list
gcloud projects list
```

---

## Common Workflows

### Deploy Full-Stack Application

```bash
# 1. Set project
gcloud config set project PROJECT_ID

# 2. Enable required APIs
gcloud services enable compute.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable run.googleapis.com

# 3. Create Cloud SQL instance
gcloud sql instances create my-db-instance \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# 4. Create database
gcloud sql databases create mydb --instance=my-db-instance

# 5. Create database user
gcloud sql users create myuser \
  --instance=my-db-instance \
  --password=mypassword

# 6. Build and push container
gcloud builds submit --tag=gcr.io/PROJECT_ID/my-app:latest

# 7. Deploy to Cloud Run
gcloud run deploy my-app \
  --image=gcr.io/PROJECT_ID/my-app:latest \
  --platform=managed \
  --region=us-central1 \
  --add-cloudsql-instances=PROJECT_ID:us-central1:my-db-instance \
  --set-env-vars="DB_HOST=/cloudsql/PROJECT_ID:us-central1:my-db-instance,DB_USER=myuser,DB_PASS=mypassword,DB_NAME=mydb" \
  --allow-unauthenticated
```

### Set Up GKE Cluster with CI/CD

```bash
# 1. Create GKE cluster
gcloud container clusters create my-cluster \
  --zone=us-central1-a \
  --num-nodes=3 \
  --machine-type=e2-standard-2

# 2. Get credentials
gcloud container clusters get-credentials my-cluster --zone=us-central1-a

# 3. Create Artifact Registry repository
gcloud artifacts repositories create my-repo \
  --repository-format=docker \
  --location=us-central1

# 4. Configure Docker
gcloud auth configure-docker us-central1-docker.pkg.dev

# 5. Create Cloud Build trigger
gcloud builds triggers create github \
  --name=deploy-to-gke \
  --repo-name=my-repo \
  --repo-owner=my-org \
  --branch-pattern=^main$ \
  --build-config=cloudbuild.yaml

# 6. Grant Cloud Build permissions
PROJECT_NUMBER=$(gcloud projects describe PROJECT_ID --format="value(projectNumber)")
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/container.developer"
```

### Create Static Website with Cloud Storage

```bash
# 1. Create bucket with website name
gsutil mb gs://www.example.com

# 2. Enable website configuration
gsutil web set -m index.html -e 404.html gs://www.example.com

# 3. Make bucket public
gsutil iam ch allUsers:objectViewer gs://www.example.com

# 4. Upload website files
gsutil -m cp -r ./website/* gs://www.example.com/

# 5. Set cache control
gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://www.example.com/**

# 6. Create Cloud CDN (optional)
gcloud compute backend-buckets create my-backend-bucket \
  --gcs-bucket-name=www.example.com
```

---

## Best Practices

### Security

```bash
# Use service accounts with minimal permissions
gcloud iam service-accounts create limited-sa \
  --display-name="Limited Service Account"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:limited-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"

# Enable audit logging
gcloud projects get-iam-policy PROJECT_ID > policy.json
# Edit policy.json to add audit configs
gcloud projects set-iam-policy PROJECT_ID policy.json

# Use Secret Manager for sensitive data
echo -n "db-password" | gcloud secrets versions add db-password --data-file=-

# Enable VPC Service Controls
gcloud access-context-manager perimeters create my-perimeter \
  --title="My Perimeter" \
  --resources=projects/PROJECT_NUMBER \
  --restricted-services=storage.googleapis.com
```

### Cost Optimization

```bash
# Use preemptible instances
gcloud compute instances create preemptible-instance \
  --preemptible \
  --zone=us-central1-a

# Set up budgets and alerts
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Monthly Budget" \
  --budget-amount=1000

# Use committed use discounts
gcloud compute commitments create my-commitment \
  --plan=12-month \
  --resources=vcpu=100,memory=400

# Clean up unused resources
gcloud compute images list --filter="creationTimestamp<-P30D" --uri | \
  xargs gcloud compute images delete

# Use labels for cost tracking
gcloud compute instances add-labels my-instance \
  --zone=us-central1-a \
  --labels=cost-center=engineering,project=webapp
```

### Performance

```bash
# Use regional resources for HA
gcloud compute instance-groups managed create my-regional-group \
  --base-instance-name=my-instance \
  --template=my-template \
  --size=3 \
  --region=us-central1

# Enable Cloud CDN
gcloud compute backend-services update my-backend-service \
  --enable-cdn \
  --global

# Use SSD persistent disks
gcloud compute disks create my-ssd \
  --size=100GB \
  --type=pd-ssd \
  --zone=us-central1-a
```

---

## Further Resources

- **Official Documentation**: [https://cloud.google.com/sdk/docs](https://cloud.google.com/sdk/docs)
- **gcloud CLI Reference**: [https://cloud.google.com/sdk/gcloud/reference](https://cloud.google.com/sdk/gcloud/reference)
- **Google Cloud Samples**: [https://github.com/GoogleCloudPlatform](https://github.com/GoogleCloudPlatform)
- **Cloud Architecture Center**: [https://cloud.google.com/architecture](https://cloud.google.com/architecture)
- **Pricing Calculator**: [https://cloud.google.com/products/calculator](https://cloud.google.com/products/calculator)
- **Best Practices**: [https://cloud.google.com/docs/enterprise/best-practices-for-enterprise-organizations](https://cloud.google.com/docs/enterprise/best-practices-for-enterprise-organizations)
- **Quickstart Tutorials**: [https://cloud.google.com/docs/tutorials](https://cloud.google.com/docs/tutorials)

---

**Tip:** Use `gcloud <command> --help` or `gcloud help <command>` to get detailed information and examples for any gcloud command!
