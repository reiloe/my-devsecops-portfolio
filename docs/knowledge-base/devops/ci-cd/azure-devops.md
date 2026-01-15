---
title: ☁️ Azure DevOps Pipelines
---

# Azure DevOps Pipelines

Azure DevOps Pipelines is a comprehensive CI/CD service that enables automated building, testing, and deployment of applications to any platform. It supports both YAML-based and classic visual pipeline configurations.

---

## Table of Contents

1. [Introduction & Concepts](#introduction--concepts)
2. [Pipeline Architecture](#pipeline-architecture)
3. [Getting Started](#getting-started)
4. [YAML Pipeline Syntax](#yaml-pipeline-syntax)
5. [Triggers & Schedules](#triggers--schedules)
6. [Jobs, Stages & Dependencies](#jobs-stages--dependencies)
7. [Tasks & Templates](#tasks--templates)
8. [Variables & Parameters](#variables--parameters)
9. [Agents & Pools](#agents--pools)
10. [Artifacts & Caching](#artifacts--caching)
11. [Environments & Approvals](#environments--approvals)
12. [Service Connections](#service-connections)
13. [Advanced Features](#advanced-features)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)
16. [Example Pipelines](#example-pipelines)

---

## Introduction & Concepts

### What is Azure DevOps Pipelines?

Azure Pipelines automates:

- **Continuous Integration (CI):** Build and test code automatically
- **Continuous Delivery (CD):** Deploy to environments automatically
- **Multi-platform support:** Windows, Linux, macOS, containers
- **Cloud and on-premises:** Deploy anywhere

### Key Components

- **Pipeline:** Complete workflow from code to deployment
- **Stage:** Logical boundary in pipeline (build, test, deploy)
- **Job:** Unit of execution that runs on an agent
- **Step/Task:** Individual operation (build, test, deploy)
- **Agent:** Machine that executes pipeline jobs
- **Artifact:** Published output from pipeline
- **Environment:** Deployment target with approval gates

### Pipeline Types

- **YAML Pipelines:** Code-based, version-controlled (recommended)
- **Classic Pipelines:** Visual designer-based (legacy)
- **Multi-stage Pipelines:** Build, test, deploy in single YAML file

---

## Pipeline Architecture

### Stage-Job-Step Hierarchy

```text
Pipeline
├── Stage: Build
│   └── Job: Compile
│       ├── Step: Checkout code
│       ├── Step: Restore dependencies
│       └── Step: Build application
├── Stage: Test
│   ├── Job: Unit Tests
│   └── Job: Integration Tests
└── Stage: Deploy
    ├── Job: Deploy to Staging
    └── Job: Deploy to Production
```

### Execution Flow

```text
Trigger → Agent Assignment → Stage Execution → Job Execution → Task Execution → Publish Artifacts
```

### Pipeline YAML Location

- Must be named `azure-pipelines.yml` or custom name
- Can be in repository root or subfolder
- Supports multiple pipeline files per repository

---

## Getting Started

### Prerequisites

1. Azure DevOps organization (free at [https://dev.azure.com](https://dev.azure.com))
2. Project in Azure DevOps
3. Source code repository (Azure Repos, GitHub, Bitbucket)

### Creating Your First Pipeline

**Via Azure DevOps UI:**

1. Navigate to **Pipelines → Create Pipeline**
2. Select repository source
3. Choose starter template or existing YAML file
4. Review and run

**Minimal Pipeline:**

```yaml
# azure-pipelines.yml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- script: echo Hello, world!
  displayName: 'Run a one-line script'

- script: |
    echo Add other tasks to build, test, and deploy your project.
    echo See https://aka.ms/yaml
  displayName: 'Run a multi-line script'
```

### Running the Pipeline

- Automatically runs on trigger (push to main)
- Manual run: **Pipelines → Select pipeline → Run pipeline**
- View logs: Click on running/completed pipeline

---

## YAML Pipeline Syntax

### Complete Pipeline Structure

```yaml
# Pipeline name (optional)
name: $(Date:yyyyMMdd)$(Rev:.r)

# Trigger configuration
trigger:
  branches:
    include:
    - main
    - develop
  paths:
    include:
    - src/*
    exclude:
    - docs/*

# PR trigger
pr:
  branches:
    include:
    - main
  paths:
    exclude:
    - README.md

# Pipeline resources
resources:
  repositories:
  - repository: templates
    type: git
    name: MyProject/PipelineTemplates
    ref: refs/heads/main

# Variables
variables:
  buildConfiguration: 'Release'
  dotnetVersion: '8.0.x'

# Stages
stages:
- stage: Build
  displayName: 'Build Stage'
  jobs:
  - job: BuildJob
    displayName: 'Build Application'
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: UseDotNet@2
      displayName: 'Install .NET SDK'
      inputs:
        version: $(dotnetVersion)
    
    - script: dotnet build --configuration $(buildConfiguration)
      displayName: 'Build project'
    
    - task: PublishBuildArtifacts@1
      displayName: 'Publish Artifacts'
      inputs:
        PathtoPublish: '$(Build.ArtifactStagingDirectory)'
        ArtifactName: 'drop'

- stage: Test
  displayName: 'Test Stage'
  dependsOn: Build
  jobs:
  - job: TestJob
    displayName: 'Run Tests'
    steps:
    - script: dotnet test
      displayName: 'Run unit tests'

- stage: Deploy
  displayName: 'Deploy Stage'
  dependsOn: Test
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
  - deployment: DeployWeb
    displayName: 'Deploy to Azure'
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo Deploying application
            displayName: 'Deploy step'
```

### Key YAML Elements

| Element | Description |
|---------|-------------|
| `trigger` | Branch/path triggers for CI |
| `pr` | Pull request triggers |
| `schedules` | Scheduled pipeline runs |
| `resources` | External resources (repos, pipelines) |
| `variables` | Pipeline variables |
| `stages` | Logical divisions (build, test, deploy) |
| `jobs` | Execution units within stages |
| `steps` | Individual tasks/scripts |
| `pool` | Agent pool specification |

---

## Triggers & Schedules

### Branch Triggers

```yaml
trigger:
  branches:
    include:
    - main
    - releases/*
    exclude:
    - experimental/*
  paths:
    include:
    - src/*
    - azure-pipelines.yml
    exclude:
    - docs/*
    - README.md
  tags:
    include:
    - v*
    - release-*
```

### PR Triggers

```yaml
pr:
  branches:
    include:
    - main
    - develop
  paths:
    exclude:
    - docs/*
  autoCancel: true  # Cancel outdated PR builds
```

### Scheduled Triggers (Cron)

```yaml
schedules:
- cron: "0 0 * * *"  # Daily at midnight UTC
  displayName: Nightly build
  branches:
    include:
    - main
  always: true  # Run even if no code changes

- cron: "0 */6 * * *"  # Every 6 hours
  displayName: Periodic build
  branches:
    include:
    - develop
```

### Manual Triggers Only

```yaml
trigger: none
pr: none

# Pipeline only runs manually
```

### Pipeline Resources (Trigger on other pipelines)

```yaml
resources:
  pipelines:
  - pipeline: BuildPipeline
    source: 'MyProject-CI'
    trigger:
      branches:
      - main

stages:
- stage: Deploy
  jobs:
  - job: DeployJob
    steps:
    - download: BuildPipeline
      artifact: drop
```

---

## Jobs, Stages & Dependencies

### Multiple Jobs in Parallel

```yaml
jobs:
- job: BuildLinux
  pool:
    vmImage: 'ubuntu-latest'
  steps:
  - script: echo Building on Linux

- job: BuildWindows
  pool:
    vmImage: 'windows-latest'
  steps:
  - script: echo Building on Windows

- job: BuildMacOS
  pool:
    vmImage: 'macOS-latest'
  steps:
  - script: echo Building on macOS
```

All three jobs run in parallel.

### Job Dependencies

```yaml
jobs:
- job: BuildJob
  steps:
  - script: echo Building application

- job: TestJob
  dependsOn: BuildJob  # Waits for BuildJob
  steps:
  - script: echo Running tests

- job: DeployJob
  dependsOn:
  - BuildJob
  - TestJob
  steps:
  - script: echo Deploying application
```

### Conditional Jobs

```yaml
jobs:
- job: DeployProduction
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  steps:
  - script: echo Deploying to production

- job: DeployStaging
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/develop'))
  steps:
  - script: echo Deploying to staging
```

### Stage Dependencies

```yaml
stages:
- stage: Build
  jobs:
  - job: BuildJob
    steps:
    - script: echo Building

- stage: TestDev
  dependsOn: Build
  jobs:
  - job: DevTests
    steps:
    - script: echo Dev testing

- stage: TestQA
  dependsOn: Build
  jobs:
  - job: QATests
    steps:
    - script: echo QA testing

- stage: Deploy
  dependsOn:
  - TestDev
  - TestQA
  jobs:
  - job: DeployJob
    steps:
    - script: echo Deploying
```

### Deployment Jobs

```yaml
jobs:
- deployment: DeployWeb
  displayName: Deploy Web App
  environment: production
  strategy:
    runOnce:
      deploy:
        steps:
        - script: echo Deploying
        - script: echo Running smoke tests

# Alternative strategies
- deployment: DeployCanary
  environment: production
  strategy:
    canary:
      increments: [10, 25, 50]
      preDeploy:
        steps:
        - script: echo Pre-deployment checks
      deploy:
        steps:
        - script: echo Deploying canary
      postRouteTraf fic:
        steps:
        - script: echo Monitoring canary

- deployment: DeployRolling
  environment: production
  strategy:
    rolling:
      maxParallel: 2
      deploy:
        steps:
        - script: echo Rolling deployment
```

---

## Tasks & Templates

### Built-in Tasks

**Checkout:**

```yaml
steps:
- checkout: self
  clean: true
  fetchDepth: 1
  lfs: false
  submodules: false
```

**Script Task:**

```yaml
- script: |
    echo "Building application"
    npm install
    npm run build
  displayName: 'Build Node.js app'
  workingDirectory: '$(System.DefaultWorkingDirectory)/app'
```

**Bash/PowerShell:**

```yaml
- bash: |
    echo "Running on Linux"
    uname -a
  displayName: 'Linux commands'

- powershell: |
    Write-Host "Running on Windows"
    Get-ComputerInfo
  displayName: 'Windows commands'
```

### Common Tasks

**Node.js:**

```yaml
- task: NodeTool@0
  displayName: 'Install Node.js'
  inputs:
    versionSpec: '18.x'

- task: Npm@1
  displayName: 'npm install'
  inputs:
    command: 'install'

- task: Npm@1
  displayName: 'npm build'
  inputs:
    command: 'custom'
    customCommand: 'run build'
```

**.NET:**

```yaml
- task: UseDotNet@2
  displayName: 'Install .NET SDK'
  inputs:
    version: '8.0.x'
    packageType: 'sdk'

- task: DotNetCoreCLI@2
  displayName: 'Restore dependencies'
  inputs:
    command: 'restore'

- task: DotNetCoreCLI@2
  displayName: 'Build'
  inputs:
    command: 'build'
    arguments: '--configuration Release'

- task: DotNetCoreCLI@2
  displayName: 'Run tests'
  inputs:
    command: 'test'
    arguments: '--configuration Release --collect:"XPlat Code Coverage"'
```

**Docker:**

```yaml
- task: Docker@2
  displayName: 'Build Docker image'
  inputs:
    command: 'build'
    repository: '$(dockerRegistry)/$(imageName)'
    tags: |
      $(Build.BuildId)
      latest

- task: Docker@2
  displayName: 'Push Docker image'
  inputs:
    command: 'push'
    repository: '$(dockerRegistry)/$(imageName)'
    tags: |
      $(Build.BuildId)
      latest
```

**Azure CLI:**

```yaml
- task: AzureCLI@2
  displayName: 'Deploy to Azure'
  inputs:
    azureSubscription: 'AzureServiceConnection'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      az webapp deploy --resource-group $(resourceGroup) \
        --name $(webAppName) \
        --src-path $(System.DefaultWorkingDirectory)/app.zip
```

### Task Conditions

```yaml
- script: echo Running always
  condition: always()

- script: echo Running on success
  condition: succeeded()

- script: echo Running on failure
  condition: failed()

- script: echo Running only on main branch
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
```

### Templates

**Step template (`templates/build-steps.yml`):**

```yaml
parameters:
- name: buildConfiguration
  type: string
  default: 'Release'
- name: projectPath
  type: string

steps:
- task: DotNetCoreCLI@2
  displayName: 'Restore ${{ parameters.projectPath }}'
  inputs:
    command: 'restore'
    projects: '${{ parameters.projectPath }}'

- task: DotNetCoreCLI@2
  displayName: 'Build ${{ parameters.projectPath }}'
  inputs:
    command: 'build'
    projects: '${{ parameters.projectPath }}'
    arguments: '--configuration ${{ parameters.buildConfiguration }}'
```

**Using template:**

```yaml
steps:
- template: templates/build-steps.yml
  parameters:
    buildConfiguration: 'Release'
    projectPath: 'src/MyApp.csproj'
```

**Job template (`templates/test-job.yml`):**

```yaml
parameters:
- name: jobName
  type: string
- name: vmImage
  type: string

jobs:
- job: ${{ parameters.jobName }}
  pool:
    vmImage: ${{ parameters.vmImage }}
  steps:
  - script: echo Testing on ${{ parameters.vmImage }}
  - script: dotnet test
```

**Using job template:**

```yaml
jobs:
- template: templates/test-job.yml
  parameters:
    jobName: 'TestLinux'
    vmImage: 'ubuntu-latest'

- template: templates/test-job.yml
  parameters:
    jobName: 'TestWindows'
    vmImage: 'windows-latest'
```

**Stage template (`templates/deploy-stage.yml`):**

```yaml
parameters:
- name: environment
  type: string
- name: dependsOn
  type: object
  default: []

stages:
- stage: Deploy_${{ parameters.environment }}
  displayName: 'Deploy to ${{ parameters.environment }}'
  dependsOn: ${{ parameters.dependsOn }}
  jobs:
  - deployment: Deploy
    environment: ${{ parameters.environment }}
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo Deploying to ${{ parameters.environment }}
```

---

## Variables & Parameters

### Pipeline Variables

**Inline variables:**

```yaml
variables:
  buildConfiguration: 'Release'
  vmImage: 'ubuntu-latest'
  projectName: 'MyApp'

steps:
- script: echo $(buildConfiguration)
- script: echo $(vmImage)
```

**Variable groups:**

```yaml
variables:
- group: 'Production-Variables'  # Defined in Azure DevOps UI
- name: customVar
  value: 'customValue'

steps:
- script: echo $(secretFromGroup)
```

**System variables:**

```yaml
steps:
- script: |
    echo "Build ID: $(Build.BuildId)"
    echo "Build Number: $(Build.BuildNumber)"
    echo "Source Branch: $(Build.SourceBranch)"
    echo "Source Version: $(Build.SourceVersion)"
    echo "Repository: $(Build.Repository.Name)"
    echo "Agent OS: $(Agent.OS)"
    echo "Agent Name: $(Agent.Name)"
    echo "Working Directory: $(System.DefaultWorkingDirectory)"
    echo "Artifact Directory: $(Build.ArtifactStagingDirectory)"
```

**Runtime variables:**

```yaml
steps:
- bash: |
    echo "##vso[task.setvariable variable=myVar]myValue"
    echo "##vso[task.setvariable variable=myOutputVar;isOutput=true]outputValue"
  name: setVars

- script: echo $(myVar)

- script: echo $(setVars.myOutputVar)
```

**Cross-job variables:**

```yaml
jobs:
- job: JobA
  steps:
  - bash: echo "##vso[task.setvariable variable=myJobVar;isOutput=true]testValue"
    name: outputStep

- job: JobB
  dependsOn: JobA
  variables:
    varFromJobA: $[ dependencies.JobA.outputs['outputStep.myJobVar'] ]
  steps:
  - script: echo $(varFromJobA)
```

### Parameters

```yaml
parameters:
- name: environment
  displayName: 'Environment to deploy'
  type: string
  default: 'staging'
  values:
  - staging
  - production

- name: runTests
  displayName: 'Run tests'
  type: boolean
  default: true

- name: buildConfiguration
  type: string
  default: 'Release'

stages:
- stage: Deploy
  jobs:
  - job: DeployJob
    steps:
    - script: echo Deploying to ${{ parameters.environment }}
    - ${{ if eq(parameters.runTests, true) }}:
      - script: dotnet test
```

### Secret Variables

**Set in Azure DevOps UI:** Pipelines → Edit → Variables → New variable → Keep this value secret

**Use in pipeline:**

```yaml
steps:
- script: |
    echo "Deploying with secret"
  env:
    SECRET_KEY: $(secretVariable)
```

**Azure Key Vault:**

```yaml
variables:
- group: 'KeyVault-Secrets'  # Linked to Azure Key Vault

steps:
- task: AzureCLI@2
  inputs:
    azureSubscription: 'ServiceConnection'
    scriptType: 'bash'
    inlineScript: |
      echo "Using secret: $(databasePassword)"
  env:
    DB_PASSWORD: $(databasePassword)
```

---

## Agents & Pools

### Microsoft-Hosted Agents

```yaml
pool:
  vmImage: 'ubuntu-latest'  # Ubuntu Linux
  # vmImage: 'windows-latest'  # Windows Server
  # vmImage: 'macOS-latest'  # macOS
  # vmImage: 'ubuntu-22.04'  # Specific version
```

**Available images:**

- `ubuntu-latest`, `ubuntu-22.04`, `ubuntu-20.04`
- `windows-latest`, `windows-2022`, `windows-2019`
- `macOS-latest`, `macOS-13`, `macOS-12`

### Self-Hosted Agents

**Install agent:**

1. Navigate to **Organization Settings → Agent pools → Default → New agent**
2. Download agent for your OS
3. Configure and register agent

**Linux:**

```bash
mkdir myagent && cd myagent
tar zxvf ~/Downloads/vsts-agent-linux-x64-*.tar.gz
./config.sh
sudo ./svc.sh install
sudo ./svc.sh start
```

**Use self-hosted pool:**

```yaml
pool:
  name: 'Default'  # Pool name
  demands:
  - agent.os -equals Linux
  - docker
```

### Agent Capabilities & Demands

```yaml
pool:
  vmImage: 'ubuntu-latest'
  demands:
  - npm
  - docker
  - java
```

### Multiple Pools

```yaml
jobs:
- job: BuildLinux
  pool:
    vmImage: 'ubuntu-latest'
  steps:
  - script: echo Building on Linux

- job: BuildWindows
  pool:
    vmImage: 'windows-latest'
  steps:
  - script: echo Building on Windows

- job: BuildSelfHosted
  pool:
    name: 'SelfHosted-Pool'
  steps:
  - script: echo Building on self-hosted agent
```

---

## Artifacts & Caching

### Publishing Artifacts

```yaml
steps:
- script: |
    npm run build
    mkdir -p $(Build.ArtifactStagingDirectory)/dist
    cp -r dist/* $(Build.ArtifactStagingDirectory)/dist

- task: PublishBuildArtifacts@1
  displayName: 'Publish artifacts'
  inputs:
    PathtoPublish: '$(Build.ArtifactStagingDirectory)'
    ArtifactName: 'drop'
    publishLocation: 'Container'
```

**Publish Pipeline Artifact (recommended):**

```yaml
- task: PublishPipelineArtifact@1
  displayName: 'Publish pipeline artifact'
  inputs:
    targetPath: '$(Build.ArtifactStagingDirectory)'
    artifactName: 'drop'
    publishLocation: 'pipeline'
```

### Downloading Artifacts

```yaml
- task: DownloadBuildArtifacts@1
  displayName: 'Download artifacts'
  inputs:
    buildType: 'current'
    downloadType: 'single'
    artifactName: 'drop'
    downloadPath: '$(System.DefaultWorkingDirectory)'
```

**Download Pipeline Artifact:**

```yaml
- task: DownloadPipelineArtifact@2
  inputs:
    buildType: 'current'
    artifactName: 'drop'
    targetPath: '$(Pipeline.Workspace)'
```

### Caching

**Cache dependencies:**

```yaml
variables:
  npm_config_cache: $(Pipeline.Workspace)/.npm

steps:
- task: Cache@2
  displayName: 'Cache npm packages'
  inputs:
    key: 'npm | "$(Agent.OS)" | package-lock.json'
    restoreKeys: |
      npm | "$(Agent.OS)"
    path: $(npm_config_cache)

- script: npm ci
```

**Cache NuGet packages:**

```yaml
steps:
- task: Cache@2
  displayName: 'Cache NuGet packages'
  inputs:
    key: 'nuget | "$(Agent.OS)" | **/packages.lock.json'
    restoreKeys: |
      nuget | "$(Agent.OS)"
    path: $(NUGET_PACKAGES)

- task: DotNetCoreCLI@2
  inputs:
    command: 'restore'
```

**Cache Docker layers:**

```yaml
- task: Cache@2
  inputs:
    key: 'docker | "$(Agent.OS)" | Dockerfile'
    path: /tmp/.buildx-cache
  displayName: Cache Docker layers

- task: Docker@2
  inputs:
    command: build
    arguments: '--cache-from type=local,src=/tmp/.buildx-cache --cache-to type=local,dest=/tmp/.buildx-cache'
```

---

## Environments & Approvals

### Creating Environments

**Azure DevOps UI:** Pipelines → Environments → New environment

- Set approval gates
- Add checks (Azure Policy, REST API)
- Configure deployment history

### Using Environments

```yaml
stages:
- stage: DeployStaging
  jobs:
  - deployment: DeployWeb
    environment: staging
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo Deploying to staging

- stage: DeployProduction
  jobs:
  - deployment: DeployWeb
    environment: production  # Requires approval
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo Deploying to production
```

### Manual Approval

Configure in environment settings:

1. Navigate to **Environments → production → Approvals and checks**
2. Add **Approvals**
3. Select approvers
4. Set timeout

### Environment Resources

```yaml
- deployment: DeployK8s
  environment:
    name: 'production'
    resourceName: 'production-cluster'
    resourceType: 'Kubernetes'
  strategy:
    runOnce:
      deploy:
        steps:
        - script: kubectl apply -f deployment.yaml
```

### Deployment Gates

```yaml
# Configured in Azure DevOps UI
# Pre-deployment approvals
# Pre-deployment gates (Azure Monitor, REST API)
# Post-deployment approvals
# Post-deployment gates
```

---

## Service Connections

### Creating Service Connections

**Azure DevOps UI:** Project Settings → Service connections → New service connection

Types:

- **Azure Resource Manager** (for Azure deployments)
- **Docker Registry** (for container images)
- **Kubernetes** (for K8s deployments)
- **GitHub** (for GitHub repos)
- **npm** (for package publishing)

### Using Service Connections

**Azure deployment:**

```yaml
- task: AzureWebApp@1
  displayName: 'Deploy to Azure Web App'
  inputs:
    azureSubscription: 'AzureServiceConnection'
    appName: '$(webAppName)'
    package: '$(System.DefaultWorkingDirectory)/**/*.zip'
```

**Docker push:**

```yaml
- task: Docker@2
  displayName: 'Push to Docker Hub'
  inputs:
    containerRegistry: 'DockerHubServiceConnection'
    repository: 'username/repository'
    command: 'push'
    tags: '$(Build.BuildId)'
```

**Kubernetes deployment:**

```yaml
- task: Kubernetes@1
  displayName: 'Deploy to Kubernetes'
  inputs:
    connectionType: 'Kubernetes Service Connection'
    kubernetesServiceEndpoint: 'K8sServiceConnection'
    command: 'apply'
    arguments: '-f deployment.yaml'
```

---

## Advanced Features

### Multi-Repo Checkout

```yaml
resources:
  repositories:
  - repository: shared
    type: git
    name: MyProject/SharedLibraries
  - repository: templates
    type: github
    endpoint: GitHubConnection
    name: myorg/pipeline-templates

steps:
- checkout: self
- checkout: shared
- checkout: templates
```

### Container Jobs

```yaml
jobs:
- job: BuildInContainer
  pool:
    vmImage: 'ubuntu-latest'
  container:
    image: node:18
    options: --cpus 2
  steps:
  - script: node --version
  - script: npm ci
  - script: npm run build
```

### Service Containers

```yaml
jobs:
- job: IntegrationTests
  pool:
    vmImage: 'ubuntu-latest'
  services:
    postgres:
      image: postgres:14
      env:
        POSTGRES_PASSWORD: postgres
      ports:
      - 5432:5432
    redis:
      image: redis:7
      ports:
      - 6379:6379
  steps:
  - script: npm run test:integration
    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
      REDIS_URL: redis://localhost:6379
```

### Matrix Strategy

```yaml
strategy:
  matrix:
    Linux_Node16:
      imageName: 'ubuntu-latest'
      nodeVersion: '16.x'
    Linux_Node18:
      imageName: 'ubuntu-latest'
      nodeVersion: '18.x'
    Windows_Node18:
      imageName: 'windows-latest'
      nodeVersion: '18.x'
    Mac_Node18:
      imageName: 'macOS-latest'
      nodeVersion: '18.x'
  maxParallel: 4

pool:
  vmImage: $(imageName)

steps:
- task: NodeTool@0
  inputs:
    versionSpec: $(nodeVersion)
- script: npm test
```

### Expressions & Functions

```yaml
variables:
  ${{ if eq(variables['Build.SourceBranch'], 'refs/heads/main') }}:
    environment: 'production'
  ${{ else }}:
    environment: 'staging'

steps:
- script: echo Deploying to $(environment)

- script: echo Branch name is ${{ replace(variables['Build.SourceBranch'], 'refs/heads/', '') }}

- script: echo Upper case ${{ upper(variables['environment']) }}
```

### Pipeline Decorators

```yaml
# Organization-level extension
# Automatically inject steps into all pipelines
# E.g., security scanning, compliance checks
```

---

## Best Practices

### 1. Use YAML Pipelines

```yaml
# Version control your pipeline
# Code review pipeline changes
# Reuse templates across projects
```

### 2. Template Organization

```text
Repository
├── azure-pipelines.yml
└── pipelines/
    ├── templates/
    │   ├── build.yml
    │   ├── test.yml
    │   └── deploy.yml
    └── variables/
        ├── dev.yml
        └── prod.yml
```

### 3. Use Variable Groups

```yaml
variables:
- group: 'Production-Secrets'
- group: 'Common-Variables'
- name: specificVar
  value: 'value'
```

### 4. Implement Caching

```yaml
- task: Cache@2
  inputs:
    key: 'npm | "$(Agent.OS)" | package-lock.json'
    path: $(npm_config_cache)
```

### 5. Use Environments for Production

```yaml
- deployment: DeployProd
  environment: production  # Requires approval
  strategy:
    runOnce:
      deploy:
        steps:
        - script: deploy.sh
```

### 6. Parallel Execution

```yaml
strategy:
  parallel: 4  # Run 4 instances in parallel
```

### 7. Fail Fast

```yaml
stages:
- stage: Validate
  jobs:
  - job: Lint
    steps:
    - script: npm run lint

- stage: Build
  dependsOn: Validate  # Only run if validation passes
  jobs:
  - job: BuildApp
    steps:
    - script: npm run build
```

### 8. Use Conditions Wisely

```yaml
- stage: DeployProduction
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
```

---

## Troubleshooting

### Common Issues

**Pipeline not triggering:**

```yaml
# Check trigger configuration
trigger:
  branches:
    include:
    - main  # Ensure correct branch name
  paths:
    exclude:
    - docs/*  # Verify path filters
```

**Agent timeout:**

```yaml
jobs:
- job: LongRunning
  timeoutInMinutes: 120  # Increase timeout (default: 60)
  steps:
  - script: long-running-process.sh
```

**Artifact not found:**

```yaml
# Ensure artifact is published before download
- task: PublishPipelineArtifact@1
  inputs:
    targetPath: '$(Build.ArtifactStagingDirectory)'
    artifactName: 'drop'

# Then download in later job/stage
- task: DownloadPipelineArtifact@2
  inputs:
    artifactName: 'drop'
```

**Variable not available:**

```yaml
# Use macro syntax for runtime variables
- script: echo $(myVar)

# Use template expression for compile-time
- script: echo ${{ variables.myVar }}
```

### Debug Logging

**Enable system diagnostics:**

When queuing pipeline:

- Click "Run pipeline"
- Click "Variables"
- Add variable: `system.debug` = `true`

**Script debugging:**

```yaml
- bash: |
    set -x  # Enable bash debugging
    echo "Variable value: $(myVar)"
    env  # Print all environment variables
  displayName: 'Debug script'
```

### Validate YAML

```bash
# Use Azure CLI to validate
az pipelines show --id <pipeline-id> --organization https://dev.azure.com/yourorg/ --project yourproject
```

---

## Example Pipelines

### Node.js Application

```yaml
trigger:
  branches:
    include:
    - main
    - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  npm_config_cache: $(Pipeline.Workspace)/.npm

stages:
- stage: Build
  displayName: 'Build and Test'
  jobs:
  - job: BuildJob
    displayName: 'Build Application'
    steps:
    - task: NodeTool@0
      displayName: 'Install Node.js'
      inputs:
        versionSpec: '18.x'
    
    - task: Cache@2
      displayName: 'Cache npm'
      inputs:
        key: 'npm | "$(Agent.OS)" | package-lock.json'
        restoreKeys: |
          npm | "$(Agent.OS)"
        path: $(npm_config_cache)
    
    - script: npm ci
      displayName: 'Install dependencies'
    
    - script: npm run lint
      displayName: 'Lint code'
    
    - script: npm run build
      displayName: 'Build application'
    
    - script: npm test -- --coverage
      displayName: 'Run tests'
    
    - task: PublishCodeCoverageResults@1
      displayName: 'Publish coverage'
      inputs:
        codeCoverageTool: 'Cobertura'
        summaryFileLocation: '$(System.DefaultWorkingDirectory)/coverage/cobertura-coverage.xml'
    
    - task: PublishPipelineArtifact@1
      displayName: 'Publish build artifacts'
      inputs:
        targetPath: '$(System.DefaultWorkingDirectory)/dist'
        artifactName: 'dist'

- stage: Docker
  displayName: 'Build Docker Image'
  dependsOn: Build
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
  - job: DockerBuild
    steps:
    - task: Docker@2
      displayName: 'Build image'
      inputs:
        command: 'build'
        repository: '$(dockerRegistry)/$(imageName)'
        tags: |
          $(Build.BuildId)
          latest
    
    - task: Docker@2
      displayName: 'Push image'
      inputs:
        containerRegistry: 'DockerHubConnection'
        repository: '$(dockerRegistry)/$(imageName)'
        command: 'push'
        tags: |
          $(Build.BuildId)
          latest

- stage: Deploy
  displayName: 'Deploy to Azure'
  dependsOn: Docker
  jobs:
  - deployment: DeployWeb
    displayName: 'Deploy Web App'
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebAppContainer@1
            displayName: 'Deploy container'
            inputs:
              azureSubscription: 'AzureConnection'
              appName: '$(webAppName)'
              imageName: '$(dockerRegistry)/$(imageName):$(Build.BuildId)'
```

### .NET Application

```yaml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'
  dotnetVersion: '8.0.x'

stages:
- stage: Build
  jobs:
  - job: BuildJob
    steps:
    - task: UseDotNet@2
      displayName: 'Install .NET SDK'
      inputs:
        version: $(dotnetVersion)
    
    - task: DotNetCoreCLI@2
      displayName: 'Restore packages'
      inputs:
        command: 'restore'
        projects: '**/*.csproj'
    
    - task: DotNetCoreCLI@2
      displayName: 'Build solution'
      inputs:
        command: 'build'
        projects: '**/*.csproj'
        arguments: '--configuration $(buildConfiguration)'
    
    - task: DotNetCoreCLI@2
      displayName: 'Run tests'
      inputs:
        command: 'test'
        projects: '**/*Tests.csproj'
        arguments: '--configuration $(buildConfiguration) --collect:"XPlat Code Coverage"'
    
    - task: PublishCodeCoverageResults@1
      displayName: 'Publish coverage'
      inputs:
        codeCoverageTool: 'Cobertura'
        summaryFileLocation: '$(Agent.TempDirectory)/**/coverage.cobertura.xml'
    
    - task: DotNetCoreCLI@2
      displayName: 'Publish application'
      inputs:
        command: 'publish'
        publishWebProjects: true
        arguments: '--configuration $(buildConfiguration) --output $(Build.ArtifactStagingDirectory)'
    
    - task: PublishPipelineArtifact@1
      inputs:
        targetPath: '$(Build.ArtifactStagingDirectory)'
        artifactName: 'drop'

- stage: Deploy
  dependsOn: Build
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
  - deployment: DeployAzure
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: DownloadPipelineArtifact@2
            inputs:
              artifactName: 'drop'
              targetPath: '$(Pipeline.Workspace)/drop'
          
          - task: AzureWebApp@1
            displayName: 'Deploy to Azure Web App'
            inputs:
              azureSubscription: 'AzureConnection'
              appType: 'webApp'
              appName: '$(webAppName)'
              package: '$(Pipeline.Workspace)/drop/**/*.zip'
```

---

## Resources

- **Official Documentation:** [https://docs.microsoft.com/azure/devops/pipelines/](https://docs.microsoft.com/azure/devops/pipelines/)
- **YAML Schema:** [https://docs.microsoft.com/azure/devops/pipelines/yaml-schema](https://docs.microsoft.com/azure/devops/pipelines/yaml-schema)
- **Task Reference:** [https://docs.microsoft.com/azure/devops/pipelines/tasks/](https://docs.microsoft.com/azure/devops/pipelines/tasks/)
- **Examples:** [https://github.com/microsoft/azure-pipelines-yaml](https://github.com/microsoft/azure-pipelines-yaml)

---

**Note:** Always test pipeline changes in a feature branch before merging to main. Use pull request validation builds to catch issues early.
