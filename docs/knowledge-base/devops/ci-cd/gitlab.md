---
title: 🦊 GitLab
---

# 🧩 GitLab

**GitLab** is a web-based DevOps platform that integrates **version control, CI/CD, issue tracking, code review, and container registry**.  
It supports **local installations** (self-hosted) and cloud offerings.

---

## Table of Contents

1. [Basics](#basics)
2. [Installation](#installation)
3. [GitLab UI Overview](#gitlab-ui-overview)
4. [Git Repository Management](#git-repository-management)
5. [Merge Requests & Code Review](#merge-requests--code-review)
6. [CI/CD Pipelines](#cicd-pipelines)
7. [Container Registry](#container-registry)
8. [Issue Tracking & Wiki](#issue-tracking--wiki)
9. [Best Practices](#best-practices)
10. [Local Lab Environment with CI/CD](#local-lab-environment-with-cicd)

---

## Basics

- **GitLab CE/EE**: Community Edition (free) or Enterprise Edition
- **Repositories:** Git-based, version control for projects
- **Branches & Merge Requests:** Workflow for parallel development and review
- **CI/CD:** Configure pipelines directly in GitLab
- **Container Registry:** Store Docker images directly in GitLab
- **Issue Tracker & Wiki:** Project management directly integrated

---

## Installation

### a) Docker (Self-Hosted, offline/online)

```bash
docker run --name gitlab \
  --hostname gitlab.local \
  -p 8929:8929 -p 2289:22 \
  -v ~/gitlab/config:/etc/gitlab \
  -v ~/gitlab/logs:/var/log/gitlab \
  -v ~/gitlab/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```

- Access: `<http://localhost:8929>`
- Root password: `cat ~/gitlab/data/initial_root_password`
- SSH port for push/clone: 2289

---

### b) Package Installation (Debian/Ubuntu)

```bash
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash
sudo EXTERNAL_URL="http://gitlab.local" apt-get install gitlab-ce
sudo gitlab-ctl reconfigure
```

---

## GitLab UI Overview

- **Dashboard:** Projects, groups, activities
- **Projects:** Source code repositories, CI/CD pipelines, issues
- **Groups:** Collection of multiple projects
- **Merge Requests:** Code review & approvals
- **Settings:** Users, integrations, webhooks, access tokens

---

## Git Repository Management

### a) Create New Repository

1. New project → Assign name
2. Copy repository URL (HTTPS or SSH)
3. Connect local repo:

```bash
git init
git remote add origin git@gitlab.local:mygroup/myproject.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### b) Branching Strategy

- `main` or `master` = stable version
- Feature branches: `feature/xyz`
- Hotfix branches: `hotfix/abc`
- Use merge requests for code review

---

## Merge Requests & Code Review

- Merge Requests = Pull Requests in GitHub
- Benefits:
  - Code review
  - Automatic pipeline triggers
  - Discussions & approvals
- Example: Merge feature branch into `main`

---

## CI/CD Pipelines

### a) GitLab CI/CD Basics

- Configuration in `.gitlab-ci.yml` in the repository
- Stages: `build`, `test`, `deploy`
- Runner: executes jobs (local or Docker)

### b) Example `.gitlab-ci.yml`

```yaml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_IMAGE: myapp:latest

build:
  stage: build
  script:
    - echo "Building Docker image"
    - docker build -t $DOCKER_IMAGE .

test:
  stage: test
  script:
    - echo "Running tests"
    - ./run_tests.sh

deploy:
  stage: deploy
  script:
    - echo "Deploying to Minikube"
    - helm upgrade --install myapp ./helm/myapp-chart
  only:
    - main
```

---

### c) GitLab Runner

- **Local installation (Docker)**:

```bash
docker run -d --name gitlab-runner --restart always \
-v /var/run/docker.sock:/var/run/docker.sock \
-v ~/gitlab-runner/config:/etc/gitlab-runner \
gitlab/gitlab-runner:latest
```

- Register runner:

```bash
gitlab-runner register \
--url http://gitlab.local/ \
--registration-token <TOKEN> \
--executor docker \
--docker-image docker:stable \
--description "Local Runner"
```

---

## Container Registry

- GitLab can host **Docker images**
- Push:

```bash
docker login gitlab.local:8929
docker tag myapp:latest gitlab.local:8929/mygroup/myapp:latest
docker push gitlab.local:8929/mygroup/myapp:latest
```

- Pull in pipelines possible

---

## Issue Tracking & Wiki

- **Issues**: Tasks, bugs, features
- **Labels**: e.g., `bug`, `feature`, `urgent`
- **Wiki**: Manage documentation directly in the project

---

## Best Practices

- Use **branches & merge requests** for code review
- Version `.gitlab-ci.yml`
- Run **runners** separately for CI/CD
- Use **container registry**, version images
- Automate deployment to test/dev cluster
- Protect `main` branch with approval rules
- Use webhooks for notifications

---

## Local Lab Environment with CI/CD

- Can be combined with:
  - **Jenkins**: alternative pipeline engine
  - **Nexus**: artifact repository
  - **Minikube + Helm**: deployment tests
  - **SonarQube**: code quality checks

- Advantage: Completely offline, reproducible tests

---

## Resources

- Official website: [https://about.gitlab.com/](https://about.gitlab.com/)
- Documentation: [https://docs.gitlab.com/](https://docs.gitlab.com/)
- CI/CD: [https://docs.gitlab.com/ee/ci/](https://docs.gitlab.com/ee/ci/)
- GitLab Runner: [https://docs.gitlab.com/runner/](https://docs.gitlab.com/runner/)
- Container Registry: [https://docs.gitlab.com/ee/user/packages/container_registry.html](https://docs.gitlab.com/ee/user/packages/container_registry.html)

---
