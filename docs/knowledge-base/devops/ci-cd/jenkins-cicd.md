---
title: 🔧 Jenkins CI/CD
---

# Jenkins CI/CD

Jenkins is the leading open-source automation server that enables developers to build, test, and deploy their software reliably. This comprehensive guide covers everything from installation to advanced pipeline configurations.

---

## Table of Contents

1. [Introduction & Overview](#introduction--overview)
2. [Architecture & Concepts](#architecture--concepts)
3. [Installation & Setup](#installation--setup)
4. [Jenkins Configuration](#jenkins-configuration)
5. [Agents & Nodes](#agents--nodes)
6. [Jenkins Jobs](#jenkins-jobs)
7. [Jenkins Pipeline (Declarative)](#jenkins-pipeline-declarative)
8. [Jenkins Pipeline (Scripted)](#jenkins-pipeline-scripted)
9. [Pipeline Syntax & Features](#pipeline-syntax--features)
10. [Shared Libraries](#shared-libraries)
11. [Docker Integration](#docker-integration)
12. [Kubernetes Integration](#kubernetes-integration)
13. [Plugins & Ecosystem](#plugins--ecosystem)
14. [Security & Authentication](#security--authentication)
15. [Monitoring & Maintenance](#monitoring--maintenance)
16. [Best Practices](#best-practices)
17. [Troubleshooting](#troubleshooting)
18. [Example Pipelines](#example-pipelines)

---

## Introduction & Overview

### What is Jenkins?

Jenkins is an open-source automation server that provides:

- **Continuous Integration:** Automated builds and tests on every commit
- **Continuous Delivery:** Automated deployment pipelines
- **Extensibility:** 1,800+ plugins for integration with virtually any tool
- **Distributed Builds:** Master-agent architecture for scalability
- **Pipeline as Code:** Jenkinsfile for version-controlled pipelines

### Jenkins vs Other CI/CD Tools

| Feature | Jenkins | GitLab CI/CD | GitHub Actions | CircleCI |
|---------|---------|--------------|----------------|----------|
| **Cost** | Free/Open Source | Free/Premium | Free/Usage-based | Free/Usage-based |
| **Hosting** | Self-hosted | SaaS/Self-hosted | SaaS | SaaS |
| **Configuration** | Jenkinsfile | .gitlab-ci.yml | Workflows YAML | config.yml |
| **Plugins** | 1,800+ | Built-in | Marketplace | Orbs |
| **Flexibility** | Extremely flexible | Moderate | Moderate | Moderate |
| **Learning Curve** | Steep | Moderate | Easy | Easy |
| **Community** | Massive | Large | Large | Medium |

### Key Concepts

- **Master/Controller:** Central server that coordinates builds
- **Agent/Node:** Machine that executes build jobs
- **Job:** Single task (freestyle, pipeline, multibranch)
- **Pipeline:** Complete CI/CD workflow defined as code
- **Stage:** Logical grouping of steps in a pipeline
- **Step:** Individual task (shell command, plugin action)
- **Workspace:** Directory where build is executed
- **Artifact:** Build output stored for later use
- **Jenkinsfile:** Pipeline definition stored in repository

### Typical Workflow

```text
Code Push → Git Repository
    ↓
Webhook triggers Jenkins
    ↓
Jenkins Pipeline Execution
    ├── Stage: Checkout
    ├── Stage: Build
    ├── Stage: Test
    ├── Stage: Security Scan
    ├── Stage: Package
    └── Stage: Deploy
    ↓
Notifications (Email, Slack, Jira)
```

---

## Architecture & Concepts

### Jenkins Architecture

```text
Jenkins Master (Controller)
├── Web UI (Port 8080)
├── Build Scheduling
├── Plugin Management
├── Job Configuration Storage
└── Build History & Artifacts
    ↓
Jenkins Agents (Nodes)
├── Permanent Agent (SSH/JNLP)
├── Cloud Agent (Docker/Kubernetes)
└── Static Agent (Windows/Linux/macOS)
    ↓
External Services
├── Git (GitHub, GitLab, Bitbucket)
├── Docker Registry
├── Artifact Repository (Nexus, Artifactory)
├── Cloud Providers (AWS, Azure, GCP)
└── Notification Services (Slack, Email)
```

### Pipeline Structure

```groovy
pipeline {
    agent any
    
    environment {
        // Global variables
    }
    
    stages {
        stage('Build') {
            steps {
                // Build steps
            }
        }
        stage('Test') {
            steps {
                // Test steps
            }
        }
        stage('Deploy') {
            steps {
                // Deploy steps
            }
        }
    }
    
    post {
        // Post-build actions
    }
}
```

### Master-Agent Communication

```text
Jenkins Master
    ↓ (SSH/JNLP)
Static Agent (Always connected)

Jenkins Master
    ↓ (Docker API)
Docker Agent (On-demand container)

Jenkins Master
    ↓ (Kubernetes API)
Kubernetes Pod (On-demand pod)
```

---

## Installation & Setup

### System Requirements

**Minimum:**

- CPU: 2 cores
- RAM: 4 GB
- Disk: 20 GB
- Java: JDK 11 or JDK 17

**Recommended:**

- CPU: 4+ cores
- RAM: 8+ GB
- Disk: 50+ GB
- Java: JDK 17

### Installation on Linux (Debian/Ubuntu)

**1. Install Java:**

```bash
sudo apt update
sudo apt install openjdk-17-jdk -y
java -version
```

**2. Add Jenkins Repository:**

```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
```

**3. Install Jenkins:**

```bash
sudo apt update
sudo apt install jenkins -y
```

**4. Start Jenkins:**

```bash
sudo systemctl start jenkins
sudo systemctl enable jenkins
sudo systemctl status jenkins
```

**5. Access Jenkins:**

Navigate to `http://localhost:8080`

**6. Unlock Jenkins:**

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Copy the password and paste it in the web interface.

**7. Install Suggested Plugins:**

Choose "Install suggested plugins" to get started quickly.

**8. Create Admin User:**

Set up your admin username and password.

### Installation on Linux (RHEL/CentOS)

```bash
# Install Java
sudo yum install java-17-openjdk -y

# Add Jenkins repository
sudo wget -O /etc/yum.repos.d/jenkins.repo \
    https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key

# Install Jenkins
sudo yum install jenkins -y

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### Installation with Docker

**Simple Docker Run:**

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

**Docker Compose (Recommended):**

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  jenkins:
    image: jenkins/jenkins:lts-jdk17
    container_name: jenkins
    privileged: true
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
    environment:
      - JENKINS_OPTS=--prefix=/jenkins
    restart: unless-stopped

volumes:
  jenkins_home:
    driver: local
```

**Start Jenkins:**

```bash
docker-compose up -d
docker-compose logs -f jenkins
```

**Get initial password:**

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Installation with Kubernetes (Helm)

**1. Add Jenkins Helm repository:**

```bash
helm repo add jenkins https://charts.jenkins.io
helm repo update
```

**2. Create values.yaml:**

```yaml
controller:
  adminPassword: "admin123"
  installPlugins:
    - kubernetes:latest
    - workflow-aggregator:latest
    - git:latest
    - configuration-as-code:latest
  
  resources:
    requests:
      cpu: "500m"
      memory: "2Gi"
    limits:
      cpu: "2000m"
      memory: "4Gi"
  
  ingress:
    enabled: true
    hostName: jenkins.example.com

agent:
  enabled: true
  resources:
    requests:
      cpu: "500m"
      memory: "1Gi"

persistence:
  enabled: true
  size: 20Gi
```

**3. Install Jenkins:**

```bash
kubectl create namespace jenkins

helm install jenkins jenkins/jenkins \
  --namespace jenkins \
  --values values.yaml
```

**4. Get admin password:**

```bash
kubectl exec -n jenkins -it svc/jenkins -c jenkins -- \
  cat /run/secrets/additional/chart-admin-password
```

### Installation on Windows

**1. Download Jenkins:**

- Visit [jenkins.io/download](https://www.jenkins.io/download/)
- Download Windows installer (`.msi`)

**2. Run Installer:**

- Follow installation wizard
- Choose installation directory
- Select port (default: 8080)
- Install as Windows service

**3. Start Jenkins:**

```powershell
# Start service
net start jenkins

# Check status
Get-Service jenkins
```

**4. Access Jenkins:**

- Navigate to `http://localhost:8080`
- Follow setup wizard

---

## Jenkins Configuration

### System Configuration

**Navigate to:** Manage Jenkins → System

**Global Settings:**

```yaml
Jenkins Location:
  URL: http://jenkins.example.com:8080
  System Admin Email: jenkins@example.com

# of executors: 2  # Number of builds on master

Usage: Only build jobs with label matching this node

Quiet period: 5  # Seconds to wait before starting build

SCM checkout retry count: 3
```

### Global Tool Configuration

**Navigate to:** Manage Jenkins → Global Tool Configuration

**JDK:**

```yaml
JDK installations:
  - Name: JDK 17
    JAVA_HOME: /usr/lib/jvm/java-17-openjdk
    Install automatically: No
```

**Git:**

```yaml
Git installations:
  - Name: Default
    Path to Git executable: git
    Install automatically: No
```

**Maven:**

```yaml
Maven installations:
  - Name: Maven 3.9
    Install automatically: Yes
    Version: 3.9.6
```

**Node.js:**

```yaml
NodeJS installations:
  - Name: Node 18
    Install automatically: Yes
    Version: 18.19.0
```

**Docker:**

```yaml
Docker installations:
  - Name: Docker
    Install automatically: No
    Docker executable: docker
```

### Configure System Environment

**Environment Variables:**

```yaml
Global properties:
  Environment variables:
    - DOCKER_REGISTRY: registry.example.com
    - MAVEN_OPTS: -Xmx2048m
    - NODE_ENV: production
    - ANSIBLE_HOST_KEY_CHECKING: False
```

### Credentials Management

**Navigate to:** Manage Jenkins → Credentials → System → Global credentials

**Add Credentials:**

**Username/Password:**

```yaml
Kind: Username with password
Scope: Global
Username: deployuser
Password: ********
ID: deploy-credentials
Description: Deployment credentials
```

**SSH Key:**

```yaml
Kind: SSH Username with private key
Scope: Global
Username: jenkins
Private Key: Enter directly (paste private key)
ID: ssh-key
Description: SSH key for agent connection
```

**Secret Text:**

```yaml
Kind: Secret text
Scope: Global
Secret: ********
ID: api-token
Description: API token
```

**Docker Registry Credentials:**

```yaml
Kind: Username with password
Username: dockeruser
Password: ********
ID: docker-registry
Description: Docker registry credentials
```

---

## Agents & Nodes

### Agent Types

1. **Permanent Agent:** Always-on machine connected via SSH or JNLP
2. **Cloud Agent:** On-demand instances (Docker, Kubernetes, AWS)
3. **Built-in Node:** Jenkins master (not recommended for builds)

### Adding a Permanent Agent (SSH)

**1. Prepare Agent Machine:**

```bash
# Install Java
sudo apt install openjdk-17-jdk -y

# Create Jenkins user
sudo useradd -m -s /bin/bash jenkins

# Create working directory
sudo mkdir -p /home/jenkins/agent
sudo chown jenkins:jenkins /home/jenkins/agent

# Generate SSH key on Jenkins master
ssh-keygen -t rsa -b 4096 -f ~/.ssh/jenkins_agent

# Copy public key to agent
ssh-copy-id -i ~/.ssh/jenkins_agent.pub jenkins@agent-host
```

**2. Add Agent in Jenkins:**

Navigate to: Manage Jenkins → Nodes → New Node

```yaml
Node name: linux-agent-01
Type: Permanent Agent

Configuration:
  Remote root directory: /home/jenkins/agent
  Labels: linux docker maven
  Usage: Use this node as much as possible
  Launch method: Launch agents via SSH
  Host: agent-host.example.com
  Credentials: jenkins-ssh-key
  Host Key Verification Strategy: Known hosts file
  Availability: Keep this agent online as much as possible
```

### Adding Docker Agent

**1. Install Docker Cloud Plugin:**

Manage Jenkins → Plugins → Available Plugins → Docker

**2. Configure Docker Cloud:**

Manage Jenkins → Clouds → New cloud → Docker

```yaml
Name: docker-cloud
Docker Host URI: unix:///var/run/docker.sock
Enabled: Yes

Docker Agent templates:
  - Label: docker-agent
    Name: docker-agent
    Docker Image: jenkins/agent:latest
    Remote Filing System Root: /home/jenkins
    Usage: Use this node as much as possible
    Connect method: Attach Docker container
    
  - Label: maven-agent
    Docker Image: maven:3.9-jdk-17
    
  - Label: node-agent
    Docker Image: node:18
```

### Adding Kubernetes Agent

**1. Install Kubernetes Plugin:**

Manage Jenkins → Plugins → Kubernetes

**2. Configure Kubernetes Cloud:**

```yaml
Name: kubernetes
Kubernetes URL: https://kubernetes.default
Kubernetes Namespace: jenkins
Credentials: (service account token)
Jenkins URL: http://jenkins.jenkins.svc.cluster.local:8080

Pod Templates:
  - Name: jnlp-agent
    Namespace: jenkins
    Labels: kubernetes docker
    Containers:
      - Name: jnlp
        Docker Image: jenkins/inbound-agent:latest
        Working directory: /home/jenkins/agent
      - Name: docker
        Docker Image: docker:latest
        Command: cat
        Tty: true
    Volumes:
      - Host Path Volume:
          Host path: /var/run/docker.sock
          Mount path: /var/run/docker.sock
```

### Agent Labels

Use labels to route jobs to specific agents:

```groovy
pipeline {
    agent {
        label 'linux && docker && maven'
    }
    // Pipeline definition
}
```

**Common Label Patterns:**

- `linux`, `windows`, `macos`
- `docker`, `kubernetes`
- `maven`, `gradle`, `npm`
- `x86`, `arm64`
- `gpu`, `high-memory`

---

## Jenkins Jobs

### Job Types

1. **Freestyle Project:** UI-based job configuration
2. **Pipeline:** Pipeline as code (Jenkinsfile)
3. **Multibranch Pipeline:** Automatic pipeline per branch
4. **Organization Folder:** Scan entire GitHub organization
5. **Folder:** Organize jobs into folders

### Creating a Freestyle Job

**1. New Item → Freestyle project**

**2. Configure:**

```yaml
General:
  Description: Build and test MyApp
  Discard old builds: Keep last 30 builds

Source Code Management:
  Git:
    Repository URL: https://github.com/myorg/myapp.git
    Credentials: github-credentials
    Branch: */main

Build Triggers:
  Poll SCM: H/5 * * * *  # Every 5 minutes
  GitHub hook trigger for GITScm polling

Build Environment:
  Delete workspace before build starts
  Add timestamps to console output

Build Steps:
  1. Execute shell:
     #!/bin/bash
     npm ci
     npm test
     npm run build
  
  2. Invoke top-level Maven targets:
     Goals: clean package
     Maven Version: Maven 3.9

Post-build Actions:
  Archive artifacts: target/*.jar
  Publish JUnit test results: **/target/surefire-reports/*.xml
  Email notification: team@example.com
```

### Creating a Pipeline Job

**1. New Item → Pipeline**

**2. Configure:**

```yaml
General:
  Description: MyApp Pipeline

Pipeline:
  Definition: Pipeline script from SCM
  SCM: Git
  Repository URL: https://github.com/myorg/myapp.git
  Script Path: Jenkinsfile
  Branches to build: */main
```

### Creating a Multibranch Pipeline

**1. New Item → Multibranch Pipeline**

**2. Configure:**

```yaml
Branch Sources:
  Git:
    Project Repository: https://github.com/myorg/myapp.git
    Credentials: github-credentials
    Behaviors:
      - Discover branches: All branches
      - Discover pull requests: Merging the pull request with current target
      - Clean before checkout

Build Configuration:
  Mode: by Jenkinsfile
  Script Path: Jenkinsfile

Scan Multibranch Pipeline Triggers:
  Periodically if not otherwise run: 1 hour

Orphaned Item Strategy:
  Discard old items:
    Days to keep old items: 7
    Max # of old items to keep: 10
```

---

## Jenkins Pipeline (Declarative)

### Basic Structure

**Jenkinsfile:**

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Testing...'
                sh 'npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh './deploy.sh'
            }
        }
    }
}
```

### Agent Configuration

**Global agent:**

```groovy
pipeline {
    agent any  // Run on any available agent
}
```

**No global agent:**

```groovy
pipeline {
    agent none  // Define agent per stage
    
    stages {
        stage('Build') {
            agent { label 'linux' }
            steps { /* ... */ }
        }
    }
}
```

**Docker agent:**

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
            label 'docker'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
}
```

**Kubernetes agent:**

```groovy
pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: maven
    image: maven:3.9-jdk-17
    command: ['cat']
    tty: true
  - name: docker
    image: docker:latest
    command: ['cat']
    tty: true
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
'''
        }
    }
}
```

### Environment Variables

```groovy
pipeline {
    agent any
    
    environment {
        // Global variables
        DOCKER_REGISTRY = 'registry.example.com'
        APP_NAME = 'myapp'
        VERSION = "${env.BUILD_NUMBER}"
        
        // Credentials
        DOCKER_CREDENTIALS = credentials('docker-registry')
        AWS_CREDENTIALS = credentials('aws-credentials')
        
        // Computed variables
        IMAGE_TAG = "${DOCKER_REGISTRY}/${APP_NAME}:${VERSION}"
    }
    
    stages {
        stage('Build') {
            environment {
                // Stage-specific variable
                NODE_ENV = 'production'
            }
            steps {
                echo "Building ${IMAGE_TAG}"
                sh 'printenv | sort'
            }
        }
    }
}
```

### Parameters

```groovy
pipeline {
    agent any
    
    parameters {
        string(
            name: 'BRANCH',
            defaultValue: 'main',
            description: 'Branch to build'
        )
        
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging', 'production'],
            description: 'Deployment environment'
        )
        
        booleanParam(
            name: 'RUN_TESTS',
            defaultValue: true,
            description: 'Run tests?'
        )
        
        text(
            name: 'DEPLOY_NOTES',
            defaultValue: '',
            description: 'Deployment notes'
        )
    }
    
    stages {
        stage('Deploy') {
            steps {
                echo "Deploying to ${params.ENVIRONMENT}"
                echo "Notes: ${params.DEPLOY_NOTES}"
            }
        }
    }
}
```

### Triggers

```groovy
pipeline {
    agent any
    
    triggers {
        // Poll SCM every 5 minutes
        pollSCM('H/5 * * * *')
        
        // Cron schedule (daily at 2 AM)
        cron('0 2 * * *')
        
        // Upstream job trigger
        upstream(
            upstreamProjects: 'upstream-job',
            threshold: hudson.model.Result.SUCCESS
        )
    }
}
```

### Options

```groovy
pipeline {
    agent any
    
    options {
        // Build timeout
        timeout(time: 1, unit: 'HOURS')
        
        // Keep only last 30 builds
        buildDiscarder(logRotator(numToKeepStr: '30'))
        
        // Disable concurrent builds
        disableConcurrentBuilds()
        
        // Timestamps in console
        timestamps()
        
        // Retry build on failure
        retry(3)
        
        // Skip default checkout
        skipDefaultCheckout()
    }
}
```

### When Conditions

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy to Production') {
            when {
                branch 'main'
                environment name: 'DEPLOY_ENV', value: 'production'
            }
            steps {
                echo 'Deploying to production'
            }
        }
        
        stage('Run Tests') {
            when {
                expression { params.RUN_TESTS == true }
            }
            steps {
                sh 'npm test'
            }
        }
        
        stage('Deploy Feature') {
            when {
                branch 'feature/*'
            }
            steps {
                echo 'Deploying feature branch'
            }
        }
        
        stage('Weekend Build') {
            when {
                triggeredBy 'TimerTrigger'
            }
            steps {
                echo 'Running scheduled build'
            }
        }
    }
}
```

### Post Actions

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
    
    post {
        always {
            echo 'This runs always'
            junit '**/target/surefire-reports/*.xml'
        }
        
        success {
            echo 'Build succeeded!'
            slackSend(
                color: 'good',
                message: "Build ${env.BUILD_NUMBER} succeeded"
            )
        }
        
        failure {
            echo 'Build failed!'
            emailext(
                to: 'team@example.com',
                subject: "Build ${env.BUILD_NUMBER} failed",
                body: "Check console output at ${env.BUILD_URL}"
            )
        }
        
        unstable {
            echo 'Build is unstable'
        }
        
        changed {
            echo 'Build status changed'
        }
        
        cleanup {
            echo 'Cleaning up workspace'
            deleteDir()
        }
    }
}
```

---

## Jenkins Pipeline (Scripted)

### Basic Structure

```groovy
node {
    stage('Checkout') {
        checkout scm
    }
    
    stage('Build') {
        sh 'npm install'
        sh 'npm run build'
    }
    
    stage('Test') {
        sh 'npm test'
    }
    
    stage('Deploy') {
        sh './deploy.sh'
    }
}
```

### Advanced Scripted Pipeline

```groovy
node('docker') {
    def app
    
    try {
        stage('Checkout') {
            checkout scm
        }
        
        stage('Build') {
            sh 'npm ci'
            sh 'npm run build'
        }
        
        stage('Test') {
            parallel(
                'Unit Tests': {
                    sh 'npm run test:unit'
                },
                'Integration Tests': {
                    sh 'npm run test:integration'
                },
                'Lint': {
                    sh 'npm run lint'
                }
            )
        }
        
        stage('Docker Build') {
            app = docker.build("myapp:${env.BUILD_NUMBER}")
        }
        
        stage('Docker Push') {
            docker.withRegistry('https://registry.example.com', 'docker-credentials') {
                app.push("${env.BUILD_NUMBER}")
                app.push("latest")
            }
        }
        
        stage('Deploy') {
            if (env.BRANCH_NAME == 'main') {
                sh "kubectl set image deployment/myapp myapp=registry.example.com/myapp:${env.BUILD_NUMBER}"
            }
        }
        
        currentBuild.result = 'SUCCESS'
        
    } catch (Exception e) {
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        stage('Cleanup') {
            sh 'docker system prune -f'
        }
        
        stage('Notify') {
            if (currentBuild.result == 'SUCCESS') {
                slackSend(color: 'good', message: "Build ${env.BUILD_NUMBER} succeeded")
            } else {
                slackSend(color: 'danger', message: "Build ${env.BUILD_NUMBER} failed")
            }
        }
    }
}
```

### Declarative vs Scripted

**Declarative (Recommended):**

- Structured, easier to read
- Built-in error handling
- Validation before execution
- Better for most use cases

**Scripted:**

- Full Groovy scripting
- More flexibility
- Complex logic and conditions
- Legacy pipelines

---

## Pipeline Syntax & Features

### Parallel Execution

```groovy
pipeline {
    agent any
    
    stages {
        stage('Parallel Tests') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    agent { label 'docker' }
                    steps {
                        sh 'npm run test:integration'
                    }
                }
                stage('E2E Tests') {
                    steps {
                        sh 'npm run test:e2e'
                    }
                }
            }
        }
    }
}
```

### Matrix Builds

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test') {
            matrix {
                agent any
                axes {
                    axis {
                        name 'PLATFORM'
                        values 'linux', 'windows', 'mac'
                    }
                    axis {
                        name 'NODE_VERSION'
                        values '16', '18', '20'
                    }
                }
                stages {
                    stage('Build') {
                        steps {
                            echo "Building on ${PLATFORM} with Node ${NODE_VERSION}"
                            sh "nvm use ${NODE_VERSION} && npm install && npm run build"
                        }
                    }
                }
            }
        }
    }
}
```

### Input Step

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy to Production') {
            steps {
                input(
                    message: 'Deploy to production?',
                    ok: 'Deploy',
                    submitter: 'admin,release-manager',
                    parameters: [
                        string(name: 'VERSION', description: 'Version to deploy'),
                        choice(name: 'STRATEGY', choices: ['blue-green', 'rolling'], description: 'Deployment strategy')
                    ]
                )
                
                echo "Deploying version ${VERSION} using ${STRATEGY} strategy"
                sh './deploy.sh'
            }
        }
    }
}
```

### Credentials Usage

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                // Username/Password
                withCredentials([usernamePassword(
                    credentialsId: 'deploy-creds',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh '''
                        echo "User: $USERNAME"
                        # Password available as $PASSWORD
                    '''
                }
                
                // SSH Key
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ssh-key',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        ssh -i $SSH_KEY $SSH_USER@server.example.com 'deploy.sh'
                    '''
                }
                
                // Secret Text
                withCredentials([string(
                    credentialsId: 'api-token',
                    variable: 'API_TOKEN'
                )]) {
                    sh 'curl -H "Authorization: Bearer $API_TOKEN" https://api.example.com'
                }
            }
        }
    }
}
```

### Stash & Unstash

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build') {
            agent { label 'linux' }
            steps {
                sh 'npm run build'
                stash(name: 'built-app', includes: 'dist/**')
            }
        }
        
        stage('Test') {
            agent { label 'test-server' }
            steps {
                unstash 'built-app'
                sh 'npm test'
            }
        }
        
        stage('Deploy') {
            agent { label 'production' }
            steps {
                unstash 'built-app'
                sh './deploy.sh'
            }
        }
    }
}
```

### Archive Artifacts

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
    
    post {
        always {
            // Archive build artifacts
            archiveArtifacts artifacts: 'dist/**/*.js, dist/**/*.css', 
                             fingerprint: true
            
            // Archive test results
            junit '**/target/surefire-reports/*.xml'
            
            // Publish HTML reports
            publishHTML(target: [
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
    }
}
```

---

## Shared Libraries

### What are Shared Libraries?

Shared libraries allow you to reuse pipeline code across multiple projects.

### Creating a Shared Library

**Repository structure:**

```text
jenkins-shared-library/
├── vars/
│   ├── buildNodeApp.groovy
│   ├── buildJavaApp.groovy
│   └── deployToK8s.groovy
├── src/
│   └── org/
│       └── mycompany/
│           └── jenkins/
│               └── Utils.groovy
└── resources/
    └── kubernetes/
        └── deployment.yaml
```

**vars/buildNodeApp.groovy:**

```groovy
def call(Map config = [:]) {
    pipeline {
        agent any
        
        stages {
            stage('Checkout') {
                steps {
                    checkout scm
                }
            }
            
            stage('Install') {
                steps {
                    sh 'npm ci'
                }
            }
            
            stage('Build') {
                steps {
                    sh 'npm run build'
                }
            }
            
            stage('Test') {
                when {
                    expression { config.runTests != false }
                }
                steps {
                    sh 'npm test'
                }
            }
            
            stage('Docker Build') {
                when {
                    expression { config.dockerBuild == true }
                }
                steps {
                    script {
                        def image = docker.build("${config.imageName}:${env.BUILD_NUMBER}")
                        image.push()
                    }
                }
            }
        }
    }
}
```

**src/org/mycompany/jenkins/Utils.groovy:**

```groovy
package org.mycompany.jenkins

class Utils implements Serializable {
    def script
    
    Utils(script) {
        this.script = script
    }
    
    def sendNotification(String message, String color = 'good') {
        script.slackSend(color: color, message: message)
    }
    
    def getVersion() {
        return script.sh(
            script: 'git describe --tags --always',
            returnStdout: true
        ).trim()
    }
    
    def deployToKubernetes(String namespace, String deployment, String image) {
        script.sh """
            kubectl set image deployment/${deployment} \
                ${deployment}=${image} \
                -n ${namespace}
        """
    }
}
```

### Configuring Shared Library

**Navigate to:** Manage Jenkins → System → Global Pipeline Libraries

```yaml
Name: jenkins-shared-library
Default version: main
Retrieval method:
  Modern SCM:
    Source: Git
    Project Repository: https://github.com/myorg/jenkins-shared-library.git
    Credentials: github-credentials

Load implicitly: Yes
Allow default version to be overridden: Yes
```

### Using Shared Library

**Jenkinsfile:**

```groovy
@Library('jenkins-shared-library@main') _

buildNodeApp(
    runTests: true,
    dockerBuild: true,
    imageName: 'myapp/frontend'
)
```

**Advanced usage:**

```groovy
@Library('jenkins-shared-library@main') _

import org.mycompany.jenkins.Utils

pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                script {
                    def utils = new Utils(this)
                    def version = utils.getVersion()
                    
                    echo "Building version: ${version}"
                    sh 'npm run build'
                    
                    utils.sendNotification("Build ${version} completed", 'good')
                }
            }
        }
    }
}
```

---

## Docker Integration

### Docker Pipeline Plugin

**Basic Docker usage:**

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }
}
```

### Building Docker Images

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'registry.example.com'
        IMAGE_NAME = 'myapp'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    def app = docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }
        
        stage('Docker Push') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        def app = docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}")
                        app.push()
                        app.push('latest')
                    }
                }
            }
        }
    }
}
```

### Multi-Container Pipeline

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test') {
            agent {
                docker {
                    image 'node:18'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                sh '''
                    docker-compose up -d database redis
                    npm test
                    docker-compose down
                '''
            }
        }
    }
}
```

### Docker Compose in Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Integration Test') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.test.yml up -d'
                    
                    try {
                        sh 'docker-compose -f docker-compose.test.yml exec -T app npm test'
                    } finally {
                        sh 'docker-compose -f docker-compose.test.yml down -v'
                    }
                }
            }
        }
    }
}
```

---

## Kubernetes Integration

### Kubernetes Plugin

**Pipeline with Kubernetes pod:**

```groovy
pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins: agent
spec:
  containers:
  - name: maven
    image: maven:3.9-jdk-17
    command:
    - cat
    tty: true
  - name: docker
    image: docker:latest
    command:
    - cat
    tty: true
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - cat
    tty: true
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
'''
        }
    }
    
    stages {
        stage('Build') {
            steps {
                container('maven') {
                    sh 'mvn clean package'
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                container('docker') {
                    sh 'docker build -t myapp:${BUILD_NUMBER} .'
                    sh 'docker push registry.example.com/myapp:${BUILD_NUMBER}'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl set image deployment/myapp \
                            myapp=registry.example.com/myapp:${BUILD_NUMBER} \
                            -n production
                    '''
                }
            }
        }
    }
}
```

### Dynamic Kubernetes Agent

```groovy
def label = "jenkins-agent-${UUID.randomUUID().toString()}"

podTemplate(
    label: label,
    containers: [
        containerTemplate(
            name: 'node',
            image: 'node:18',
            ttyEnabled: true,
            command: 'cat'
        ),
        containerTemplate(
            name: 'docker',
            image: 'docker:latest',
            ttyEnabled: true,
            command: 'cat'
        )
    ],
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
    ]
) {
    node(label) {
        stage('Checkout') {
            checkout scm
        }
        
        stage('Build') {
            container('node') {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Docker') {
            container('docker') {
                sh 'docker build -t myapp .'
            }
        }
    }
}
```

---

## Plugins & Ecosystem

### Essential Plugins

**Git & SCM:**

- Git Plugin
- GitHub Plugin
- GitLab Plugin
- Bitbucket Plugin

**Build Tools:**

- Maven Integration Plugin
- Gradle Plugin
- NodeJS Plugin
- Pipeline Plugin

**Containers:**

- Docker Plugin
- Docker Pipeline
- Kubernetes Plugin
- Kubernetes CLI Plugin

**Testing:**

- JUnit Plugin
- Cobertura Plugin
- HTML Publisher

**Deployment:**

- SSH Plugin
- Publish Over SSH
- Deploy Plugin
- Ansible Plugin

**Notifications:**

- Email Extension Plugin
- Slack Notification Plugin
- Mailer Plugin

**Security:**

- Credentials Plugin
- Role-based Authorization Strategy
- OWASP Dependency-Check Plugin

### Installing Plugins

**Via Web UI:**

1. Manage Jenkins → Plugins → Available plugins
2. Search for plugin
3. Select and click "Install"

**Via Jenkins CLI:**

```bash
java -jar jenkins-cli.jar -s http://jenkins.example.com:8080/ \
    -auth admin:admin \
    install-plugin docker-plugin kubernetes
```

**Via Configuration as Code:**

```yaml
jenkins:
  plugins:
    - git:latest
    - docker-plugin:latest
    - kubernetes:latest
    - slack:latest
```

---

## Security & Authentication

### Enable Security

**Navigate to:** Manage Jenkins → Security

### Authentication

**LDAP:**

```yaml
Security Realm: LDAP
Server: ldap://ldap.example.com
Root DN: dc=example,dc=com
User search base: ou=users
User search filter: uid={0}
Group search base: ou=groups
```

**GitHub OAuth:**

```yaml
Security Realm: GitHub Authentication Plugin
GitHub Web URI: https://github.com
GitHub API URI: https://api.github.com
Client ID: <your-client-id>
Client Secret: <your-client-secret>
OAuth Scope: read:org,user:email
```

**SAML:**

```yaml
Security Realm: SAML 2.0
IdP Metadata: <paste XML>
Username Attribute: username
Email Attribute: email
```

### Authorization

**Matrix-based Security:**

```yaml
Authorization: Matrix-based security

Users:
  admin:
    - Overall/Administer
  
  developer:
    - Overall/Read
    - Job/Build
    - Job/Read
    - Job/Workspace
  
  viewer:
    - Overall/Read
    - Job/Read
```

**Role-based Strategy:**

```yaml
Authorization: Role-Based Strategy

Global Roles:
  - admin: Administer
  - developer: Overall/Read, Job/*
  - viewer: Overall/Read, Job/Read

Project Roles:
  - project-a-developer:
      Pattern: project-a-.*
      Permissions: Job/Build, Job/Configure
```

### Agent Security

**Enable agent-to-master security:**

```yaml
Manage Jenkins → Security → Agents

Agent → Master Security:
  Enable: Yes
  TCP port for inbound agents: 50000
  Protocols: JNLP4-connect
```

### Credentials Security

**Best practices:**

- Use Jenkins Credentials Store
- Rotate credentials regularly
- Use HashiCorp Vault integration
- Never hardcode credentials

---

## Monitoring & Maintenance

### Monitoring Plugins

**Install monitoring plugins:**

1. Monitoring Plugin
2. Prometheus Metrics Plugin
3. Build Monitor Plugin

### Prometheus Integration

**Install plugin:**
Manage Jenkins → Plugins → Prometheus metrics plugin

**Access metrics:**

```
http://jenkins.example.com:8080/prometheus/
```

**Prometheus scrape config:**

```yaml
scrape_configs:
  - job_name: 'jenkins'
    metrics_path: '/prometheus'
    static_configs:
      - targets: ['jenkins.example.com:8080']
```

### Backup Jenkins

**Backup script:**

```bash
#!/bin/bash

JENKINS_HOME=/var/lib/jenkins
BACKUP_DIR=/backup/jenkins
DATE=$(date +%Y%m%d-%H%M%S)

# Stop Jenkins
systemctl stop jenkins

# Create backup
tar -czf ${BACKUP_DIR}/jenkins-backup-${DATE}.tar.gz \
    ${JENKINS_HOME}/config.xml \
    ${JENKINS_HOME}/jobs/ \
    ${JENKINS_HOME}/users/ \
    ${JENKINS_HOME}/secrets/ \
    ${JENKINS_HOME}/credentials.xml \
    ${JENKINS_HOME}/plugins/

# Start Jenkins
systemctl start jenkins

# Keep only last 30 backups
find ${BACKUP_DIR} -name "jenkins-backup-*.tar.gz" -mtime +30 -delete
```

### Disk Space Management

**Configure disk space:**

```groovy
// In Pipeline
options {
    buildDiscarder(logRotator(
        numToKeepStr: '30',
        daysToKeepStr: '90',
        artifactNumToKeepStr: '10'
    ))
}
```

**Clean workspace:**

```bash
# Manual cleanup
cd /var/lib/jenkins/workspace
rm -rf */

# Scheduled cleanup (add to cron)
0 2 * * * find /var/lib/jenkins/workspace -type d -mtime +7 -exec rm -rf {} \;
```

---

## Best Practices

### 1. Use Declarative Pipeline

Prefer declarative over scripted for better readability:

```groovy
// ✅ Good
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}

// ❌ Avoid unless necessary
node {
    stage('Build') {
        sh 'npm run build'
    }
}
```

### 2. Use Shared Libraries

Avoid code duplication:

```groovy
@Library('my-shared-library') _

buildAndDeploy(
    app: 'myapp',
    environment: 'production'
)
```

### 3. Use Multibranch Pipelines

Automatically build all branches:

```yaml
Job Type: Multibranch Pipeline
Branch Source: GitHub
Scan interval: 1 hour
```

### 4. Implement Parallel Stages

Speed up builds with parallel execution:

```groovy
stage('Test') {
    parallel {
        stage('Unit') { /* ... */ }
        stage('Integration') { /* ... */ }
        stage('E2E') { /* ... */ }
    }
}
```

### 5. Use Docker Agents

Ensure consistent build environments:

```groovy
agent {
    docker {
        image 'node:18'
        args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
}
```

### 6. Implement Proper Error Handling

```groovy
post {
    failure {
        emailext(
            to: 'team@example.com',
            subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: "Check console output at ${env.BUILD_URL}"
        )
    }
}
```

### 7. Use Credentials Properly

Never hardcode credentials:

```groovy
// ✅ Good
withCredentials([string(credentialsId: 'api-key', variable: 'API_KEY')]) {
    sh 'curl -H "Authorization: Bearer $API_KEY" ...'
}

// ❌ Bad
sh 'curl -H "Authorization: Bearer abc123" ...'
```

### 8. Implement Health Checks

```groovy
stage('Deploy') {
    steps {
        sh './deploy.sh'
        sh '''
            for i in {1..30}; do
                if curl -f http://app.example.com/health; then
                    exit 0
                fi
                sleep 10
            done
            exit 1
        '''
    }
}
```

### 9. Archive Artifacts Selectively

Only archive what you need:

```groovy
// ✅ Good
archiveArtifacts artifacts: 'dist/*.jar', fingerprint: true

// ❌ Bad (too broad)
archiveArtifacts artifacts: '**/*'
```

### 10. Use Pipeline Timeouts

Prevent hanging builds:

```groovy
options {
    timeout(time: 1, unit: 'HOURS')
}
```

---

## Troubleshooting

### Build Stuck in Queue

**Check:**

- Available executors
- Node labels
- Agent connectivity

**Solution:**

```bash
# Check agents
curl -u admin:admin http://jenkins.example.com:8080/computer/api/json

# Restart agent
ssh agent-host 'systemctl restart jenkins-agent'
```

### Out of Memory

**Increase JVM memory:**

```bash
# Edit /etc/default/jenkins
JAVA_ARGS="-Xmx4096m -XX:MaxMetaspaceSize=512m"

# Restart Jenkins
systemctl restart jenkins
```

### Plugin Issues

**Safe restart:**

```bash
# Restart without loading plugins
http://jenkins.example.com:8080/safeRestart
```

**Disable plugin:**

```bash
cd /var/lib/jenkins/plugins
mv problematic-plugin.jpi problematic-plugin.jpi.disabled
systemctl restart jenkins
```

### Workspace Corruption

**Clean workspace:**

```groovy
stage('Clean') {
    steps {
        cleanWs()
    }
}
```

**Manual cleanup:**

```bash
rm -rf /var/lib/jenkins/workspace/job-name
```

### Agent Connection Issues

**Check logs:**

```bash
# On agent
tail -f /var/log/jenkins/agent.log

# On master
tail -f /var/log/jenkins/jenkins.log
```

**Reconnect agent:**

```bash
# Via CLI
java -jar jenkins-cli.jar -s http://jenkins:8080 \
    -auth admin:admin \
    connect-node agent-name
```

---

## Example Pipelines

### Node.js Application

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }
    
    environment {
        npm_config_cache = 'npm-cache'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Docker') {
            steps {
                script {
                    def app = docker.build("myapp:${env.BUILD_NUMBER}")
                    docker.withRegistry('https://registry.example.com', 'docker-credentials') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    kubectl set image deployment/myapp \
                        myapp=registry.example.com/myapp:${BUILD_NUMBER} \
                        -n production
                '''
            }
        }
    }
    
    post {
        always {
            junit '**/test-results/*.xml'
            publishHTML(target: [
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
        success {
            slackSend(color: 'good', message: "Build ${env.BUILD_NUMBER} succeeded")
        }
        failure {
            slackSend(color: 'danger', message: "Build ${env.BUILD_NUMBER} failed")
        }
    }
}
```

### Java Spring Boot Application

```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven 3.9'
        jdk 'JDK 17'
    }
    
    environment {
        DOCKER_REGISTRY = 'registry.example.com'
        APP_NAME = 'spring-boot-app'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'mvn test'
                    }
                    post {
                        always {
                            junit '**/target/surefire-reports/*.xml'
                        }
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'mvn verify -DskipUnitTests'
                    }
                }
            }
        }
        
        stage('Code Quality') {
            steps {
                sh '''
                    mvn sonar:sonar \
                        -Dsonar.projectKey=${APP_NAME} \
                        -Dsonar.host.url=http://sonarqube:9000 \
                        -Dsonar.login=${SONAR_TOKEN}
                '''
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    def app = docker.build("${DOCKER_REGISTRY}/${APP_NAME}:${env.BUILD_NUMBER}")
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        app.push()
                        app.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Dev') {
            steps {
                sh '''
                    kubectl set image deployment/${APP_NAME} \
                        ${APP_NAME}=${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER} \
                        -n development
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                
                sh '''
                    kubectl set image deployment/${APP_NAME} \
                        ${APP_NAME}=${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER} \
                        -n production
                    
                    kubectl rollout status deployment/${APP_NAME} -n production
                '''
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            cleanWs()
        }
    }
}
```

### Python Flask Application

```groovy
pipeline {
    agent {
        docker {
            image 'python:3.11'
        }
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                sh '''
                    python -m venv venv
                    . venv/bin/activate
                    pip install -r requirements.txt
                    pip install pytest pytest-cov flake8
                '''
            }
        }
        
        stage('Lint') {
            steps {
                sh '''
                    . venv/bin/activate
                    flake8 app/ --max-line-length=120
                '''
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    . venv/bin/activate
                    pytest tests/ --cov=app --cov-report=xml --cov-report=html
                '''
            }
            post {
                always {
                    junit 'test-results/*.xml'
                    publishHTML(target: [
                        reportDir: 'htmlcov',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                sh '''
                    docker build -t myapp/flask:${BUILD_NUMBER} .
                    docker push registry.example.com/myapp/flask:${BUILD_NUMBER}
                '''
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    kubectl set image deployment/flask-app \
                        flask-app=registry.example.com/myapp/flask:${BUILD_NUMBER} \
                        -n production
                '''
            }
        }
    }
}
```

---

## Resources

- **Official Documentation:** [https://www.jenkins.io/doc/](https://www.jenkins.io/doc/)
- **Pipeline Syntax:** [https://www.jenkins.io/doc/book/pipeline/syntax/](https://www.jenkins.io/doc/book/pipeline/syntax/)
- **Plugin Index:** [https://plugins.jenkins.io/](https://plugins.jenkins.io/)
- **Community:** [https://community.jenkins.io/](https://community.jenkins.io/)
- **GitHub:** [https://github.com/jenkinsci/jenkins](https://github.com/jenkinsci/jenkins)
- **Tutorials:** [https://www.jenkins.io/doc/tutorials/](https://www.jenkins.io/doc/tutorials/)

---

**Note:** Jenkins is open-source and free to use. Enterprise support is available through CloudBees.
