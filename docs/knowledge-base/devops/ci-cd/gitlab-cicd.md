---
title: 🦊 GitLab CI/CD
---

# GitLab CI/CD

GitLab CI/CD is a powerful, integrated continuous integration and continuous deployment platform built directly into GitLab. It enables automated building, testing, and deployment of applications through pipeline configurations defined in `.gitlab-ci.yml` files.

---

## Table of Contents

1. [Introduction & Concepts](#introduction--concepts)
2. [Pipeline Architecture](#pipeline-architecture)
3. [GitLab Runner Setup](#gitlab-runner-setup)
4. [Basic .gitlab-ci.yml Structure](#basic-gitlab-ciyml-structure)
5. [Jobs, Stages & Dependencies](#jobs-stages--dependencies)
6. [Variables & Secrets](#variables--secrets)
7. [Caching & Artifacts](#caching--artifacts)
8. [Docker Integration](#docker-integration)
9. [Deployment Strategies](#deployment-strategies)
10. [Advanced Features](#advanced-features)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)
13. [Example Pipelines](#example-pipelines)

---

## Introduction & Concepts

### What is GitLab CI/CD?

GitLab CI/CD is an integrated DevOps platform that automates:

- **Continuous Integration (CI):** Automatically build and test code changes
- **Continuous Delivery (CD):** Automatically deploy to staging environments
- **Continuous Deployment (CD):** Automatically deploy to production

### Key Components

- **Pipeline:** A collection of jobs organized into stages
- **Job:** Individual tasks (build, test, deploy) that run in isolation
- **Stage:** Logical grouping of jobs that run in sequence
- **Runner:** Agent that executes pipeline jobs
- **Executor:** Environment where jobs run (shell, docker, kubernetes)

### Pipeline Workflow

```text
Code Push → Trigger Pipeline → Execute Stages → Run Jobs → Deploy
```

---

## Pipeline Architecture

### Pipeline Stages

Default stages (executed in order):

1. **build** — Compile code, create artifacts
2. **test** — Run unit tests, integration tests
3. **deploy** — Deploy to environments (staging, production)

Custom stages can be defined:

```yaml
stages:
  - build
  - test
  - security
  - deploy
  - monitoring
```

### Pipeline Types

- **Basic Pipeline:** Linear execution of stages
- **DAG Pipeline:** Directed Acyclic Graph with parallel execution
- **Parent-Child Pipeline:** Nested pipelines for complex workflows
- **Multi-Project Pipeline:** Trigger pipelines in other projects

---

## GitLab Runner Setup

### Installing GitLab Runner

**Linux (Ubuntu/Debian):**

```bash
# Add GitLab repository
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash

# Install GitLab Runner
sudo apt-get install gitlab-runner

# Verify installation
gitlab-runner --version
```

**macOS:**

```bash
# Using Homebrew
brew install gitlab-runner

# Start service
brew services start gitlab-runner
```

**Docker:**

```bash
docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest
```

### Registering a Runner

```bash
# Interactive registration
sudo gitlab-runner register

# Non-interactive registration
sudo gitlab-runner register \
  --non-interactive \
  --url "https://gitlab.com/" \
  --registration-token "YOUR_TOKEN" \
  --executor "docker" \
  --docker-image "alpine:latest" \
  --description "docker-runner" \
  --tag-list "docker,aws" \
  --run-untagged="true" \
  --locked="false"
```

### Executor Types

| Executor | Use Case | Isolation |
|----------|----------|-----------|
| **shell** | Simple scripts, direct host access | Low |
| **docker** | Containerized builds, reproducible | High |
| **kubernetes** | Scalable, cloud-native | Very High |
| **docker+machine** | Auto-scaling Docker runners | High |
| **ssh** | Remote execution | Medium |

### Runner Configuration (`config.toml`)

```toml
concurrent = 4  # Max parallel jobs

[[runners]]
  name = "docker-runner"
  url = "https://gitlab.com/"
  token = "YOUR_TOKEN"
  executor = "docker"
  [runners.docker]
    image = "docker:20.10"
    privileged = true
    volumes = ["/cache", "/var/run/docker.sock:/var/run/docker.sock"]
```

---

## Basic .gitlab-ci.yml Structure

### Minimal Example

```yaml
stages:
  - build
  - test

build-job:
  stage: build
  script:
    - echo "Building application..."
    - npm install
    - npm run build

test-job:
  stage: test
  script:
    - echo "Running tests..."
    - npm test
```

### Job Anatomy

```yaml
job-name:
  stage: test                    # Stage assignment
  image: node:18                 # Docker image to use
  services:                      # Additional services
    - postgres:14
  before_script:                 # Setup commands
    - npm install
  script:                        # Main commands (required)
    - npm test
  after_script:                  # Cleanup commands
    - echo "Job completed"
  variables:                     # Job-specific variables
    NODE_ENV: test
  tags:                          # Runner tags
    - docker
  only:                          # Branch/tag filters
    - main
    - develop
  artifacts:                     # Save files
    paths:
      - dist/
    expire_in: 1 week
  cache:                         # Cache dependencies
    paths:
      - node_modules/
  retry: 2                       # Retry on failure
  timeout: 1h                    # Max execution time
  allow_failure: false           # Pipeline fails if job fails
```

---

## Jobs, Stages & Dependencies

### Parallel Jobs in Same Stage

```yaml
stages:
  - test

unit-tests:
  stage: test
  script:
    - npm run test:unit

integration-tests:
  stage: test
  script:
    - npm run test:integration

e2e-tests:
  stage: test
  script:
    - npm run test:e2e
```

All three jobs run in parallel.

### Job Dependencies

```yaml
stages:
  - build
  - test
  - deploy

build-app:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/

test-app:
  stage: test
  dependencies:
    - build-app
  script:
    - npm test

deploy-app:
  stage: deploy
  dependencies:
    - build-app
  script:
    - aws s3 sync dist/ s3://my-bucket/
```

### Needs (DAG Pipelines)

```yaml
stages:
  - build
  - test
  - deploy

build:linux:
  stage: build
  script:
    - echo "Building for Linux"

build:windows:
  stage: build
  script:
    - echo "Building for Windows"

test:linux:
  stage: test
  needs: ["build:linux"]
  script:
    - echo "Testing Linux build"

test:windows:
  stage: test
  needs: ["build:windows"]
  script:
    - echo "Testing Windows build"

deploy:
  stage: deploy
  needs: ["test:linux", "test:windows"]
  script:
    - echo "Deploying..."
```

---

## Variables & Secrets

### Predefined Variables

GitLab provides many built-in variables:

```yaml
build:
  script:
    - echo "Project: $CI_PROJECT_NAME"
    - echo "Branch: $CI_COMMIT_BRANCH"
    - echo "Commit SHA: $CI_COMMIT_SHA"
    - echo "Pipeline ID: $CI_PIPELINE_ID"
    - echo "Job ID: $CI_JOB_ID"
    - echo "Runner: $CI_RUNNER_DESCRIPTION"
```

Common variables:

- `$CI_PROJECT_NAME` — Project name
- `$CI_COMMIT_BRANCH` — Branch name
- `$CI_COMMIT_TAG` — Tag name
- `$CI_PIPELINE_SOURCE` — Trigger source (push, merge_request, schedule)
- `$CI_REGISTRY` — GitLab Container Registry URL
- `$CI_REGISTRY_IMAGE` — Full image path

### Custom Variables

**Global variables:**

```yaml
variables:
  DOCKER_DRIVER: overlay2
  NODE_ENV: production
  APP_VERSION: "1.0.0"

build:
  script:
    - echo "Building version $APP_VERSION"
```

**Job-specific variables:**

```yaml
test:
  variables:
    NODE_ENV: test
  script:
    - npm test
```

### Protected Variables (Secrets)

Set in GitLab UI: **Settings → CI/CD → Variables**

- Mark as **Protected** (only available in protected branches)
- Mark as **Masked** (hidden in job logs)

```yaml
deploy:
  script:
    - aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
    - aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
    - aws s3 sync dist/ s3://my-bucket/
  only:
    - main
```

### File Variables

Store files as variables (certificates, config files):

```yaml
deploy:
  script:
    - kubectl config use-context $KUBE_CONTEXT
    - kubectl apply -f deployment.yaml
  variables:
    KUBECONFIG: $KUBECONFIG_FILE  # File variable
```

---

## Caching & Artifacts

### Cache (Dependencies)

Cache speeds up subsequent pipeline runs by preserving dependencies:

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}  # Unique per branch
  paths:
    - node_modules/
    - .npm/

build:
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run build
```

**Cache policies:**

```yaml
build:
  cache:
    key: "$CI_COMMIT_REF_SLUG"
    paths:
      - node_modules/
    policy: pull-push  # Default: download and upload

test:
  cache:
    key: "$CI_COMMIT_REF_SLUG"
    paths:
      - node_modules/
    policy: pull  # Only download, don't upload
```

### Artifacts (Build Outputs)

Artifacts are files passed between jobs:

```yaml
build:
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
      - coverage/
    expire_in: 1 week
    when: on_success  # on_success, on_failure, always

test:
  dependencies:
    - build
  script:
    - ls dist/  # Artifacts from 'build' job available
```

**Artifact types:**

```yaml
test:
  script:
    - npm test
  artifacts:
    reports:
      junit: junit.xml          # Test reports
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura.xml
    paths:
      - test-results/
```

---

## Docker Integration

### Building Docker Images

**Docker-in-Docker (DinD):**

```yaml
build-docker:
  image: docker:20.10
  services:
    - docker:20.10-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
```

**Using Kaniko (no DinD required):**

```yaml
build-kaniko:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  script:
    - mkdir -p /kaniko/.docker
    - echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" > /kaniko/.docker/config.json
    - /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG
```

### Multi-Stage Docker Builds

```dockerfile
# Dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
build-optimized:
  image: docker:20.10
  services:
    - docker:20.10-dind
  script:
    - docker build --target builder -t $CI_REGISTRY_IMAGE:builder .
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

---

## Deployment Strategies

### Manual Deployment

```yaml
deploy-staging:
  stage: deploy
  script:
    - echo "Deploying to staging..."
    - ssh user@staging-server "cd /app && git pull && docker-compose up -d"
  environment:
    name: staging
    url: https://staging.example.com
  when: manual  # Requires manual trigger
  only:
    - develop
```

### Automatic Deployment

```yaml
deploy-production:
  stage: deploy
  script:
    - echo "Deploying to production..."
  environment:
    name: production
    url: https://example.com
  only:
    - main
```

### Blue-Green Deployment

```yaml
deploy-blue:
  stage: deploy
  script:
    - kubectl apply -f k8s/blue-deployment.yaml
    - kubectl set image deployment/myapp-blue myapp=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  environment:
    name: production-blue
  when: manual

switch-traffic:
  stage: deploy
  script:
    - kubectl patch service myapp -p '{"spec":{"selector":{"version":"blue"}}}'
  environment:
    name: production
  when: manual
  needs: ["deploy-blue"]
```

### Canary Deployment

```yaml
deploy-canary:
  stage: deploy
  script:
    - kubectl apply -f k8s/canary-deployment.yaml
    - kubectl set image deployment/myapp-canary myapp=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl scale deployment/myapp-canary --replicas=1  # 10% traffic
  environment:
    name: production-canary

promote-canary:
  stage: deploy
  script:
    - kubectl scale deployment/myapp-canary --replicas=10  # 100% traffic
    - kubectl scale deployment/myapp --replicas=0
  when: manual
  needs: ["deploy-canary"]
```

---

## Advanced Features

### Includes & Templates

**External file:**

```yaml
include:
  - local: '/.gitlab-ci-templates/build.yml'
  - remote: 'https://example.com/ci/templates/test.yml'
  - project: 'mygroup/ci-templates'
    ref: main
    file: '/templates/deploy.yml'
```

**Template file (`.gitlab-ci-templates/build.yml`):**

```yaml
.build_template:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

build-app:
  extends: .build_template
  variables:
    NODE_ENV: production
```

### Rules & Conditions

```yaml
build:
  script:
    - npm run build
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_COMMIT_TAG'
      when: never
    - when: manual
      allow_failure: true
```

### Merge Request Pipelines

```yaml
test-mr:
  script:
    - npm test
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'

deploy:
  script:
    - echo "Deploying..."
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
```

### Child Pipelines

```yaml
trigger-child:
  trigger:
    include: .gitlab-ci-child.yml
    strategy: depend  # Wait for child to complete
```

### Scheduled Pipelines

Set in GitLab UI: **CI/CD → Schedules**

```yaml
nightly-build:
  script:
    - npm run build
  rules:
    - if: '$CI_PIPELINE_SOURCE == "schedule"'
```

### Matrix Builds

```yaml
test:
  parallel:
    matrix:
      - NODE_VERSION: ["14", "16", "18"]
        OS: ["ubuntu-latest", "windows-latest"]
  image: node:${NODE_VERSION}
  script:
    - npm test
```

---

## Best Practices

### 1. Use Descriptive Job Names

```yaml
# Bad
job1:
  script:
    - npm test

# Good
unit-tests:node-18:
  script:
    - npm run test:unit
```

### 2. Fail Fast

```yaml
stages:
  - validate
  - build
  - test
  - deploy

lint:
  stage: validate
  script:
    - npm run lint
  allow_failure: false  # Stop pipeline if linting fails
```

### 3. Use Templates & DRY

```yaml
.deploy_template:
  script:
    - echo "Deploying to $ENVIRONMENT"
    - ssh user@$SERVER "cd /app && ./deploy.sh"

deploy-staging:
  extends: .deploy_template
  variables:
    ENVIRONMENT: staging
    SERVER: staging.example.com

deploy-production:
  extends: .deploy_template
  variables:
    ENVIRONMENT: production
    SERVER: example.com
  when: manual
```

### 4. Optimize Cache & Artifacts

```yaml
# Cache dependencies
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .npm/
  policy: pull-push

# Minimal artifacts
artifacts:
  paths:
    - dist/
  expire_in: 1 day  # Clean up old artifacts
```

### 5. Secure Secrets

- Use protected & masked variables
- Never hardcode credentials
- Rotate secrets regularly
- Use vault integrations (HashiCorp Vault, AWS Secrets Manager)

### 6. Version Control Your CI Config

```yaml
# Use semantic versioning for templates
include:
  - project: 'mygroup/ci-templates'
    ref: v1.2.0  # Pin to specific version
    file: '/templates/deploy.yml'
```

---

## Troubleshooting

### Common Issues

**Job stuck in pending:**

- Check runner availability: `Settings → CI/CD → Runners`
- Verify runner tags match job tags
- Check runner capacity (`concurrent` setting)

**Docker permission denied:**

```yaml
build:
  image: docker:20.10
  services:
    - docker:20.10-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"  # Enable TLS
```

**Cache not working:**

```yaml
cache:
  key: "$CI_COMMIT_REF_SLUG-$CI_PROJECT_ID"  # Unique key
  paths:
    - node_modules/
  policy: pull-push
```

**Artifacts not available:**

```yaml
build:
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

test:
  dependencies:
    - build  # Explicitly declare dependency
  script:
    - ls dist/
```

### Debug Mode

```yaml
debug-job:
  script:
    - export  # Print all environment variables
    - pwd
    - ls -la
    - echo $CI_COMMIT_SHA
  artifacts:
    paths:
      - "**/*"  # Save everything for inspection
    when: on_failure
```

---

## Example Pipelines

### Node.js Application

```yaml
stages:
  - validate
  - build
  - test
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

lint:
  stage: validate
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm run prettier:check

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

unit-tests:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run test:unit
  coverage: '/Statements\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura.xml

integration-tests:
  stage: test
  image: node:${NODE_VERSION}
  services:
    - postgres:14
  variables:
    POSTGRES_DB: testdb
    POSTGRES_USER: user
    POSTGRES_PASSWORD: password
  script:
    - npm ci
    - npm run test:integration

docker-build:
  stage: deploy
  image: docker:20.10
  services:
    - docker:20.10-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
    - develop

deploy-staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $DEPLOY_USER@$STAGING_SERVER "cd /app && docker-compose pull && docker-compose up -d"
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy-production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
  script:
    - ssh -o StrictHostKeyChecking=no $DEPLOY_USER@$PROD_SERVER "cd /app && docker-compose pull && docker-compose up -d"
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main
```

### Python Application

```yaml
stages:
  - test
  - build
  - deploy

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  paths:
    - .cache/pip
    - venv/

before_script:
  - python -V
  - pip install virtualenv
  - virtualenv venv
  - source venv/bin/activate
  - pip install -r requirements.txt

test:
  stage: test
  image: python:3.11
  script:
    - pytest --cov=app tests/
    - flake8 app/
  coverage: '/TOTAL.*\s+(\d+%)$/'
  artifacts:
    reports:
      junit: report.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml

build-docker:
  stage: build
  image: docker:20.10
  services:
    - docker:20.10-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy-k8s:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context $KUBE_CONTEXT
    - kubectl set image deployment/myapp myapp=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/myapp
  environment:
    name: production
  only:
    - main
```

---

## Resources

- **Official Documentation:** [https://docs.gitlab.com/ee/ci/](https://docs.gitlab.com/ee/ci/)
- **CI/CD Examples:** [https://gitlab.com/gitlab-org/gitlab/-/tree/master/lib/gitlab/ci/templates](https://gitlab.com/gitlab-org/gitlab/-/tree/master/lib/gitlab/ci/templates)
- **Runner Documentation:** [https://docs.gitlab.com/runner/](https://docs.gitlab.com/runner/)
- **GitLab CI/CD Lint:** Use built-in linter in GitLab UI or `gitlab-ci-lint` CLI

---

**Note:** Always test pipeline changes in a feature branch before merging to main. Use the GitLab CI Lint tool to validate `.gitlab-ci.yml` syntax.
