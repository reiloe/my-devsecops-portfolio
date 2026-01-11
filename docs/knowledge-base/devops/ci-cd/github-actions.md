---
title: 🐙 GitHub Actions
---

# GitHub Actions

GitHub Actions is a powerful CI/CD platform integrated directly into GitHub repositories. It enables automation of build, test, and deployment workflows through YAML configuration files stored in `.github/workflows/`.

---

## Table of Contents

1. [Introduction & Concepts](#introduction--concepts)
2. [Workflow Architecture](#workflow-architecture)
3. [Getting Started](#getting-started)
4. [Workflow Syntax](#workflow-syntax)
5. [Events & Triggers](#events--triggers)
6. [Jobs & Steps](#jobs--steps)
7. [Actions & Marketplace](#actions--marketplace)
8. [Variables & Secrets](#variables--secrets)
9. [Artifacts & Caching](#artifacts--caching)
10. [Matrix Builds](#matrix-builds)
11. [Environments & Deployments](#environments--deployments)
12. [Self-Hosted Runners](#self-hosted-runners)
13. [Advanced Features](#advanced-features)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)
16. [Example Workflows](#example-workflows)

---

## Introduction & Concepts

### What is GitHub Actions?

GitHub Actions automates software workflows directly in your GitHub repository:

- **Continuous Integration (CI):** Build and test code changes automatically
- **Continuous Deployment (CD):** Deploy to staging and production environments
- **Automation:** Issue management, notifications, releases, and more

### Key Components

- **Workflow:** Automated process defined in YAML file
- **Event:** Trigger that starts a workflow (push, pull_request, schedule)
- **Job:** Set of steps executed on the same runner
- **Step:** Individual task (run command, use action)
- **Action:** Reusable unit of code (from Marketplace or custom)
- **Runner:** Server that executes workflows (GitHub-hosted or self-hosted)

### Workflow Flow

```text
Event (push) → Trigger Workflow → Execute Jobs → Run Steps → Complete
```

---

## Workflow Architecture

### Workflow Structure

```text
Repository
└── .github/
    └── workflows/
        ├── ci.yml
        ├── deploy.yml
        └── release.yml
```

### Job Dependencies

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building..."

  test:
    needs: build  # Waits for 'build' to complete
    runs-on: ubuntu-latest
    steps:
      - run: echo "Testing..."

  deploy:
    needs: [build, test]  # Waits for both
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying..."
```

### Parallel Execution

Jobs without dependencies run in parallel:

```yaml
jobs:
  test-unit:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:unit

  test-integration:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:integration

  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
```

All three jobs run simultaneously.

---

## Getting Started

### Creating Your First Workflow

1. Create directory: `.github/workflows/`
2. Add workflow file: `.github/workflows/ci.yml`

**Minimal example:**

```yaml
name: CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run a one-line script
        run: echo Hello, world!
```

### Workflow File Location

- Must be in `.github/workflows/` directory
- Must have `.yml` or `.yaml` extension
- Can have any filename

### Viewing Workflow Runs

Navigate to: **Repository → Actions tab**

- View all workflow runs
- Check logs for each job
- Download artifacts
- Re-run failed jobs

---

## Workflow Syntax

### Complete Workflow Anatomy

```yaml
name: CI/CD Pipeline  # Workflow name (optional)

on:  # Events that trigger workflow
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:  # Global environment variables
  NODE_ENV: production
  CACHE_VERSION: v1

defaults:  # Default settings for all jobs
  run:
    shell: bash

jobs:
  build:
    name: Build Application  # Job name
    runs-on: ubuntu-latest  # Runner type
    timeout-minutes: 10  # Max execution time
    
    strategy:  # Matrix strategy
      matrix:
        node-version: [16, 18, 20]
    
    env:  # Job-specific variables
      NODE_VERSION: ${{ matrix.node-version }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist-${{ matrix.node-version }}
          path: dist/
```

---

## Events & Triggers

### Push Events

```yaml
on:
  push:
    branches:
      - main
      - 'releases/**'  # Wildcard pattern
    tags:
      - v*  # All tags starting with 'v'
    paths:
      - 'src/**'
      - 'package.json'
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

### Pull Request Events

```yaml
on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
    branches:
      - main
      - develop
```

### Scheduled Events (Cron)

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
    - cron: '0 */6 * * *'  # Every 6 hours
```

### Manual Trigger (workflow_dispatch)

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
      version:
        description: 'Version number'
        required: false
        type: string
```

### Repository Events

```yaml
on:
  issues:
    types: [opened, labeled]
  release:
    types: [published]
  workflow_run:
    workflows: ["CI"]
    types: [completed]
```

### Multiple Events

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:
```

---

## Jobs & Steps

### Basic Job

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm test
```

### Job with Conditions

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: echo "Deploying to production"
```

### Job Outputs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.value }}
    steps:
      - id: version
        run: echo "value=$(cat VERSION)" >> $GITHUB_OUTPUT
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying version ${{ needs.build.outputs.version }}"
```

### Step with Conditions

```yaml
steps:
  - name: Deploy to staging
    if: github.ref == 'refs/heads/develop'
    run: ./deploy.sh staging
  
  - name: Deploy to production
    if: github.ref == 'refs/heads/main'
    run: ./deploy.sh production
```

### Continue on Error

```yaml
steps:
  - name: Run tests
    run: npm test
    continue-on-error: true  # Don't fail job if this step fails
  
  - name: Always run cleanup
    if: always()
    run: ./cleanup.sh
```

### Timeout

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30  # Job timeout
    steps:
      - run: npm install
        timeout-minutes: 10  # Step timeout
```

---

## Actions & Marketplace

### Using Actions

**Checkout repository:**

```yaml
steps:
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0  # Full history
      submodules: true  # Include submodules
```

**Setup language environments:**

```yaml
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: '18'
      cache: 'npm'
  
  - uses: actions/setup-python@v5
    with:
      python-version: '3.11'
      cache: 'pip'
  
  - uses: actions/setup-java@v4
    with:
      distribution: 'temurin'
      java-version: '17'
```

### Popular Actions

**Docker Build & Push:**

```yaml
steps:
  - uses: docker/setup-buildx-action@v3
  
  - uses: docker/login-action@v3
    with:
      username: ${{ secrets.DOCKER_USERNAME }}
      password: ${{ secrets.DOCKER_PASSWORD }}
  
  - uses: docker/build-push-action@v5
    with:
      context: .
      push: true
      tags: user/app:latest
```

**Upload/Download Artifacts:**

```yaml
jobs:
  build:
    steps:
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
  
  deploy:
    needs: build
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
```

### Creating Custom Actions

**JavaScript Action (action.yml):**

```yaml
name: 'Hello World'
description: 'Greet someone'
inputs:
  who-to-greet:
    description: 'Who to greet'
    required: true
    default: 'World'
outputs:
  time:
    description: 'The time we greeted you'
runs:
  using: 'node20'
  main: 'index.js'
```

**Docker Action:**

```yaml
name: 'Container Action'
description: 'Run action in container'
inputs:
  myInput:
    description: 'Input description'
    required: true
runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.myInput }}
```

**Composite Action:**

```yaml
name: 'Setup Project'
description: 'Setup Node.js project'
runs:
  using: 'composite'
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
    - run: npm ci
      shell: bash
    - run: npm run build
      shell: bash
```

---

## Variables & Secrets

### Default Environment Variables

```yaml
steps:
  - name: Display variables
    run: |
      echo "Repository: ${{ github.repository }}"
      echo "Branch: ${{ github.ref_name }}"
      echo "Commit SHA: ${{ github.sha }}"
      echo "Actor: ${{ github.actor }}"
      echo "Event: ${{ github.event_name }}"
      echo "Workflow: ${{ github.workflow }}"
      echo "Run ID: ${{ github.run_id }}"
      echo "Run Number: ${{ github.run_number }}"
```

### Common Context Variables

| Variable | Description |
|----------|-------------|
| `github.repository` | Repository name (owner/repo) |
| `github.ref` | Full ref (refs/heads/main) |
| `github.ref_name` | Short ref name (main) |
| `github.sha` | Commit SHA |
| `github.actor` | User who triggered workflow |
| `github.event_name` | Event type (push, pull_request) |
| `runner.os` | OS of runner (Linux, Windows, macOS) |
| `runner.temp` | Temp directory path |

### Custom Environment Variables

**Global:**

```yaml
env:
  NODE_ENV: production
  API_URL: https://api.example.com

jobs:
  build:
    steps:
      - run: echo $NODE_ENV
```

**Job-level:**

```yaml
jobs:
  test:
    env:
      NODE_ENV: test
    steps:
      - run: npm test
```

**Step-level:**

```yaml
steps:
  - name: Build
    env:
      BUILD_ENV: production
    run: npm run build
```

### Secrets

**Set secrets:** Settings → Secrets and variables → Actions → New repository secret

**Use secrets:**

```yaml
steps:
  - name: Deploy
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    run: |
      aws s3 sync dist/ s3://my-bucket/
```

**Organization secrets:**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Using org secret"
        env:
          ORG_SECRET: ${{ secrets.ORG_SECRET }}
```

### Setting Outputs

```yaml
steps:
  - id: date
    run: echo "date=$(date +'%Y-%m-%d')" >> $GITHUB_OUTPUT
  
  - run: echo "Today is ${{ steps.date.outputs.date }}"
```

---

## Artifacts & Caching

### Artifacts

**Upload artifacts:**

```yaml
jobs:
  build:
    steps:
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: |
            dist/
            coverage/
          retention-days: 30
```

**Download artifacts:**

```yaml
jobs:
  deploy:
    needs: build
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: ./dist
```

**Download all artifacts:**

```yaml
steps:
  - uses: actions/download-artifact@v4
    with:
      path: ./artifacts
```

### Caching

**Cache dependencies:**

```yaml
steps:
  - uses: actions/checkout@v4
  
  - uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
  
  - run: npm ci
```

**Cache multiple paths:**

```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ~/.cache
      node_modules
    key: ${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
```

**Built-in caching:**

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'  # Automatic caching

- uses: actions/setup-python@v5
  with:
    python-version: '3.11'
    cache: 'pip'  # Automatic caching
```

---

## Matrix Builds

### Basic Matrix

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

This creates 9 jobs (3 OS × 3 Node versions).

### Matrix with Exclusions

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node-version: [16, 18, 20]
    exclude:
      - os: macos-latest
        node-version: 16
      - os: windows-latest
        node-version: 16
```

### Matrix with Inclusions

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, macos-latest]
    node-version: [18, 20]
    include:
      - os: ubuntu-latest
        node-version: 16
        experimental: true
```

### Fail Fast

```yaml
strategy:
  fail-fast: false  # Don't cancel other jobs if one fails
  matrix:
    node-version: [16, 18, 20]
```

### Max Parallel

```yaml
strategy:
  max-parallel: 2  # Run max 2 jobs at a time
  matrix:
    node-version: [16, 18, 20]
```

---

## Environments & Deployments

### Environment Configuration

**Settings → Environments → New environment**

Set protection rules:

- Required reviewers
- Wait timer
- Deployment branches

### Using Environments

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - run: ./deploy.sh staging
  
  deploy-production:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - run: ./deploy.sh production
```

### Environment Secrets

```yaml
jobs:
  deploy:
    environment: production
    steps:
      - run: echo "Deploying with prod credentials"
        env:
          API_KEY: ${{ secrets.PROD_API_KEY }}  # Environment-specific secret
```

### Manual Approval

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production  # Requires approval in environment settings
    steps:
      - run: ./deploy.sh
```

### Deployment Status

```yaml
jobs:
  deploy:
    steps:
      - name: Start deployment
        uses: bobheadxi/deployments@v1
        id: deployment
        with:
          step: start
          token: ${{ secrets.GITHUB_TOKEN }}
          env: production
      
      - name: Deploy
        run: ./deploy.sh
      
      - name: Update deployment status
        uses: bobheadxi/deployments@v1
        if: always()
        with:
          step: finish
          token: ${{ secrets.GITHUB_TOKEN }}
          status: ${{ job.status }}
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}
```

---

## Self-Hosted Runners

### Installing Self-Hosted Runner

**Settings → Actions → Runners → New self-hosted runner**

**Linux:**

```bash
# Create directory
mkdir actions-runner && cd actions-runner

# Download latest runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure
./config.sh --url https://github.com/YOUR-ORG/YOUR-REPO --token YOUR-TOKEN

# Run as service
sudo ./svc.sh install
sudo ./svc.sh start
```

### Using Self-Hosted Runners

```yaml
jobs:
  build:
    runs-on: self-hosted  # Use any self-hosted runner
    steps:
      - run: echo "Running on self-hosted runner"
```

### Runner Labels

```yaml
jobs:
  build:
    runs-on: [self-hosted, linux, x64, gpu]  # Match specific labels
    steps:
      - run: nvidia-smi
```

### Runner Groups

```yaml
jobs:
  deploy:
    runs-on: [self-hosted, production]  # Specific runner group
    steps:
      - run: ./deploy.sh
```

---

## Advanced Features

### Reusable Workflows

**Workflow file (`.github/workflows/reusable-deploy.yml`):**

```yaml
name: Reusable Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      version:
        required: false
        type: string
        default: 'latest'
    secrets:
      deploy_key:
        required: true
    outputs:
      deployment_url:
        value: ${{ jobs.deploy.outputs.url }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    outputs:
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - id: deploy
        run: |
          echo "Deploying to ${{ inputs.environment }}"
          echo "url=https://${{ inputs.environment }}.example.com" >> $GITHUB_OUTPUT
```

**Calling workflow:**

```yaml
jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
      version: v1.0.0
    secrets:
      deploy_key: ${{ secrets.STAGING_DEPLOY_KEY }}
```

### Composite Actions

**Action file (`.github/actions/setup-project/action.yml`):**

```yaml
name: 'Setup Project'
description: 'Install dependencies and build'
inputs:
  node-version:
    description: 'Node.js version'
    required: true
    default: '18'
outputs:
  cache-hit:
    description: 'Whether cache was hit'
    value: ${{ steps.cache.outputs.cache-hit }}
runs:
  using: 'composite'
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
    
    - id: cache
      uses: actions/cache@v4
      with:
        path: node_modules
        key: ${{ runner.os }}-modules-${{ hashFiles('**/package-lock.json') }}
    
    - if: steps.cache.outputs.cache-hit != 'true'
      run: npm ci
      shell: bash
    
    - run: npm run build
      shell: bash
```

**Using composite action:**

```yaml
jobs:
  build:
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-project
        with:
          node-version: '20'
```

### Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true  # Cancel previous runs
```

### Job Summaries

```yaml
steps:
  - name: Generate summary
    run: |
      echo "## Deployment Summary" >> $GITHUB_STEP_SUMMARY
      echo "- Environment: Production" >> $GITHUB_STEP_SUMMARY
      echo "- Version: ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
      echo "- Time: $(date)" >> $GITHUB_STEP_SUMMARY
```

### Service Containers

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379
```

---

## Best Practices

### 1. Use Specific Action Versions

```yaml
# Bad - uses latest, can break
- uses: actions/checkout@main

# Good - pinned to specific version
- uses: actions/checkout@v4

# Best - pinned to commit SHA (immutable)
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11  # v4.1.1
```

### 2. Minimize Workflow Runs

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'package.json'
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

### 3. Use Caching Effectively

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'  # Built-in caching
```

### 4. Secure Secrets

```yaml
# Never log secrets
- run: echo "Deploying..."
  env:
    SECRET: ${{ secrets.MY_SECRET }}

# Use environment secrets for production
jobs:
  deploy:
    environment: production
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.PROD_API_KEY }}
```

### 5. DRY with Reusable Workflows

```yaml
jobs:
  deploy-staging:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: staging
  
  deploy-production:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: production
```

### 6. Fail Fast for Quick Feedback

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint  # Fast checks first
  
  test:
    needs: lint  # Only run if lint passes
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### 7. Use Job Summaries

```yaml
- name: Test Results
  if: always()
  run: |
    echo "## Test Results" >> $GITHUB_STEP_SUMMARY
    echo "✅ 127 passed" >> $GITHUB_STEP_SUMMARY
    echo "❌ 3 failed" >> $GITHUB_STEP_SUMMARY
```

---

## Troubleshooting

### Common Issues

**Workflow not triggering:**

```yaml
# Check event configuration
on:
  push:
    branches: [main]  # Must push to 'main'
  
# Check path filters
on:
  push:
    paths:
      - 'src/**'  # Only triggers if files in src/ change
```

**Permission denied:**

```yaml
jobs:
  build:
    permissions:
      contents: read
      packages: write
      pull-requests: write
```

**Secrets not available:**

```yaml
# Secrets not available in pull requests from forks
# Use environment secrets with protection rules
```

**Cache not working:**

```yaml
# Ensure consistent cache key
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Debug Logging

**Enable debug logging:**

Settings → Secrets → Add secrets:

- `ACTIONS_RUNNER_DEBUG` = `true`
- `ACTIONS_STEP_DEBUG` = `true`

**Debug in workflow:**

```yaml
steps:
  - name: Debug
    run: |
      echo "Event: ${{ github.event_name }}"
      echo "Ref: ${{ github.ref }}"
      echo "Actor: ${{ github.actor }}"
      env
```

### Checking Workflow Syntax

```bash
# Use act to test locally
brew install act
act -l  # List workflows
act push  # Simulate push event
```

---

## Example Workflows

### Node.js CI/CD

```yaml
name: Node.js CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check

  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - run: npm ci
      - run: npm test
      
      - uses: codecov/codecov-action@v4
        if: matrix.node-version == 18
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

  docker:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - uses: docker/setup-buildx-action@v3
      
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:${{ github.sha }}
            ghcr.io/${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: docker
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging..."
          # kubectl set image deployment/app app=ghcr.io/${{ github.repository }}:${{ github.sha }}

  deploy-production:
    needs: docker
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # kubectl set image deployment/app app=ghcr.io/${{ github.repository }}:${{ github.sha }}
```

### Python CI/CD

```yaml
name: Python CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python-version: ['3.9', '3.10', '3.11']
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'pip'
      
      - run: pip install -r requirements.txt
      - run: pip install pytest pytest-cov flake8
      
      - name: Lint
        run: flake8 app/
      
      - name: Test
        run: pytest --cov=app --cov-report=xml
      
      - uses: codecov/codecov-action@v4
        if: matrix.os == 'ubuntu-latest' && matrix.python-version == '3.11'

  docker:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - uses: docker/setup-buildx-action@v3
      
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: user/app:latest
```

---

## Resources

- **Official Documentation:** [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
- **Actions Marketplace:** [https://github.com/marketplace?type=actions](https://github.com/marketplace?type=actions)
- **Starter Workflows:** [https://github.com/actions/starter-workflows](https://github.com/actions/starter-workflows)
- **Act (Local Testing):** [https://github.com/nektos/act](https://github.com/nektos/act)

---

**Note:** Always test workflows in feature branches before merging to main. Use branch protection rules to require status checks before merging.
