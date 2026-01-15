---
title: 🎋 Atlassian Bamboo CI/CD
---

# Atlassian Bamboo CI/CD

Atlassian Bamboo is a continuous integration and deployment server that seamlessly integrates with other Atlassian products like Jira, Bitbucket, and Confluence. This guide covers the complete setup and usage of Bamboo for CI/CD workflows.

---

## Table of Contents

1. [Introduction & Overview](#introduction--overview)
2. [Architecture & Concepts](#architecture--concepts)
3. [Installation & Setup](#installation--setup)
4. [Bamboo Server Configuration](#bamboo-server-configuration)
5. [Remote Agents](#remote-agents)
6. [Plans & Jobs](#plans--jobs)
7. [Tasks & Scripts](#tasks--scripts)
8. [Deployment Projects](#deployment-projects)
9. [Build Artifacts](#build-artifacts)
10. [Docker Integration](#docker-integration)
11. [Atlassian Integration](#atlassian-integration)
12. [Branches & Triggers](#branches--triggers)
13. [Notifications](#notifications)
14. [Bamboo Specs (Configuration as Code)](#bamboo-specs-configuration-as-code)
15. [Best Practices](#best-practices)
16. [Troubleshooting](#troubleshooting)
17. [Example Configurations](#example-configurations)

---

## Introduction & Overview

### What is Bamboo?

Atlassian Bamboo is a CI/CD server that provides:

- **Continuous Integration:** Automated builds and tests
- **Continuous Deployment:** Automated releases to multiple environments
- **Integration:** Seamless integration with Jira, Bitbucket, Confluence
- **Scalability:** Support for remote agents and elastic instances
- **Flexibility:** Support for multiple languages and platforms

### Bamboo vs Other CI/CD Tools

| Feature | Bamboo | Jenkins | GitLab CI/CD | GitHub Actions |
|---------|--------|---------|--------------|----------------|
| **Pricing** | Commercial (Free trial) | Free/Open Source | Free/Premium | Free/Usage-based |
| **Integration** | Deep Atlassian integration | Plugin-based | Native Git | Native GitHub |
| **Configuration** | UI + Bamboo Specs | Jenkinsfile | .gitlab-ci.yml | Workflows YAML |
| **Agents** | Managed + Remote | Nodes | Runners | Runners |
| **Deployment** | Built-in deployment projects | Via plugins | Built-in | Built-in |

### Key Concepts

- **Plan:** Complete build workflow (equivalent to pipeline)
- **Stage:** Group of jobs that run sequentially
- **Job:** Set of tasks that run on a single agent
- **Task:** Individual build step (compile, test, deploy)
- **Deployment Project:** Manages releases to environments
- **Environment:** Target for deployments (dev, staging, prod)
- **Agent:** Machine that executes build jobs
- **Artifact:** Output from build (JAR, WAR, Docker image)

### Typical Workflow

```text
Code Push → Bitbucket
    ↓
Bamboo Plan Triggered
    ↓
Stage 1: Build
    ├── Job 1: Compile & Test
    └── Job 2: Static Analysis
    ↓
Stage 2: Package
    └── Job: Create Artifacts
    ↓
Deployment Project
    ├── Environment: Development (Auto)
    ├── Environment: Staging (Auto)
    └── Environment: Production (Manual approval)
```

---

## Architecture & Concepts

### Bamboo Architecture

```text
Bamboo Server (Master)
├── Web UI (Port 8085)
├── Build Coordination
├── Artifact Storage
└── Database (PostgreSQL/MySQL)
    ↓
Remote Agents
├── Agent 1 (Linux)
├── Agent 2 (Windows)
└── Agent 3 (macOS)
    ↓
Elastic Agents (AWS/Docker)
├── On-demand instances
└── Auto-scaling
```

### Plan Structure

```text
Plan: MyApp-CI
├── Stage 1: Build
│   ├── Job: Compile
│   │   ├── Task: Source Code Checkout
│   │   ├── Task: Maven Build
│   │   └── Task: JUnit Parser
│   └── Job: Code Quality
│       ├── Task: Source Code Checkout
│       └── Task: SonarQube Scanner
├── Stage 2: Test
│   └── Job: Integration Tests
│       ├── Task: Source Code Checkout
│       ├── Task: Maven Integration Test
│       └── Task: Publish Test Results
└── Stage 3: Package
    └── Job: Create Artifact
        ├── Task: Source Code Checkout
        ├── Task: Maven Package
        └── Task: Create Build Artifact
```

### Deployment Project Structure

```text
Deployment Project: MyApp-Deploy
├── Environment: Development
│   ├── Task: Download Artifact
│   ├── Task: Deploy to Dev Server
│   └── Task: Smoke Test
├── Environment: Staging
│   ├── Task: Download Artifact
│   ├── Task: Deploy to Staging
│   ├── Task: Integration Tests
│   └── Approval Gate
└── Environment: Production
    ├── Manual Trigger Required
    ├── Task: Download Artifact
    ├── Task: Blue/Green Deployment
    └── Task: Health Check
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
- Disk: 50+ GB (with artifacts)
- Java: JDK 17

### Installation on Linux

**1. Download Bamboo:**

```bash
# Download latest version
wget https://www.atlassian.com/software/bamboo/downloads/binary/atlassian-bamboo-9.2.7.tar.gz

# Extract
tar -xzf atlassian-bamboo-9.2.7.tar.gz
cd atlassian-bamboo-9.2.7
```

**2. Configure Bamboo Home:**

```bash
# Create Bamboo home directory
sudo mkdir -p /var/atlassian/application-data/bamboo
sudo chown -R bamboo:bamboo /var/atlassian/application-data/bamboo

# Set Bamboo home in bamboo-init.properties
echo "bamboo.home=/var/atlassian/application-data/bamboo" > atlassian-bamboo/WEB-INF/classes/bamboo-init.properties
```

**3. Configure Database (PostgreSQL):**

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql

CREATE DATABASE bamboo;
CREATE USER bamboouser WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE bamboo TO bamboouser;
\q
```

**4. Start Bamboo:**

```bash
# Start Bamboo server
./bin/start-bamboo.sh

# Check logs
tail -f logs/catalina.out
```

**5. Access Web Interface:**

Navigate to `http://localhost:8085` and complete setup wizard:

1. Choose language
2. Select installation type (Express or Custom)
3. Configure database connection
4. Enter license key
5. Create admin account

### Installation with Docker

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  bamboo:
    image: atlassian/bamboo-server:9.2
    container_name: bamboo
    ports:
      - "8085:8085"
      - "54663:54663"  # Agent port
    environment:
      - ATL_BAMBOO_SKIP_HOME_SETUP=false
      - ATL_DB_TYPE=postgresql
      - ATL_DB_DRIVER=org.postgresql.Driver
      - ATL_JDBC_URL=jdbc:postgresql://postgres:5432/bamboo
      - ATL_JDBC_USER=bamboouser
      - ATL_JDBC_PASSWORD=secure_password
    volumes:
      - bamboo-data:/var/atlassian/application-data/bamboo
    depends_on:
      - postgres
    networks:
      - bamboo-network

  postgres:
    image: postgres:14
    container_name: bamboo-db
    environment:
      - POSTGRES_DB=bamboo
      - POSTGRES_USER=bamboouser
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - bamboo-network

volumes:
  bamboo-data:
  postgres-data:

networks:
  bamboo-network:
    driver: bridge
```

**Start Bamboo:**

```bash
docker-compose up -d
```

### Installation on Windows

**1. Download Windows installer:**

- Visit [Atlassian Bamboo Downloads](https://www.atlassian.com/software/bamboo/download)
- Download Windows installer (`.exe`)

**2. Run installer:**

- Follow installation wizard
- Choose installation directory
- Configure Windows service
- Set Bamboo home directory

**3. Configure database:**

- Install PostgreSQL or use existing database
- Configure connection during setup wizard

**4. Start service:**

```powershell
# Start Bamboo service
net start Bamboo

# Check status
Get-Service Bamboo
```

---

## Bamboo Server Configuration

### Global Settings

**Navigate to:** ⚙️ → System → Configuration

**Server Base URL:**

```text
http://bamboo.example.com:8085
```

**Build Working Directory:**

```text
/var/atlassian/application-data/bamboo/xml-data/build-dir
```

**Artifact Storage:**

```text
/var/atlassian/application-data/bamboo/artifacts
```

### User Management

**Create Users:**

1. ⚙️ → User Management → Create User
2. Set username, email, password
3. Assign to groups

**Groups & Permissions:**

- **bamboo-admin:** Full administrative access
- **bamboo-user:** Create and configure plans
- **bamboo-developer:** View builds and logs

### Linked Repositories

**Connect to Bitbucket:**

1. ⚙️ → Linked Repositories → Add Repository
2. Repository Type: **Bitbucket Server/Cloud**
3. Name: `MyApp-Repo`
4. Repository URL: `https://bitbucket.org/myorg/myapp`
5. Authentication: OAuth, SSH, or App Password
6. Advanced Options:
   - Branch detection: Enabled
   - Exclude branches: `feature/*` (optional)

**Connect to GitHub:**

1. Add Repository → Type: **Git**
2. Repository URL: `https://github.com/myorg/myapp.git`
3. Authentication: Personal Access Token
4. Enable branch detection

### Capabilities

Define build capabilities (tools available on agents):

1. ⚙️ → Build Resources → Server Capabilities
2. Add Capabilities:
   - **JDK:** `/usr/lib/jvm/java-17-openjdk`
   - **Maven:** `/usr/local/maven`
   - **Node.js:** `/usr/local/bin/node`
   - **Docker:** `/usr/bin/docker`

### Executables

Define executable paths:

1. ⚙️ → Executables → Add Executable
2. Examples:
   - **Maven 3.9:** `/usr/local/maven/bin/mvn`
   - **Node.js 18:** `/usr/local/bin/node`
   - **Python 3.11:** `/usr/bin/python3`
   - **Docker:** `/usr/bin/docker`

---

## Remote Agents

### What are Remote Agents?

Remote agents are separate machines that execute build jobs, offloading work from the Bamboo server.

### Installing Remote Agent

**1. Download Agent JAR:**

From Bamboo UI:

- ⚙️ → Build Resources → Agents → Install Remote Agent
- Download `atlassian-bamboo-agent-installer-X.X.X.jar`

**2. Install Agent (Linux):**

```bash
# Create agent directory
sudo mkdir -p /opt/bamboo-agent
cd /opt/bamboo-agent

# Copy agent JAR
sudo cp ~/atlassian-bamboo-agent-installer-9.2.7.jar .

# Run installer
java -jar atlassian-bamboo-agent-installer-9.2.7.jar http://bamboo.example.com:8085/agentServer/

# This creates agent home directory
# Follow prompts to configure agent
```

**3. Configure Agent:**

Edit `bamboo-agent.cfg.xml`:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<configuration>
  <buildWorkingDirectory>/opt/bamboo-agent/bamboo-agent-home/xml-data/build-dir</buildWorkingDirectory>
  <agentUuid>YOUR-AGENT-UUID</agentUuid>
  <agentDefinition>
    <name>Linux-Agent-01</name>
    <description>Ubuntu 22.04 Build Agent</description>
  </agentDefinition>
</configuration>
```

**4. Start Agent:**

```bash
# Start agent
cd /opt/bamboo-agent/bin
./bamboo-agent.sh start

# Check logs
tail -f /opt/bamboo-agent/bamboo-agent.out.log
```

**5. Approve Agent in Bamboo UI:**

1. ⚙️ → Build Resources → Agents
2. Find new agent (will be in "Waiting for approval" status)
3. Click **Approve**

### Agent as System Service (Linux)

**Create systemd service:**

```bash
sudo nano /etc/systemd/system/bamboo-agent.service
```

**Service file:**

```ini
[Unit]
Description=Bamboo Remote Agent
After=network.target

[Service]
Type=forking
User=bamboo
Group=bamboo
WorkingDirectory=/opt/bamboo-agent
ExecStart=/opt/bamboo-agent/bin/bamboo-agent.sh start
ExecStop=/opt/bamboo-agent/bin/bamboo-agent.sh stop
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Enable and start:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable bamboo-agent
sudo systemctl start bamboo-agent
sudo systemctl status bamboo-agent
```

### Agent Capabilities

Configure agent-specific capabilities:

1. ⚙️ → Build Resources → Agents → Select Agent
2. Click **Add Capability**
3. Add executable paths specific to this agent:
   - **JDK 17:** `/usr/lib/jvm/java-17-openjdk`
   - **Maven:** `/usr/local/maven`
   - **Docker:** `/usr/bin/docker`

### Elastic Agents (AWS)

Configure elastic agents for auto-scaling:

1. ⚙️ → Elastic Bamboo → AWS Configuration
2. Add AWS credentials
3. Define elastic instance configuration:
   - AMI ID
   - Instance type (t3.medium)
   - Security groups
   - Subnet
4. Set scaling rules:
   - Min instances: 0
   - Max instances: 5
   - Scale up: When queue > 2
   - Scale down: After 10 minutes idle

---

## Plans & Jobs

### Creating a Plan

**1. Navigate to Create → Create Plan**

**2. Configure Plan:**

- **Project:** MyProject
- **Plan name:** MyApp Build
- **Plan key:** MB (auto-generated)
- **Repository:** Select linked repository
- **Branch:** main

**3. Configure Default Job:**

- **Job name:** Compile and Test
- **Job key:** CT

**4. Add Tasks to Job:**

Click **Add Task** and select task types.

### Plan Configuration

**General Configuration:**

```yaml
Project: MyProject
Plan: MyApp Build
Key: MYPROJECT-MB
Description: Build and test MyApp

Repository:
  Name: myapp-repo
  Branch: main
  
Build Strategy:
  Default working directory: MYPROJECT-MB
  Clean build: false
```

### Adding Tasks to Jobs

**Task Types:**

1. **Source Code Checkout:** Clone repository
2. **Script:** Execute shell/batch scripts
3. **Command:** Run system commands
4. **Maven:** Run Maven goals
5. **npm:** Run npm commands
6. **Docker:** Build/push Docker images
7. **SonarQube:** Code quality analysis
8. **JUnit Parser:** Parse test results
9. **Artifact Download:** Download artifacts from previous builds
10. **Inject Variables:** Set environment variables

### Example: Maven Build Job

**Job Configuration:**

```yaml
Job: Maven Build
Key: BUILD

Tasks:
  1. Source Code Checkout
     - Repository: myapp-repo
     - Checkout Directory: default
  
  2. Maven 3.x
     - Goal: clean install
     - Build JDK: JDK 17
     - Maven opts: -DskipTests=false
     - Working sub directory: (empty)
  
  3. JUnit Parser
     - Test results: **/target/surefire-reports/*.xml
  
  4. Maven 3.x
     - Goal: package
     - Build JDK: JDK 17
     - Maven opts: -DskipTests=true
  
  5. Artifact Definition
     - Name: application-jar
     - Location: target/
     - Copy pattern: *.jar
     - Shared: Yes
```

### Stages

**Add Stage:**

1. Plan → Actions → Configure Plan
2. Stages tab → Add Stage
3. Stage name: Integration Tests
4. Add jobs to stage

**Stage Configuration:**

```yaml
Stage 1: Build
  - Job: Compile
  - Job: Unit Tests
  (Jobs run in parallel)

Stage 2: Package
  - Job: Create WAR
  (Runs after Stage 1 completes)

Stage 3: Deploy to Dev
  - Job: Deploy Application
  (Runs after Stage 2 completes)
```

### Requirements

Specify agent requirements for jobs:

1. Job → Requirements tab → Add Requirement
2. Examples:
   - **JDK:** Matches `1.17.*`
   - **Operating System:** Linux
   - **Docker:** Exists
   - **Custom Capability:** `maven.version >= 3.8`

---

## Tasks & Scripts

### Script Task

**Inline Script:**

```bash
#!/bin/bash
set -e

echo "Running custom build script..."

# Install dependencies
npm ci

# Run linter
npm run lint

# Run tests
npm test

# Build application
npm run build

echo "Build completed successfully"
```

**Script Task Configuration:**

```yaml
Task: Script
Interpreter: Shell
Script location: Inline
Script body: |
  #!/bin/bash
  set -e
  npm ci
  npm run build
```

### Command Task

**Execute system command:**

```yaml
Task: Command
Executable: node
Argument: --version

Working sub directory: (empty)
Environment variables:
  NODE_ENV: production
  API_URL: https://api.example.com
```

### Maven Task

**Maven build:**

```yaml
Task: Maven 3.x
Goal: clean package
Build JDK: JDK 17
Maven Executable: Maven 3.9
Project file: pom.xml
Additional Maven parameters: -DskipTests=false -Dmaven.test.failure.ignore=true
Working sub directory: (empty)
```

### npm Task

**npm install and build:**

```yaml
Task 1: npm
Command: install
Node.js executable: Node.js 18

Task 2: npm
Command: run
Arguments: build
Node.js executable: Node.js 18
Environment variables:
  NODE_ENV: production
```

### Docker Task

**Build and push Docker image:**

```yaml
Task 1: Docker
Command: Build a Docker image
Docker image: myapp:${bamboo.buildNumber}
Dockerfile: Dockerfile
Additional arguments: --no-cache

Task 2: Docker
Command: Push a Docker image to repository
Docker image: myregistry/myapp:${bamboo.buildNumber}
Docker registry URL: https://registry.example.com
Username: ${bamboo.docker.username}
Password: ${bamboo.docker.password}
```

### SonarQube Task

**Code quality analysis:**

```yaml
Task: SonarQube Scanner
SonarQube server: SonarQube Server
Project key: myapp
Project name: MyApp
Project version: ${bamboo.buildNumber}
Sources: src/
Additional properties:
  sonar.java.binaries=target/classes
  sonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
```

### Conditional Tasks

**Execute task based on conditions:**

```yaml
Task: Script
Script body: |
  echo "Deploying to production..."
  
Conditions:
  - Variable condition:
      Variable: bamboo.planRepository.branchName
      Matches: main
  
  - Variable condition:
      Variable: bamboo.deploy.environment
      Equals: production
```

---

## Deployment Projects

### Creating a Deployment Project

**1. Create → Create Deployment Project**

**2. Configure:**

- **Name:** MyApp Deployment
- **Link to build plan:** MYPROJECT-MB
- **Choose build to deploy:** Latest successful build

**3. Add Environment:**

- **Name:** Development
- **Description:** Development environment
- **Trigger:** Automatic deployment after successful build

### Environment Configuration

**Environment: Development**

```yaml
Name: Development
Description: Auto-deploy to dev servers

Tasks:
  1. Clean working directory
  
  2. Artifact Download
     - Artifact: application-jar
     - Destination: app/
  
  3. SCP Task
     - Host: dev-server.example.com
     - Username: deployer
     - Private key: ${bamboo.ssh.key}
     - Local file: app/*.jar
     - Remote path: /opt/myapp/
  
  4. SSH Task
     - Host: dev-server.example.com
     - Command: |
         systemctl restart myapp
         sleep 5
         systemctl status myapp
  
  5. Script
     - Smoke test:
         curl -f http://dev-server.example.com:8080/health || exit 1

Triggers:
  - After successful build plan: Enabled
  - Branch: main only

Permissions:
  - Developers: View, Build
  - Admins: View, Build, Edit, Deploy
```

**Environment: Staging**

```yaml
Name: Staging
Description: Manual deploy to staging

Tasks:
  1. Artifact Download
  2. Deploy to staging servers
  3. Run integration tests
  4. Generate deployment report

Triggers:
  - Manual trigger only
  - Requires approval from: QA Team

Requirements:
  - Previous environment (Development) must be successful
```

**Environment: Production**

```yaml
Name: Production
Description: Production deployment with approval

Tasks:
  1. Artifact Download
  2. Blue/Green deployment script
  3. Health check
  4. Notify stakeholders

Triggers:
  - Manual trigger only
  - Requires approval from: Release Manager, DevOps Lead

Rollback:
  - Automatic rollback on failure
  - Keep previous 3 releases
```

### Deployment Tasks

**SCP Task (File Transfer):**

```yaml
Task: SCP
Host: ${bamboo.deploy.server}
Port: 22
Username: deployer
Authentication: Private key
Private key: ${bamboo.ssh.private.key}
Passphrase: ${bamboo.ssh.passphrase}

Local file path: app/myapp.jar
Remote path: /opt/myapp/releases/${bamboo.deploy.release}/
```

**SSH Task (Remote Command):**

```yaml
Task: SSH
Host: ${bamboo.deploy.server}
Username: deployer
Authentication: Private key

Command: |
  cd /opt/myapp
  ln -sfn releases/${bamboo.deploy.release} current
  systemctl restart myapp
  sleep 10
  curl -f http://localhost:8080/health || exit 1
```

### Deployment Variables

**Environment Variables:**

```yaml
Global Variables:
  deploy.server.dev: dev01.example.com
  deploy.server.staging: staging01.example.com
  deploy.server.prod: prod01.example.com,prod02.example.com
  
Environment Variables (Development):
  deploy.server: ${deploy.server.dev}
  app.env: development
  db.url: jdbc:postgresql://dev-db:5432/myapp
  
Environment Variables (Production):
  deploy.server: ${deploy.server.prod}
  app.env: production
  db.url: ${bamboo.db.prod.url}  # Encrypted variable
```

### Release Versioning

**Automatic versioning:**

```yaml
Release naming:
  Name pattern: release-${bamboo.buildNumber}
  Version: ${bamboo.deploy.version}
  
Example: release-42
```

**Semantic versioning:**

```yaml
Release naming:
  Name pattern: v${bamboo.major}.${bamboo.minor}.${bamboo.buildNumber}
  
Example: v1.2.42
```

---

## Build Artifacts

### Creating Artifacts

**Artifact Definition:**

```yaml
Job: Build
Artifacts:
  - Name: application-jar
    Location: target/
    Copy pattern: *.jar
    Shared: Yes  # Available to other plans/deployments
  
  - Name: test-reports
    Location: target/surefire-reports/
    Copy pattern: **/*
    Shared: No
  
  - Name: docker-image-tag
    Location: .
    Copy pattern: image-tag.txt
    Shared: Yes
```

### Artifact Dependencies

**Download artifact from another plan:**

```yaml
Job: Integration Tests
Tasks:
  1. Artifact Download
     - Plan: MYPROJECT-MB
     - Artifact: application-jar
     - Destination: app/
  
  2. Script
     - Start application and run tests
```

### Artifact Storage

**Configure artifact retention:**

1. Plan → Actions → Configure Plan
2. Miscellaneous tab → Artifacts
3. Artifact retention:
   - Keep artifacts for: 90 days
   - Keep artifacts for at least: 10 builds
   - Keep artifacts from successful builds only: Yes

### Shared Artifacts

**Share artifacts between plans:**

```yaml
Plan A (Build):
  Job: Build
  Artifact: application-jar (Shared: Yes)

Plan B (Integration Tests):
  Job: Test
  Artifact Dependency: 
    - Plan: Plan A
    - Artifact: application-jar
```

---

## Docker Integration

### Docker Build Task

**Build Docker image:**

```yaml
Task: Docker
Command: Build a Docker image
Repository: myregistry/myapp
Tag: ${bamboo.buildNumber}
Dockerfile location: Dockerfile
Use an existing Dockerfile: Yes
Additional arguments: --no-cache --build-arg VERSION=${bamboo.buildNumber}
```

### Docker Push Task

**Push to registry:**

```yaml
Task: Docker
Command: Push a Docker image to repository
Repository: myregistry/myapp
Tag: ${bamboo.buildNumber}
Docker registry URL: https://registry.example.com
Authenticate with Docker registry: Yes
Username: ${bamboo.docker.username}
Password: ${bamboo.docker.password}
```

### Docker Run Task

**Run container for testing:**

```yaml
Task: Docker
Command: Run a Docker container
Image: myregistry/myapp:${bamboo.buildNumber}
Container name: myapp-test
Detach container: Yes
Port mappings: 8080:8080
Environment variables:
  NODE_ENV: test
  DATABASE_URL: postgresql://test-db:5432/test
Additional arguments: --rm
```

### Multi-Stage Docker Build

**Dockerfile:**

```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

**Build task:**

```yaml
Task: Docker
Command: Build a Docker image
Repository: myapp
Tag: ${bamboo.buildNumber}
Dockerfile: Dockerfile
```

### Docker Compose

**Run integration tests with Docker Compose:**

```yaml
Task 1: Script
Script body: |
  docker-compose up -d
  sleep 10
  docker-compose ps

Task 2: Script (Run tests)
Script body: |
  npm run test:integration

Task 3: Script (Cleanup)
Always execute: Yes
Script body: |
  docker-compose down -v
```

---

## Atlassian Integration

### Jira Integration

**Configure Jira integration:**

1. ⚙️ → Application Links → Add Application Link
2. Server URL: `https://jira.example.com`
3. Authenticate with Jira
4. Enable two-way authentication

**Link Jira issues to builds:**

**Commit message:**

```text
PROJ-123 Implement new feature

- Added user authentication
- Updated API endpoints
```

**Bamboo automatically:**

- Links build to PROJ-123
- Updates Jira issue with build status
- Shows deployment information in Jira

**Jira Release Management:**

```yaml
Deployment Environment: Production
Link to Jira:
  - Project: PROJ
  - Version: 2.5.0
  - Create version if not exists: Yes
  - Mark version as released: Yes after successful deployment
```

### Bitbucket Integration

**Configure Bitbucket integration:**

1. Plan → Actions → Configure Plan
2. Repositories tab → Add Repository
3. Select Bitbucket repository
4. Enable branch detection

**Build strategies:**

```yaml
Branch Detection:
  Create plan branches: For pull requests
  Delete plan branches: After pull request merge
  Clean up: After 7 days of inactivity

Pull Request Triggers:
  Build: On new pull request
  Build: On pull request update
  Merge strategy: Merge commit
```

**Bitbucket build status:**

Bamboo automatically:

- Updates PR with build status (✅/❌)
- Comments on PR with build results
- Blocks merge if build fails (configurable)

### Confluence Integration

**Publish build reports to Confluence:**

```yaml
Task: Confluence Publisher
Confluence Server: confluence.example.com
Space: DEV
Parent Page: Build Reports
Page Title: ${bamboo.planName} - Build ${bamboo.buildNumber}
Content:
  - Build summary
  - Test results
  - Code coverage
  - Deployment status

Attach artifacts:
  - test-reports
  - coverage-report
```

---

## Branches & Triggers

### Plan Branches

**Enable branch detection:**

1. Plan → Actions → Configure Plan
2. Branches tab
3. Create plan branches: **For pull requests and new branches**
4. Delete branches: **After 7 days of inactivity**
5. Branch pattern: `feature/*`, `bugfix/*`

**Branch configuration:**

```yaml
Branch Detection:
  Trigger: Automatically for pull requests
  Pattern: 
    Include: feature/*, bugfix/*, hotfix/*
    Exclude: experimental/*
  
  Cleanup:
    Delete after: 7 days
    Delete when: Branch is deleted
```

### Triggers

**Repository polling:**

```yaml
Trigger: Repository Polling
Repository: myapp-repo
Polling period: Every 60 seconds
```

**Scheduled trigger:**

```yaml
Trigger: Scheduled
Schedule: 0 2 * * *  # 2 AM daily
Description: Nightly build
Build: Only if repository has changes
```

**Remote trigger:**

```yaml
Trigger: Remote
IP addresses: 192.168.1.0/24, 10.0.0.0/8
Trigger URL: https://bamboo.example.com/rest/api/latest/queue/MYPROJECT-MB?os_authType=basic

Example curl:
curl -X POST -u username:password \
  "https://bamboo.example.com/rest/api/latest/queue/MYPROJECT-MB"
```

**Webhook trigger (Bitbucket):**

Configure in Bitbucket:

1. Repository → Settings → Webhooks
2. Add webhook
3. URL: `https://bamboo.example.com/rest/api/latest/webhook/bitbucket`
4. Events: Push, Pull request

### Dependencies

**Plan dependency:**

```yaml
Trigger: Plan Completed
Depends on: 
  - Plan: MYPROJECT-LIB
  - Status: Successful
  - Branch: same branch

Action: Trigger this plan
```

---

## Notifications

### Email Notifications

**Configure email server:**

1. ⚙️ → System → Email Configuration
2. SMTP server: `smtp.gmail.com`
3. Port: `587`
4. Use TLS: Yes
5. Username/Password
6. From address: `bamboo@example.com`

**Plan notification:**

```yaml
Notifications:
  - Recipient: Watchers
    Events:
      - All builds completed
      - Failed builds
  
  - Recipient: Committers
    Events:
      - Failed builds only
  
  - Recipient: Custom (team@example.com)
    Events:
      - All builds completed
```

### Slack Notifications

**Install Slack plugin:**

1. ⚙️ → Add-ons → Find new add-ons
2. Search "Slack"
3. Install Bamboo Slack Integration

**Configure Slack webhook:**

```yaml
Notification: Slack
Webhook URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
Channel: #builds
Events:
  - Build failed
  - Build successful
  - Deployment completed

Message template:
  Build ${bamboo.buildNumber} ${bamboo.buildState}
  Plan: ${bamboo.planName}
  Branch: ${bamboo.planRepository.branchName}
  Changes: ${bamboo.changeList}
```

### Custom Notifications

**Webhook notification:**

```yaml
Notification: Webhook
URL: https://api.example.com/bamboo-webhook
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer ${bamboo.api.token}

Body:
{
  "build": "${bamboo.buildNumber}",
  "status": "${bamboo.buildState}",
  "plan": "${bamboo.planKey}",
  "branch": "${bamboo.planRepository.branchName}",
  "url": "${bamboo.buildResultsUrl}"
}
```

---

## Bamboo Specs (Configuration as Code)

### What are Bamboo Specs?

Bamboo Specs allow you to define build configuration as Java or YAML code in your repository.

### Java Specs

**bamboo-specs/src/main/java/MyPlan.java:**

```java
import com.atlassian.bamboo.specs.api.BambooSpec;
import com.atlassian.bamboo.specs.api.builders.plan.Plan;
import com.atlassian.bamboo.specs.api.builders.plan.PlanIdentifier;
import com.atlassian.bamboo.specs.api.builders.project.Project;
import com.atlassian.bamboo.specs.builders.task.*;
import com.atlassian.bamboo.specs.builders.trigger.RepositoryPollingTrigger;
import com.atlassian.bamboo.specs.model.task.ScriptTaskProperties;

@BambooSpec
public class MyPlan {
    public Plan plan() {
        return new Plan(
            new Project()
                .key("MYPROJECT")
                .name("My Project"),
            "MyApp Build",
            "MB"
        )
        .description("Build and test MyApp")
        .stages(
            new Stage("Build")
                .jobs(
                    new Job("Compile", "COMPILE")
                        .tasks(
                            new VcsCheckoutTask()
                                .checkoutItems(new CheckoutItem().defaultRepository()),
                            new MavenTask()
                                .goal("clean install")
                                .jdk("JDK 17")
                                .executableLabel("Maven 3.9"),
                            new TestParserTask(TestParserTaskProperties.TestType.JUNIT)
                                .resultDirectories("**/target/surefire-reports/*.xml")
                        )
                        .artifacts(
                            new Artifact()
                                .name("application-jar")
                                .location("target")
                                .copyPattern("*.jar")
                                .shared(true)
                        )
                ),
            new Stage("Test")
                .jobs(
                    new Job("Integration Tests", "IT")
                        .tasks(
                            new VcsCheckoutTask(),
                            new MavenTask()
                                .goal("verify")
                                .jdk("JDK 17")
                        )
                )
        )
        .triggers(
            new RepositoryPollingTrigger()
                .pollEvery(60)
        )
        .planRepositories(
            new BitbucketServerRepository()
                .name("myapp-repo")
                .projectKey("MYPROJECT")
                .repositorySlug("myapp")
                .branch("main")
        );
    }
}
```

### YAML Specs

**bamboo-specs/bamboo.yaml:**

```yaml
---
version: 2
plan:
  project-key: MYPROJECT
  key: MB
  name: MyApp Build
  description: Build and test MyApp

stages:
  - Build:
      jobs:
        - Compile:
            key: COMPILE
            tasks:
              - checkout:
                  force-clean-build: false
              - script:
                  interpreter: SHELL
                  scripts:
                    - |-
                      mvn clean install
                      mvn package
            artifacts:
              - name: application-jar
                location: target
                pattern: "*.jar"
                shared: true
            requirements:
              - JDK 17
              - Maven 3.9
  
  - Test:
      jobs:
        - Integration Tests:
            key: IT
            tasks:
              - checkout: {}
              - script:
                  interpreter: SHELL
                  scripts:
                    - mvn verify

repositories:
  - myapp-repo:
      type: bitbucket-server
      project: MYPROJECT
      slug: myapp
      branch: main

triggers:
  - polling:
      period: 60

notifications:
  - events:
      - plan-completed
      - plan-failed
    recipients:
      - watchers
      - committers
```

### Enable Bamboo Specs

**1. Enable in Plan:**

1. Plan → Actions → Configure Plan
2. Bamboo Specs tab
3. Enable: **Scan for Bamboo Specs**
4. Repository: Select repository
5. Specs location: `bamboo-specs/`

**2. Grant permissions:**

```bash
# Repository must contain bamboo-specs directory
# User must have permissions to edit plan
```

**3. Push specs to repository:**

```bash
git add bamboo-specs/
git commit -m "Add Bamboo Specs configuration"
git push origin main
```

Bamboo automatically detects and applies configuration.

---

## Best Practices

### 1. Use Plan Templates

Create reusable plan templates:

```yaml
Template: Java Maven Build

Default Configuration:
  - JDK: 17
  - Maven: 3.9
  - Test framework: JUnit 5
  - Artifact: target/*.jar

Tasks:
  1. VCS Checkout
  2. Maven: clean install
  3. JUnit Parser
  4. Artifact Upload
```

### 2. Implement Build Caching

```yaml
Task: Cache
Cache key: ${bamboo.planRepository.branchName}-maven
Paths:
  - .m2/repository
  - node_modules/
  - target/

Restore cache before build
Save cache after build
```

### 3. Separate Build and Deploy

```yaml
Build Plan: MYPROJECT-BUILD
  - Stage: Build
  - Stage: Test
  - Stage: Package
  - Artifacts: application.jar

Deployment Project: MYPROJECT-DEPLOY
  - Environment: Dev
  - Environment: Staging
  - Environment: Production
```

### 4. Use Variables for Configuration

```yaml
Global Variables:
  docker.registry: registry.example.com
  app.version: ${bamboo.buildNumber}

Plan Variables:
  maven.opts: -Xmx2048m
  test.timeout: 300

Environment Variables:
  db.url: ${bamboo.db.${bamboo.deploy.environment}.url}
```

### 5. Implement Parallel Execution

```yaml
Stage: Test
Jobs:
  - Unit Tests (parallel)
  - Integration Tests (parallel)
  - E2E Tests (parallel)
  - Security Scan (parallel)
```

### 6. Add Health Checks

```yaml
Deployment Task: Health Check
Script: |
  for i in {1..30}; do
    if curl -f http://${deploy.server}/health; then
      echo "Service is healthy"
      exit 0
    fi
    echo "Waiting for service... ($i/30)"
    sleep 10
  done
  echo "Service failed to start"
  exit 1
```

### 7. Implement Rollback Strategy

```yaml
Deployment Environment: Production
Tasks:
  1. Backup current version
  2. Deploy new version
  3. Health check
  
On Failure:
  - Restore backup
  - Notify team
  - Create incident in Jira
```

### 8. Use Bamboo Specs

Store configuration in repository:

```text
myapp/
├── src/
├── pom.xml
└── bamboo-specs/
    ├── bamboo.yaml
    └── deployment.yaml
```

### 9. Monitor Build Performance

```yaml
Performance Metrics:
  - Build duration: < 10 minutes
  - Agent utilization: > 70%
  - Artifact size: < 100 MB
  - Test execution time: < 5 minutes

Alerts:
  - Build duration > 15 minutes
  - Test failure rate > 5%
```

### 10. Secure Secrets

```yaml
Encrypted Variables:
  - bamboo.db.password (encrypted)
  - bamboo.api.key (encrypted)
  - bamboo.ssh.key (encrypted)

Vault Integration:
  - Store secrets in HashiCorp Vault
  - Retrieve at runtime
  - Never log secrets
```

---

## Troubleshooting

### Build Failing

**Check build logs:**

1. Plan → Build results → Failed build
2. View logs tab
3. Identify failed task

**Common issues:**

- Missing dependencies
- Insufficient agent capabilities
- Test failures
- Timeout

### Agent Offline

**Check agent status:**

```bash
# On agent machine
systemctl status bamboo-agent

# Check logs
tail -f /opt/bamboo-agent/bamboo-agent.out.log
```

**Common issues:**

- Network connectivity
- Agent service not running
- Authentication problems
- Disk space

**Restart agent:**

```bash
systemctl restart bamboo-agent
```

### Artifact Not Found

**Verify artifact definition:**

```yaml
Job: Build
Artifact Definition:
  - Name: app-jar
  - Location: target/  # ✅ Correct path
  - Pattern: *.jar

Common mistakes:
  - Wrong location path
  - Pattern doesn't match files
  - Artifact not marked as shared
```

### Permission Issues

**Grant plan permissions:**

1. Plan → Actions → Configure Plan
2. Permissions tab
3. Add user/group with required permissions:
   - View
   - Build
   - Edit
   - Admin

### Database Connection Issues

**Check database:**

```bash
# PostgreSQL
sudo -u postgres psql

# Connect to Bamboo database
\c bamboo

# Check connections
SELECT * FROM pg_stat_activity WHERE datname = 'bamboo';
```

**Increase connection pool:**

Edit `bamboo-init.properties`:

```properties
bamboo.hibernate.connection.pool_size=50
```

### Performance Issues

**Optimize Bamboo:**

```properties
# Increase JVM memory
BAMBOO_MAX_MEM=4096m

# Tune garbage collection
BAMBOO_GC_OPTS=-XX:+UseG1GC -XX:MaxGCPauseMillis=200
```

**Database maintenance:**

```sql
-- Vacuum PostgreSQL database
VACUUM ANALYZE;

-- Rebuild indexes
REINDEX DATABASE bamboo;
```

---

## Example Configurations

### Java Spring Boot Application

**Plan Configuration:**

```yaml
Plan: SpringBoot Build
Project: SPRING
Key: BUILD

Stages:
  - Stage: Build
      Job: Maven Build
        Tasks:
          1. VCS Checkout
          2. Maven 3.x
             Goal: clean package
             JDK: JDK 17
             Maven opts: -DskipTests=false
          3. JUnit Parser
             Results: **/target/surefire-reports/*.xml
          4. Artifact Definition
             Name: spring-boot-jar
             Location: target/
             Pattern: *.jar
             Shared: true
  
  - Stage: Docker
      Job: Build Image
        Tasks:
          1. Docker
             Command: Build image
             Repository: myapp/spring-boot
             Tag: ${bamboo.buildNumber}
             Dockerfile: Dockerfile
          2. Docker
             Command: Push image
             Repository: myapp/spring-boot
             Tag: ${bamboo.buildNumber}

Deployment Project: SpringBoot Deploy
  Environment: Development
    Tasks:
      1. Artifact Download: spring-boot-jar
      2. Docker Run
         Image: myapp/spring-boot:${bamboo.deploy.version}
         Port: 8080:8080
      3. Health Check
         URL: http://localhost:8080/actuator/health
```

### Node.js Application

**bamboo-specs/bamboo.yaml:**

```yaml
version: 2
plan:
  project-key: NODE
  key: BUILD
  name: Node.js Build

stages:
  - Build:
      jobs:
        - Compile:
            tasks:
              - checkout: {}
              - script:
                  interpreter: SHELL
                  scripts:
                    - npm ci
                    - npm run lint
                    - npm test
                    - npm run build
            artifacts:
              - name: dist
                location: dist/
                pattern: "**/*"
                shared: true
            requirements:
              - Node.js 18

  - Docker:
      jobs:
        - Build Image:
            tasks:
              - checkout: {}
              - script:
                  scripts:
                    - docker build -t myapp/nodejs:${bamboo.buildNumber} .
                    - docker push myapp/nodejs:${bamboo.buildNumber}

triggers:
  - polling:
      period: 180

notifications:
  - events:
      - plan-failed
    recipients:
      - committers
      - watchers
```

### Python Flask Application

**Plan Tasks:**

```yaml
Stage 1: Build and Test

Job: Python Build
Requirements:
  - Python 3.11

Tasks:
  1. Source Code Checkout
  
  2. Script
     Interpreter: Shell
     Script:
       #!/bin/bash
       python3 -m venv venv
       source venv/bin/activate
       pip install -r requirements.txt
       pip install pytest pytest-cov
  
  3. Script
     Interpreter: Shell
     Script:
       #!/bin/bash
       source venv/bin/activate
       pytest --cov=app tests/ --cov-report=xml
  
  4. Test Results Parser
     Format: pytest
     Results: coverage.xml
  
  5. Script - Build Docker Image
     Script:
       #!/bin/bash
       docker build -t myapp/flask:${bamboo.buildNumber} .
       docker push myapp/flask:${bamboo.buildNumber}

Artifacts:
  - Name: flask-app
    Location: .
    Pattern: app/**,requirements.txt,Dockerfile
    Shared: true
```

---

## Resources

- **Official Documentation:** [https://confluence.atlassian.com/bamboo/](https://confluence.atlassian.com/bamboo/)
- **Bamboo Specs:** [https://docs.atlassian.com/bamboo-specs-docs/](https://docs.atlassian.com/bamboo-specs-docs/)
- **REST API:** [https://docs.atlassian.com/bamboo/REST/](https://docs.atlassian.com/bamboo/REST/)
- **Community:** [https://community.atlassian.com/t5/Bamboo/ct-p/bamboo](https://community.atlassian.com/t5/Bamboo/ct-p/bamboo)
- **Marketplace Add-ons:** [https://marketplace.atlassian.com/addons/app/bamboo](https://marketplace.atlassian.com/addons/app/bamboo)
- **Support:** [https://support.atlassian.com/bamboo/](https://support.atlassian.com/bamboo/)

---

**Note:** Bamboo requires a commercial license. A 30-day evaluation license is available for testing. Pricing varies based on number of build agents.
