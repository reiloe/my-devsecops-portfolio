---
title: ☁️ AWS CodePipeline
---

# AWS CodePipeline

AWS CodePipeline is a fully managed CI/CD service that automates build, test, and deployment processes. Combined with other AWS services like CodeCommit, CodeBuild, CodeDeploy, and CodeArtifact, it creates a complete native AWS solution.

---

## Table of Contents

1. [Introduction & AWS CI/CD Services](#introduction--aws-cicd-services)
2. [Architecture & Components](#architecture--components)
3. [Getting Started](#getting-started)
4. [AWS CodeCommit](#aws-codecommit)
5. [AWS CodeBuild](#aws-codebuild)
6. [AWS CodeDeploy](#aws-codedeploy)
7. [AWS CodePipeline](#aws-codepipeline)
8. [AWS CodeArtifact](#aws-codeartifact)
9. [IAM Permissions & Security](#iam-permissions--security)
10. [Container Deployments](#container-deployments)
11. [Lambda Deployments](#lambda-deployments)
12. [Advanced Pipeline Patterns](#advanced-pipeline-patterns)
13. [Monitoring & Notifications](#monitoring--notifications)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)
16. [Example Pipelines](#example-pipelines)

---

## Introduction & AWS CI/CD Services

### AWS Developer Tools Ecosystem

AWS offers a complete suite of CI/CD tools:

| Service | Function | Comparable to |
|---------|----------|---------------|
| **CodeCommit** | Git Repository | GitHub, GitLab |
| **CodeBuild** | Build & Test | Jenkins, GitHub Actions |
| **CodeDeploy** | Deployment | Spinnaker, ArgoCD |
| **CodePipeline** | Pipeline Orchestration | Jenkins Pipeline, GitLab CI/CD |
| **CodeArtifact** | Artifact Repository | Nexus, Artifactory |
| **CodeGuru** | Code Review (AI) | SonarQube |

### Why AWS-native CI/CD?

**Advantages:**

- ✅ Seamless AWS integration (EC2, ECS, Lambda, S3, etc.)
- ✅ IAM-based security and permissions
- ✅ No server management (fully managed)
- ✅ Pay-per-use pricing (no fixed costs)
- ✅ Automatic scaling
- ✅ CloudFormation/CDK integration

**Disadvantages:**

- ❌ Vendor lock-in
- ❌ Less flexibility than Jenkins/GitLab
- ❌ UI less mature
- ❌ Limited plugin ecosystem

### Typical Workflow

```text
Developer Push
    ↓
CodeCommit (Source)
    ↓
CodePipeline (Orchestration)
    ↓
CodeBuild (Build & Test)
    ↓
CodeArtifact (Artifact Storage)
    ↓
CodeDeploy (Deployment)
    ↓
EC2 / ECS / Lambda / Elastic Beanstalk
```

---

## Architecture & Components

### Pipeline Stages

A CodePipeline consists of **Stages**, each stage contains **Actions**:

```text
Pipeline: MyApp-Pipeline
├── Stage 1: Source
│   └── Action: SourceAction (CodeCommit)
├── Stage 2: Build
│   └── Action: BuildAction (CodeBuild)
├── Stage 3: Test
│   ├── Action: UnitTests (CodeBuild)
│   └── Action: IntegrationTests (CodeBuild)
├── Stage 4: Deploy-Staging
│   └── Action: DeployStaging (CodeDeploy)
├── Stage 5: Approval
│   └── Action: ManualApproval
└── Stage 6: Deploy-Production
    └── Action: DeployProduction (CodeDeploy)
```

### Action Types

- **Source:** CodeCommit, GitHub, S3, ECR
- **Build:** CodeBuild, Jenkins
- **Test:** CodeBuild, Device Farm
- **Deploy:** CodeDeploy, ECS, CloudFormation, S3
- **Approval:** Manual approval gate
- **Invoke:** Lambda function

### Artifact Flow

```text
Source Stage → Output: SourceArtifact
    ↓
Build Stage → Input: SourceArtifact → Output: BuildArtifact
    ↓
Deploy Stage → Input: BuildArtifact
```

---

## Getting Started

### Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Git** for CodeCommit
4. **IAM Permissions** for CodePipeline, CodeBuild, CodeDeploy

### AWS CLI Installation

```bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows
# Download MSI installer from AWS website

# Configure AWS CLI
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region: eu-central-1
# Default output format: json
```

### Verify Installation

```bash
aws --version
aws sts get-caller-identity
```

---

## AWS CodeCommit

### Creating a Repository

**Via AWS Console:**

1. Navigate to **CodeCommit → Repositories → Create repository**
2. Repository name: `my-app`
3. Description: `My application repository`
4. Click **Create**

**Via AWS CLI:**

```bash
aws codecommit create-repository \
    --repository-name my-app \
    --repository-description "My application repository" \
    --region eu-central-1
```

### Configure Git Credentials

**Option 1: HTTPS (Git Credentials)**

1. Navigate to **IAM → Users → Your User → Security credentials**
2. Scroll to **HTTPS Git credentials for AWS CodeCommit**
3. Click **Generate credentials**
4. Save username and password

```bash
git clone https://git-codecommit.eu-central-1.amazonaws.com/v1/repos/my-app
cd my-app
```

**Option 2: SSH**

```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_rsa.pub

# Add to IAM → Users → Your User → Security credentials → SSH keys
```

**SSH Config (`~/.ssh/config`):**

```text
Host git-codecommit.*.amazonaws.com
  User APKAEIBAERJR2EXAMPLE
  IdentityFile ~/.ssh/codecommit_rsa
```

**Clone with SSH:**

```bash
git clone ssh://git-codecommit.eu-central-1.amazonaws.com/v1/repos/my-app
```

### Branch Protection

**Via Console:**

- CodeCommit → Repositories → my-app → Settings → Approval rules
- Create approval rule template (require reviews before merge)

### Working with CodeCommit

```bash
# Add files
echo "# My App" > README.md
git add README.md
git commit -m "Initial commit"

# Push to main branch
git push origin main

# Create feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature
```

---

## AWS CodeBuild

### What is CodeBuild?

Fully managed build service that:

- Compiles source code
- Runs tests
- Produces deployable artifacts
- Supports Docker, custom build environments
- Pay per build minute

### Build Specification (buildspec.yml)

The `buildspec.yml` defines build steps:

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - echo Installing dependencies...
      - npm install

  pre_build:
    commands:
      - echo Running linter...
      - npm run lint
      - echo Running tests...
      - npm test

  build:
    commands:
      - echo Build started on `date`
      - npm run build
      - echo Build completed on `date`

  post_build:
    commands:
      - echo Packaging application...
      - zip -r app.zip dist/

artifacts:
  files:
    - app.zip
    - dist/**/*
  name: BuildArtifact

cache:
  paths:
    - 'node_modules/**/*'

reports:
  jest_reports:
    files:
      - 'coverage/clover.xml'
    file-format: CLOVERXML
```

### Creating a Build Project

**Via AWS Console:**

1. Navigate to **CodeBuild → Build projects → Create build project**
2. **Project configuration:**
   - Project name: `my-app-build`
   - Description: `Build project for my-app`

3. **Source:**
   - Source provider: `AWS CodeCommit`
   - Repository: `my-app`
   - Branch: `main`

4. **Environment:**
   - Environment image: `Managed image`
   - Operating system: `Amazon Linux 2`
   - Runtime: `Standard`
   - Image: `aws/codebuild/amazonlinux2-x86_64-standard:5.0`
   - Privileged: ☑️ (Enable if using Docker)

5. **Buildspec:**
   - Build specifications: `Use a buildspec file`
   - Buildspec name: `buildspec.yml` (optional, default)

6. **Artifacts:**
   - Type: `No artifacts` (or S3 for manual storage)

7. **Logs:**
   - CloudWatch Logs: Enabled

**Via AWS CLI:**

```bash
aws codebuild create-project \
    --name my-app-build \
    --source type=CODECOMMIT,location=https://git-codecommit.eu-central-1.amazonaws.com/v1/repos/my-app \
    --artifacts type=NO_ARTIFACTS \
    --environment type=LINUX_CONTAINER,image=aws/codebuild/amazonlinux2-x86_64-standard:5.0,computeType=BUILD_GENERAL1_SMALL \
    --service-role arn:aws:iam::123456789012:role/CodeBuildServiceRole
```

### Docker in CodeBuild

**buildspec.yml for Docker:**

```yaml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
      - REPOSITORY_URI=$ECR_REGISTRY/$IMAGE_REPO_NAME
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}

  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $REPOSITORY_URI:latest .
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG

  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"%s","imageUri":"%s"}]' $CONTAINER_NAME $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
```

**Environment Variables in Build Project:**

```text
AWS_REGION=eu-central-1
ECR_REGISTRY=123456789012.dkr.ecr.eu-central-1.amazonaws.com
IMAGE_REPO_NAME=my-app
CONTAINER_NAME=my-app-container
```

### Testing in CodeBuild

**buildspec.yml with tests:**

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      python: 3.11
    commands:
      - pip install -r requirements.txt
      - pip install pytest pytest-cov

  pre_build:
    commands:
      - echo Running linter...
      - pylint src/

  build:
    commands:
      - echo Running tests...
      - pytest --cov=src --cov-report=xml --cov-report=html

  post_build:
    commands:
      - echo Build completed on `date`

reports:
  pytest_reports:
    files:
      - 'coverage.xml'
    file-format: COBERTURAXML

artifacts:
  files:
    - '**/*'
```

### Build Caching

```yaml
cache:
  paths:
    - '/root/.m2/**/*'  # Maven
    - '/root/.gradle/**/*'  # Gradle
    - 'node_modules/**/*'  # npm
    - '/root/.cache/pip/**/*'  # pip
```

### Manual Build Trigger

```bash
aws codebuild start-build --project-name my-app-build
```

---

## AWS CodeDeploy

### What is CodeDeploy?

Automates application deployments to:

- **EC2 instances**
- **On-premises servers**
- **Lambda functions**
- **ECS services**

### Deployment Types

| Type | Description | Use Case |
|------|-------------|----------|
| **In-place** | Updates instances in place | EC2, on-premises |
| **Blue/Green** | New environment, switch traffic | EC2, ECS, Lambda |
| **Canary** | Gradual rollout (10%, 50%, 100%) | Lambda, ECS |
| **Linear** | Incremental traffic shift | Lambda, ECS |
| **All-at-once** | Deploy to all at once | Lambda |

### EC2/On-Premises Deployment

#### 1. Install CodeDeploy Agent

**On EC2 instance (Amazon Linux 2):**

```bash
sudo yum update -y
sudo yum install -y ruby wget

cd /home/ec2-user
wget https://aws-codedeploy-eu-central-1.s3.eu-central-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

# Verify installation
sudo service codedeploy-agent status
```

**Ubuntu:**

```bash
sudo apt update
sudo apt install -y ruby wget

cd /home/ubuntu
wget https://aws-codedeploy-eu-central-1.s3.eu-central-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

sudo service codedeploy-agent start
sudo service codedeploy-agent status
```

#### 2. IAM Role for EC2 Instance

Create IAM role with policies:

- `AmazonEC2RoleforAWSCodeDeploy`
- `AmazonS3ReadOnlyAccess` (to read deployment bundles)

Attach to EC2 instance.

#### 3. Create Application

```bash
aws deploy create-application \
    --application-name my-app \
    --compute-platform Server
```

#### 4. Create Deployment Group

```bash
aws deploy create-deployment-group \
    --application-name my-app \
    --deployment-group-name my-app-deployment-group \
    --deployment-config-name CodeDeployDefault.OneAtATime \
    --ec2-tag-filters Key=Environment,Value=Production,Type=KEY_AND_VALUE \
    --service-role-arn arn:aws:iam::123456789012:role/CodeDeployServiceRole
```

#### 5. AppSpec File (appspec.yml)

```yaml
version: 0.0
os: linux
files:
  - source: /
    destination: /var/www/html

permissions:
  - object: /var/www/html
    owner: www-data
    group: www-data
    mode: 755
    type:
      - directory
  - object: /var/www/html
    owner: www-data
    group: www-data
    mode: 644
    type:
      - file

hooks:
  ApplicationStop:
    - location: scripts/stop_server.sh
      timeout: 300
      runas: root

  BeforeInstall:
    - location: scripts/install_dependencies.sh
      timeout: 300
      runas: root

  ApplicationStart:
    - location: scripts/start_server.sh
      timeout: 300
      runas: root

  ValidateService:
    - location: scripts/validate_service.sh
      timeout: 300
      runas: root
```

**Lifecycle Hooks:**

```text
ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService
```

#### 6. Deployment Scripts

**scripts/stop_server.sh:**

```bash
#!/bin/bash
echo "Stopping application..."
systemctl stop nginx || true
```

**scripts/install_dependencies.sh:**

```bash
#!/bin/bash
echo "Installing dependencies..."
cd /var/www/html
npm ci --production
```

**scripts/start_server.sh:**

```bash
#!/bin/bash
echo "Starting application..."
systemctl start nginx
```

**scripts/validate_service.sh:**

```bash
#!/bin/bash
echo "Validating service..."
curl -f http://localhost:80/health || exit 1
```

#### 7. Create Deployment

```bash
aws deploy create-deployment \
    --application-name my-app \
    --deployment-group-name my-app-deployment-group \
    --s3-location bucket=my-codedeploy-bucket,key=my-app.zip,bundleType=zip
```

### ECS Deployment (Blue/Green)

**appspec.yaml for ECS:**

```yaml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "arn:aws:ecs:eu-central-1:123456789012:task-definition/my-app:1"
        LoadBalancerInfo:
          ContainerName: "my-app-container"
          ContainerPort: 80
        PlatformVersion: "LATEST"

Hooks:
  - BeforeInstall: "LambdaFunctionToValidateBeforeInstall"
  - AfterInstall: "LambdaFunctionToValidateAfterInstall"
  - AfterAllowTestTraffic: "LambdaFunctionToValidateAfterTestTraffic"
  - BeforeAllowTraffic: "LambdaFunctionToValidateBeforeAllowTraffic"
  - AfterAllowTraffic: "LambdaFunctionToValidateAfterAllowTraffic"
```

### Lambda Deployment

**appspec.yaml for Lambda:**

```yaml
version: 0.0
Resources:
  - MyFunction:
      Type: AWS::Lambda::Function
      Properties:
        Name: "my-lambda-function"
        Alias: "live"
        CurrentVersion: "1"
        TargetVersion: "2"

Hooks:
  - BeforeAllowTraffic: "PreTrafficLambdaFunction"
  - AfterAllowTraffic: "PostTrafficLambdaFunction"
```

**Deployment Configuration:**

```bash
# Linear: 10% every 10 minutes
CodeDeployDefault.LambdaLinear10PercentEvery10Minutes

# Canary: 10% first, then 100%
CodeDeployDefault.LambdaCanary10Percent5Minutes

# All at once
CodeDeployDefault.LambdaAllAtOnce
```

---

## AWS CodePipeline

### Creating a Pipeline

**Via AWS Console:**

1. Navigate to **CodePipeline → Pipelines → Create pipeline**

2. **Pipeline settings:**
   - Pipeline name: `my-app-pipeline`
   - Service role: `New service role` (auto-created)
   - Artifact store: `Default location` (S3 bucket)

3. **Source stage:**
   - Source provider: `AWS CodeCommit`
   - Repository: `my-app`
   - Branch: `main`
   - Detection options: `AWS CloudWatch Events` (automatic trigger)

4. **Build stage:**
   - Build provider: `AWS CodeBuild`
   - Project name: `my-app-build`
   - Build type: `Single build`

5. **Deploy stage:**
   - Deploy provider: `AWS CodeDeploy`
   - Application name: `my-app`
   - Deployment group: `my-app-deployment-group`

6. Review and **Create pipeline**

### Pipeline via CloudFormation

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: CodePipeline for My App

Resources:
  ArtifactStoreBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'codepipeline-artifacts-${AWS::AccountId}'
      VersioningConfiguration:
        Status: Enabled

  Pipeline:
    Type: AWS::CodePipeline::Pipeline
    Properties:
      Name: my-app-pipeline
      RoleArn: !GetAtt CodePipelineServiceRole.Arn
      ArtifactStore:
        Type: S3
        Location: !Ref ArtifactStoreBucket
      Stages:
        - Name: Source
          Actions:
            - Name: SourceAction
              ActionTypeId:
                Category: Source
                Owner: AWS
                Provider: CodeCommit
                Version: '1'
              Configuration:
                RepositoryName: my-app
                BranchName: main
              OutputArtifacts:
                - Name: SourceOutput

        - Name: Build
          Actions:
            - Name: BuildAction
              ActionTypeId:
                Category: Build
                Owner: AWS
                Provider: CodeBuild
                Version: '1'
              Configuration:
                ProjectName: my-app-build
              InputArtifacts:
                - Name: SourceOutput
              OutputArtifacts:
                - Name: BuildOutput

        - Name: Deploy
          Actions:
            - Name: DeployAction
              ActionTypeId:
                Category: Deploy
                Owner: AWS
                Provider: CodeDeploy
                Version: '1'
              Configuration:
                ApplicationName: my-app
                DeploymentGroupName: my-app-deployment-group
              InputArtifacts:
                - Name: BuildOutput

  CodePipelineServiceRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: codepipeline.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/AWSCodePipelineFullAccess
      Policies:
        - PolicyName: CodePipelinePolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - codecommit:GetBranch
                  - codecommit:GetCommit
                  - codecommit:GetUploadArchiveStatus
                  - codecommit:UploadArchive
                Resource: '*'
              - Effect: Allow
                Action:
                  - codebuild:BatchGetBuilds
                  - codebuild:StartBuild
                Resource: '*'
              - Effect: Allow
                Action:
                  - codedeploy:CreateDeployment
                  - codedeploy:GetApplication
                  - codedeploy:GetApplicationRevision
                  - codedeploy:GetDeployment
                  - codedeploy:GetDeploymentConfig
                  - codedeploy:RegisterApplicationRevision
                Resource: '*'
              - Effect: Allow
                Action:
                  - s3:GetObject
                  - s3:GetObjectVersion
                  - s3:PutObject
                Resource: !Sub '${ArtifactStoreBucket.Arn}/*'
```

### Manual Approval Stage

```yaml
- Name: Approval
  Actions:
    - Name: ManualApproval
      ActionTypeId:
        Category: Approval
        Owner: AWS
        Provider: Manual
        Version: '1'
      Configuration:
        CustomData: 'Please review and approve deployment to production'
        NotificationArn: !Ref ApprovalSNSTopic
```

### Multi-Stage Pipeline

```yaml
Stages:
  - Name: Source
    Actions:
      - Name: SourceAction
        # ... CodeCommit source

  - Name: Build
    Actions:
      - Name: BuildAction
        # ... CodeBuild

  - Name: UnitTest
    Actions:
      - Name: UnitTestAction
        # ... CodeBuild unit tests

  - Name: IntegrationTest
    Actions:
      - Name: IntegrationTestAction
        # ... CodeBuild integration tests

  - Name: DeployStaging
    Actions:
      - Name: DeployToStaging
        # ... CodeDeploy to staging

  - Name: ApprovalForProduction
    Actions:
      - Name: ManualApproval
        ActionTypeId:
          Category: Approval
          Owner: AWS
          Provider: Manual
          Version: '1'

  - Name: DeployProduction
    Actions:
      - Name: DeployToProduction
        # ... CodeDeploy to production
```

### Parallel Actions

```yaml
- Name: Test
  Actions:
    - Name: UnitTests
      ActionTypeId:
        Category: Test
        Owner: AWS
        Provider: CodeBuild
        Version: '1'
      Configuration:
        ProjectName: unit-tests
      RunOrder: 1

    - Name: IntegrationTests
      ActionTypeId:
        Category: Test
        Owner: AWS
        Provider: CodeBuild
        Version: '1'
      Configuration:
        ProjectName: integration-tests
      RunOrder: 1  # Same RunOrder = parallel execution

    - Name: SecurityScan
      ActionTypeId:
        Category: Test
        Owner: AWS
        Provider: CodeBuild
        Version: '1'
      Configuration:
        ProjectName: security-scan
      RunOrder: 1
```

### Pipeline with Lambda Action

```yaml
- Name: CustomValidation
  Actions:
    - Name: ValidateWithLambda
      ActionTypeId:
        Category: Invoke
        Owner: AWS
        Provider: Lambda
        Version: '1'
      Configuration:
        FunctionName: validate-deployment
        UserParameters: '{"environment": "staging"}'
      InputArtifacts:
        - Name: BuildOutput
```

---

## AWS CodeArtifact

### What is CodeArtifact?

Artifact repository service für:

- npm (Node.js)
- PyPI (Python)
- Maven (Java)
- NuGet (.NET)

### Creating a Repository

```bash
# Create domain
aws codeartifact create-domain \
    --domain my-company \
    --region eu-central-1

# Create repository
aws codeartifact create-repository \
    --domain my-company \
    --repository my-app-repo \
    --region eu-central-1
```

### Connect upstream (npm registry)

```bash
aws codeartifact associate-external-connection \
    --domain my-company \
    --repository my-app-repo \
    --external-connection public:npmjs
```

### Using CodeArtifact with npm

**Get authentication token:**

```bash
export CODEARTIFACT_AUTH_TOKEN=$(aws codeartifact get-authorization-token \
    --domain my-company \
    --query authorizationToken \
    --output text)

# Configure npm
npm config set registry https://my-company-123456789012.d.codeartifact.eu-central-1.amazonaws.com/npm/my-app-repo/

npm config set //my-company-123456789012.d.codeartifact.eu-central-1.amazonaws.com/npm/my-app-repo/:_authToken=${CODEARTIFACT_AUTH_TOKEN}
```

**In buildspec.yml:**

```yaml
phases:
  pre_build:
    commands:
      - export CODEARTIFACT_AUTH_TOKEN=$(aws codeartifact get-authorization-token --domain my-company --query authorizationToken --output text)
      - npm config set registry https://my-company-123456789012.d.codeartifact.eu-central-1.amazonaws.com/npm/my-app-repo/
      - npm config set //my-company-123456789012.d.codeartifact.eu-central-1.amazonaws.com/npm/my-app-repo/:_authToken=${CODEARTIFACT_AUTH_TOKEN}
  
  build:
    commands:
      - npm ci
      - npm run build
```

### Publish Package

```bash
# Publish to CodeArtifact
npm publish
```

### Using with Maven

**pom.xml:**

```xml
<repositories>
  <repository>
    <id>my-company-my-app-repo</id>
    <url>https://my-company-123456789012.d.codeartifact.eu-central-1.amazonaws.com/maven/my-app-repo/</url>
  </repository>
</repositories>

<distributionManagement>
  <repository>
    <id>my-company-my-app-repo</id>
    <url>https://my-company-123456789012.d.codeartifact.eu-central-1.amazonaws.com/maven/my-app-repo/</url>
  </repository>
</distributionManagement>
```

**~/.m2/settings.xml:**

```xml
<settings>
  <servers>
    <server>
      <id>my-company-my-app-repo</id>
      <username>aws</username>
      <password>${env.CODEARTIFACT_AUTH_TOKEN}</password>
    </server>
  </servers>
</settings>
```

---

## IAM Permissions & Security

### CodePipeline Service Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "codecommit:GetBranch",
        "codecommit:GetCommit",
        "codecommit:UploadArchive"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "codedeploy:CreateDeployment",
        "codedeploy:GetDeployment",
        "codedeploy:GetDeploymentConfig",
        "codedeploy:GetApplicationRevision",
        "codedeploy:RegisterApplicationRevision"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::codepipeline-artifacts-*/*"
    }
  ]
}
```

### CodeBuild Service Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::codepipeline-artifacts-*/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "codecommit:GitPull"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    }
  ]
}
```

### CodeDeploy Service Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeInstanceStatus",
        "ec2:TerminateInstances",
        "tag:GetResources",
        "autoscaling:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion"
      ],
      "Resource": "arn:aws:s3:::codepipeline-artifacts-*/*"
    }
  ]
}
```

### EC2 Instance Role (for CodeDeploy Agent)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::aws-codedeploy-*/*",
        "arn:aws:s3:::codepipeline-artifacts-*/*"
      ]
    }
  ]
}
```

### Secrets Management

**Using AWS Secrets Manager in buildspec.yml:**

```yaml
phases:
  pre_build:
    commands:
      - export DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id prod/db/password --query SecretString --output text)
  
  build:
    commands:
      - echo "Building with secured credentials..."
```

**Using Parameter Store:**

```yaml
phases:
  pre_build:
    commands:
      - export API_KEY=$(aws ssm get-parameter --name /prod/api-key --with-decryption --query Parameter.Value --output text)
```

---

## Container Deployments

### Complete ECS Pipeline

#### 1. Create ECR Repository

```bash
aws ecr create-repository \
    --repository-name my-app \
    --region eu-central-1
```

#### 2. buildspec.yml for Docker

```yaml
version: 0.2

env:
  variables:
    AWS_REGION: eu-central-1
    ECR_REGISTRY: 123456789012.dkr.ecr.eu-central-1.amazonaws.com
    IMAGE_REPO_NAME: my-app

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
      - REPOSITORY_URI=$ECR_REGISTRY/$IMAGE_REPO_NAME
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
      - echo "Image tag:" $IMAGE_TAG

  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $REPOSITORY_URI:latest .
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG

  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"my-app-container","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json
      - cat imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
```

#### 3. ECS Task Definition

**task-definition.json:**

```json
{
  "family": "my-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "my-app-container",
      "image": "123456789012.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-app",
          "awslogs-region": "eu-central-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### 4. CodePipeline with ECS Deploy

**Via AWS Console:**

1. Source: CodeCommit
2. Build: CodeBuild (outputs `imagedefinitions.json`)
3. Deploy: Amazon ECS
   - Cluster: `my-app-cluster`
   - Service: `my-app-service`
   - Image definitions file: `imagedefinitions.json`

**CloudFormation:**

```yaml
- Name: DeployECS
  Actions:
    - Name: DeployToECS
      ActionTypeId:
        Category: Deploy
        Owner: AWS
        Provider: ECS
        Version: '1'
      Configuration:
        ClusterName: my-app-cluster
        ServiceName: my-app-service
        FileName: imagedefinitions.json
      InputArtifacts:
        - Name: BuildOutput
```

---

## Lambda Deployments

### Lambda Deployment Pipeline

#### 1. Lambda Function Code Structure

```text
my-lambda/
├── src/
│   └── index.js
├── package.json
├── buildspec.yml
└── appspec.yml
```

**src/index.js:**

```javascript
exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from Lambda!',
            version: process.env.VERSION || '1.0.0'
        })
    };
};
```

#### 2. buildspec.yml for Lambda

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
  
  pre_build:
    commands:
      - echo Installing dependencies...
      - npm ci --production
  
  build:
    commands:
      - echo Packaging Lambda function...
      - zip -r lambda-deployment.zip src/ node_modules/
  
  post_build:
    commands:
      - echo Build completed
      - aws lambda update-function-code --function-name my-lambda-function --zip-file fileb://lambda-deployment.zip

artifacts:
  files:
    - lambda-deployment.zip
    - appspec.yml
```

#### 3. appspec.yml for Lambda

```yaml
version: 0.0
Resources:
  - MyLambdaFunction:
      Type: AWS::Lambda::Function
      Properties:
        Name: my-lambda-function
        Alias: live
        CurrentVersion: 1
        TargetVersion: 2

Hooks:
  - BeforeAllowTraffic: "PreTrafficHook"
  - AfterAllowTraffic: "PostTrafficHook"
```

#### 4. Pre/Post Traffic Hooks

**PreTrafficHook Lambda:**

```javascript
const AWS = require('aws-sdk');
const codedeploy = new AWS.CodeDeploy();

exports.handler = async (event) => {
    console.log('PreTraffic Hook - Validating new version');
    
    const { deploymentId, lifecycleEventHookExecutionId } = event;
    
    try {
        // Perform validation tests
        // Call new Lambda version endpoint
        // Check if it responds correctly
        
        await codedeploy.putLifecycleEventHookExecutionStatus({
            deploymentId,
            lifecycleEventHookExecutionId,
            status: 'Succeeded'
        }).promise();
        
        return 'Validation succeeded';
    } catch (error) {
        console.error('Validation failed:', error);
        
        await codedeploy.putLifecycleEventHookExecutionStatus({
            deploymentId,
            lifecycleEventHookExecutionId,
            status: 'Failed'
        }).promise();
        
        throw error;
    }
};
```

#### 5. CodePipeline for Lambda

```yaml
Stages:
  - Name: Source
    Actions:
      - Name: SourceAction
        ActionTypeId:
          Category: Source
          Owner: AWS
          Provider: CodeCommit
          Version: '1'
        Configuration:
          RepositoryName: my-lambda
          BranchName: main
        OutputArtifacts:
          - Name: SourceOutput

  - Name: Build
    Actions:
      - Name: BuildAction
        ActionTypeId:
          Category: Build
          Owner: AWS
          Provider: CodeBuild
          Version: '1'
        Configuration:
          ProjectName: my-lambda-build
        InputArtifacts:
          - Name: SourceOutput
        OutputArtifacts:
          - Name: BuildOutput

  - Name: Deploy
    Actions:
      - Name: DeployLambda
        ActionTypeId:
          Category: Deploy
          Owner: AWS
          Provider: CodeDeployToLambda
          Version: '1'
        Configuration:
          ApplicationName: my-lambda-app
          DeploymentGroupName: my-lambda-deployment-group
        InputArtifacts:
          - Name: BuildOutput
```

---

## Advanced Pipeline Patterns

### Multi-Region Deployment

```yaml
Stages:
  - Name: Source
    Actions:
      - Name: SourceAction
        # ... CodeCommit

  - Name: Build
    Actions:
      - Name: BuildAction
        # ... CodeBuild

  - Name: DeployEUCentral1
    Actions:
      - Name: DeployEUCentral
        ActionTypeId:
          Category: Deploy
          Owner: AWS
          Provider: CodeDeploy
          Version: '1'
        Configuration:
          ApplicationName: my-app
          DeploymentGroupName: eu-central-1-deployment-group
        Region: eu-central-1
        InputArtifacts:
          - Name: BuildOutput

  - Name: DeployUSEast1
    Actions:
      - Name: DeployUSEast
        ActionTypeId:
          Category: Deploy
          Owner: AWS
          Provider: CodeDeploy
          Version: '1'
        Configuration:
          ApplicationName: my-app
          DeploymentGroupName: us-east-1-deployment-group
        Region: us-east-1
        InputArtifacts:
          - Name: BuildOutput
```

### Cross-Account Deployment

**Setup:**

1. Source account has CodePipeline
2. Target account has deployment resources
3. Cross-account IAM roles configured

**pipeline.yaml:**

```yaml
- Name: DeployToTargetAccount
  Actions:
    - Name: DeployAction
      ActionTypeId:
        Category: Deploy
        Owner: AWS
        Provider: CodeDeploy
        Version: '1'
      Configuration:
        ApplicationName: my-app
        DeploymentGroupName: deployment-group
        RoleArn: arn:aws:iam::TARGET_ACCOUNT_ID:role/CodePipelineDeployRole
      InputArtifacts:
        - Name: BuildOutput
```

### Conditional Deployments (via Lambda)

```yaml
- Name: CheckConditions
  Actions:
    - Name: EvaluateDeployment
      ActionTypeId:
        Category: Invoke
        Owner: AWS
        Provider: Lambda
        Version: '1'
      Configuration:
        FunctionName: evaluate-deployment-conditions
        UserParameters: |
          {
            "environment": "production",
            "requireApproval": true
          }
      InputArtifacts:
        - Name: BuildOutput
      OutputArtifacts:
        - Name: EvaluationOutput
```

**Lambda function:**

```javascript
exports.handler = async (event) => {
    const userParams = JSON.parse(event['CodePipeline.job'].data.actionConfiguration.configuration.UserParameters);
    
    // Check conditions (e.g., business hours, deployment window)
    const isBusinessHours = checkBusinessHours();
    
    if (!isBusinessHours && userParams.requireApproval) {
        // Fail the action
        await putJobFailure('Deployment outside business hours');
        return;
    }
    
    // Success
    await putJobSuccess('Conditions met');
};
```

### Blue/Green Deployment with Auto Rollback

```yaml
# CodeDeploy Deployment Config
DeploymentConfigName: BlueGreenWithAutoRollback

BlueGreenDeploymentConfiguration:
  TerminateBlueInstancesOnDeploymentSuccess:
    Action: TERMINATE
    TerminationWaitTimeInMinutes: 5
  
  DeploymentReadyOption:
    ActionOnTimeout: CONTINUE_DEPLOYMENT
    WaitTimeInMinutes: 0
  
  GreenFleetProvisioningOption:
    Action: COPY_AUTO_SCALING_GROUP

AutoRollbackConfiguration:
  Enabled: true
  Events:
    - DEPLOYMENT_FAILURE
    - DEPLOYMENT_STOP_ON_ALARM

AlarmConfiguration:
  Enabled: true
  Alarms:
    - Name: HighErrorRate
    - Name: HighLatency
```

---

## Monitoring & Notifications

### CloudWatch Events for Pipeline

**EventBridge Rule:**

```json
{
  "source": ["aws.codepipeline"],
  "detail-type": ["CodePipeline Pipeline Execution State Change"],
  "detail": {
    "state": ["FAILED", "SUCCEEDED"],
    "pipeline": ["my-app-pipeline"]
  }
}
```

**Target: SNS Topic**

```bash
aws sns create-topic --name codepipeline-notifications

aws sns subscribe \
    --topic-arn arn:aws:sns:eu-central-1:123456789012:codepipeline-notifications \
    --protocol email \
    --notification-endpoint your-email@example.com
```

### CloudWatch Logs for CodeBuild

**buildspec.yml:**

```yaml
version: 0.2

phases:
  build:
    commands:
      - echo "Build started"
      - npm run build

# Logs automatically sent to CloudWatch Logs
```

**View logs:**

```bash
aws logs tail /aws/codebuild/my-app-build --follow
```

### CodePipeline Notifications

**Via AWS Console:**

1. CodePipeline → Pipelines → my-app-pipeline → Settings → Notifications
2. Create notification rule
3. Select events: Pipeline execution failed, succeeded, started
4. Target: SNS topic or AWS Chatbot (Slack)

**CloudFormation:**

```yaml
NotificationRule:
  Type: AWS::CodeStarNotifications::NotificationRule
  Properties:
    Name: PipelineNotifications
    DetailType: FULL
    Resource: !GetAtt Pipeline.Arn
    EventTypeIds:
      - codepipeline-pipeline-pipeline-execution-failed
      - codepipeline-pipeline-pipeline-execution-succeeded
    Targets:
      - TargetType: SNS
        TargetAddress: !Ref SNSTopic
```

### Slack Notifications via AWS Chatbot

1. AWS Chatbot → Configure client → Slack
2. Authorize Slack workspace
3. Create SNS topic
4. Subscribe Chatbot to SNS topic
5. Configure CodePipeline to send events to SNS

---

## Best Practices

### 1. Use Infrastructure as Code

```bash
# Store pipeline configuration in Git
my-app/
├── src/
├── buildspec.yml
├── appspec.yml
└── infrastructure/
    ├── pipeline.yaml (CloudFormation)
    └── iam-roles.yaml
```

### 2. Implement Caching

```yaml
cache:
  paths:
    - 'node_modules/**/*'
    - '/root/.m2/**/*'
    - '/root/.gradle/caches/**/*'
```

### 3. Use Secrets Manager

```yaml
phases:
  pre_build:
    commands:
      - export DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id prod/db/password --query SecretString --output text)
```

### 4. Implement Manual Approvals for Production

```yaml
- Name: ApprovalForProduction
  Actions:
    - Name: ManualApproval
      ActionTypeId:
        Category: Approval
        Owner: AWS
        Provider: Manual
        Version: '1'
      Configuration:
        CustomData: "Please review staging deployment before approving production"
```

### 5. Use Blue/Green Deployments

- Zero-downtime deployments
- Easy rollback
- Automatic traffic shifting

### 6. Monitor and Alert

- CloudWatch Alarms on pipeline failures
- SNS notifications for critical events
- CloudWatch Logs for debugging

### 7. Implement Automated Testing

```yaml
- Name: Test
  Actions:
    - Name: UnitTests
      # ... CodeBuild unit tests
    
    - Name: IntegrationTests
      # ... CodeBuild integration tests
    
    - Name: SecurityScan
      # ... CodeBuild security scanning
```

### 8. Tag Resources

```bash
aws codepipeline tag-resource \
    --resource-arn arn:aws:codepipeline:eu-central-1:123456789012:my-app-pipeline \
    --tags key=Environment,value=Production key=Team,value=DevOps
```

### 9. Use Parameter Store for Configuration

```yaml
phases:
  pre_build:
    commands:
      - export API_ENDPOINT=$(aws ssm get-parameter --name /prod/api-endpoint --query Parameter.Value --output text)
```

### 10. Implement Cost Optimization

- Use caching to reduce build times
- Clean up old artifacts in S3
- Use spot instances for self-hosted agents
- Monitor CodeBuild usage

---

## Troubleshooting

### Pipeline Stuck in Progress

**Check:**

1. CloudWatch Logs for CodeBuild
2. CodeDeploy deployment status
3. Manual approval waiting

```bash
# View pipeline execution
aws codepipeline get-pipeline-execution \
    --pipeline-name my-app-pipeline \
    --pipeline-execution-id EXECUTION_ID
```

### CodeBuild Build Failing

**Enable debug logging:**

```bash
# Set environment variable in CodeBuild project
CODEBUILD_DEBUG_SESSION=true
```

**Check logs:**

```bash
aws logs tail /aws/codebuild/my-app-build --follow
```

### CodeDeploy Deployment Failing

**Check agent logs on EC2:**

```bash
# Amazon Linux / RHEL
sudo tail -f /var/log/aws/codedeploy-agent/codedeploy-agent.log

# Ubuntu
sudo tail -f /var/log/aws/codedeploy-agent/codedeploy-agent.log
```

**Common issues:**

- CodeDeploy agent not running: `sudo service codedeploy-agent restart`
- Missing IAM permissions on EC2 instance
- AppSpec file errors
- Script permissions (chmod +x)

### Permission Denied Errors

**Check IAM roles:**

- CodePipeline service role
- CodeBuild service role
- CodeDeploy service role
- EC2 instance role

**Validate policies:**

```bash
aws iam simulate-principal-policy \
    --policy-source-arn arn:aws:iam::123456789012:role/CodeBuildServiceRole \
    --action-names s3:GetObject \
    --resource-arns arn:aws:s3:::codepipeline-artifacts-bucket/*
```

### Artifact Not Found

**Verify artifact output:**

```yaml
artifacts:
  files:
    - '**/*'  # Include all files
  name: BuildArtifact
```

**Check S3 bucket:**

```bash
aws s3 ls s3://codepipeline-artifacts-bucket/ --recursive
```

---

## Example Pipelines

### Complete Node.js Application Pipeline

**Directory structure:**

```text
my-node-app/
├── src/
│   └── index.js
├── tests/
│   └── app.test.js
├── scripts/
│   ├── stop_server.sh
│   ├── install_dependencies.sh
│   ├── start_server.sh
│   └── validate_service.sh
├── package.json
├── buildspec.yml
├── appspec.yml
└── Dockerfile
```

**buildspec.yml:**

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
  
  pre_build:
    commands:
      - echo Installing dependencies...
      - npm ci
  
  build:
    commands:
      - echo Running linter...
      - npm run lint
      - echo Running tests...
      - npm test
      - echo Building application...
      - npm run build
  
  post_build:
    commands:
      - echo Packaging application...
      - zip -r app.zip dist/ node_modules/ package.json scripts/ appspec.yml

artifacts:
  files:
    - app.zip
    - appspec.yml

cache:
  paths:
    - 'node_modules/**/*'

reports:
  jest_reports:
    files:
      - 'coverage/clover.xml'
    file-format: CLOVERXML
```

**appspec.yml:**

```yaml
version: 0.0
os: linux
files:
  - source: /
    destination: /var/www/myapp

permissions:
  - object: /var/www/myapp
    owner: ec2-user
    group: ec2-user
    mode: 755
    type:
      - directory
  - object: /var/www/myapp
    owner: ec2-user
    group: ec2-user
    mode: 644
    type:
      - file

hooks:
  ApplicationStop:
    - location: scripts/stop_server.sh
      timeout: 300
      runas: ec2-user

  BeforeInstall:
    - location: scripts/install_dependencies.sh
      timeout: 600
      runas: ec2-user

  ApplicationStart:
    - location: scripts/start_server.sh
      timeout: 300
      runas: ec2-user

  ValidateService:
    - location: scripts/validate_service.sh
      timeout: 300
      runas: ec2-user
```

**scripts/stop_server.sh:**

```bash
#!/bin/bash
echo "Stopping Node.js application..."
pm2 stop myapp || true
```

**scripts/install_dependencies.sh:**

```bash
#!/bin/bash
echo "Installing dependencies..."
cd /var/www/myapp
npm ci --production
```

**scripts/start_server.sh:**

```bash
#!/bin/bash
echo "Starting Node.js application..."
cd /var/www/myapp
pm2 start dist/index.js --name myapp
```

**scripts/validate_service.sh:**

```bash
#!/bin/bash
echo "Validating service..."
sleep 5
curl -f http://localhost:3000/health || exit 1
echo "Service is running successfully"
```

### Python Flask Application with Docker

**buildspec.yml:**

```yaml
version: 0.2

env:
  variables:
    AWS_REGION: eu-central-1
    ECR_REGISTRY: 123456789012.dkr.ecr.eu-central-1.amazonaws.com
    IMAGE_REPO_NAME: flask-app

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
      - REPOSITORY_URI=$ECR_REGISTRY/$IMAGE_REPO_NAME
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
  
  build:
    commands:
      - echo Build started on `date`
      - echo Running tests...
      - docker build -t test-image -f Dockerfile.test .
      - docker run --rm test-image pytest
      - echo Building production image...
      - docker build -t $REPOSITORY_URI:latest .
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG
  
  post_build:
    commands:
      - echo Build completed on `date`
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - printf '[{"name":"flask-app-container","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
```

**Dockerfile:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

**Dockerfile.test:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt requirements-dev.txt ./
RUN pip install --no-cache-dir -r requirements.txt -r requirements-dev.txt

COPY . .

CMD ["pytest"]
```

---

## Resources

- **AWS CodePipeline Documentation:** [https://docs.aws.amazon.com/codepipeline/](https://docs.aws.amazon.com/codepipeline/)
- **AWS CodeBuild Documentation:** [https://docs.aws.amazon.com/codebuild/](https://docs.aws.amazon.com/codebuild/)
- **AWS CodeDeploy Documentation:** [https://docs.aws.amazon.com/codedeploy/](https://docs.aws.amazon.com/codedeploy/)
- **AWS CodeCommit Documentation:** [https://docs.aws.amazon.com/codecommit/](https://docs.aws.amazon.com/codecommit/)
- **AWS CodeArtifact Documentation:** [https://docs.aws.amazon.com/codeartifact/](https://docs.aws.amazon.com/codeartifact/)
- **Buildspec Reference:** [https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html)
- **AppSpec Reference:** [https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html)

---

**Note:** All examples use `eu-central-1` (Frankfurt) as the region. Adjust the region according to your requirements.
