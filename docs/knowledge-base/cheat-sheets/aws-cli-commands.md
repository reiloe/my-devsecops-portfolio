---
title: ☁️ AWS CLI Commands
sidebar_label: AWS CLI
sidebar_position: 1
tags: [aws, aws-cli, cloud, infrastructure, cheat-sheet]
---

# ☁️ AWS CLI Commands Cheat Sheet

A comprehensive reference of the most important AWS CLI commands for cloud administrators and DevOps engineers.

## Table of Contents

1. [AWS CLI Setup & Configuration](#aws-cli-setup--configuration)
2. [IAM (Identity and Access Management)](#iam-identity-and-access-management)
3. [EC2 (Elastic Compute Cloud)](#ec2-elastic-compute-cloud)
4. [S3 (Simple Storage Service)](#s3-simple-storage-service)
5. [VPC (Virtual Private Cloud)](#vpc-virtual-private-cloud)
6. [Lambda](#lambda)
7. [ECS (Elastic Container Service)](#ecs-elastic-container-service)
8. [ECR (Elastic Container Registry)](#ecr-elastic-container-registry)
9. [RDS (Relational Database Service)](#rds-relational-database-service)
10. [DynamoDB](#dynamodb)
11. [CloudFormation](#cloudformation)
12. [CloudWatch](#cloudwatch)
13. [Route 53](#route-53)
14. [ELB (Elastic Load Balancing)](#elb-elastic-load-balancing)
15. [Auto Scaling](#auto-scaling)
16. [SNS (Simple Notification Service)](#sns-simple-notification-service)
17. [SQS (Simple Queue Service)](#sqs-simple-queue-service)
18. [Secrets Manager](#secrets-manager)
19. [Systems Manager (SSM)](#systems-manager-ssm)
20. [CloudTrail](#cloudtrail)

---

## AWS CLI Setup & Configuration

### Installation

```bash
# macOS (via Homebrew)
brew install awscli

# Linux (via pip)
pip3 install awscli --upgrade --user

# Linux (via package manager)
sudo apt install awscli  # Debian/Ubuntu
sudo yum install awscli  # RHEL/CentOS

# Verify installation
aws --version
```

### Configuration

```bash
# Interactive configuration (recommended for first setup)
aws configure

# Configuration for specific profile
aws configure --profile myprofile

# Show configuration
aws configure list
aws configure list --profile myprofile

# Set credentials directly
aws configure set aws_access_key_id YOUR_ACCESS_KEY
aws configure set aws_secret_access_key YOUR_SECRET_KEY
aws configure set default.region eu-central-1
aws configure set default.output json

# List all configured profiles
aws configure list-profiles

# Work with specific profile
aws s3 ls --profile myprofile

# Or set environment variable
export AWS_PROFILE=myprofile
```

### Regions & Availability Zones

```bash
# Show all available regions
aws ec2 describe-regions --output table

# Show Availability Zones of a region
aws ec2 describe-availability-zones --region eu-central-1

# Show current region
aws configure get region
```

### Output Formats

```bash
# JSON (default)
aws ec2 describe-instances --output json

# Table
aws ec2 describe-instances --output table

# Text
aws ec2 describe-instances --output text

# YAML
aws ec2 describe-instances --output yaml
```

---

## IAM (Identity and Access Management)

### Users

```bash
# List all users
aws iam list-users

# Create user
aws iam create-user --user-name john-doe

# Delete user
aws iam delete-user --user-name john-doe

# Show user details
aws iam get-user --user-name john-doe

# Create access keys for user
aws iam create-access-key --user-name john-doe

# List access keys
aws iam list-access-keys --user-name john-doe

# Delete access key
aws iam delete-access-key --user-name john-doe --access-key-id AKIAIOSFODNN7EXAMPLE
```

### Groups

```bash
# List all groups
aws iam list-groups

# Create group
aws iam create-group --group-name developers

# Delete group
aws iam delete-group --group-name developers

# Add user to group
aws iam add-user-to-group --user-name john-doe --group-name developers

# Remove user from group
aws iam remove-user-from-group --user-name john-doe --group-name developers

# Show groups of a user
aws iam list-groups-for-user --user-name john-doe
```

### Roles

```bash
# List all roles
aws iam list-roles

# Create role
aws iam create-role --role-name MyRole --assume-role-policy-document file://trust-policy.json

# Delete role
aws iam delete-role --role-name MyRole

# Show role details
aws iam get-role --role-name MyRole

# Attach policy to role
aws iam attach-role-policy --role-name MyRole --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

### Policies

```bash
# List all policies
aws iam list-policies

# List managed policies
aws iam list-policies --scope AWS

# List custom policies
aws iam list-policies --scope Local

# Create policy
aws iam create-policy --policy-name MyPolicy --policy-document file://policy.json

# Delete policy
aws iam delete-policy --policy-arn arn:aws:iam::123456789012:policy/MyPolicy

# Show policy details
aws iam get-policy --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# Show policy version
aws iam get-policy-version --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess --version-id v1

# Attach policy to user
aws iam attach-user-policy --user-name john-doe --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# Detach policy from user
aws iam detach-user-policy --user-name john-doe --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

---

## EC2 (Elastic Compute Cloud)

### Instances

```bash
# List all instances
aws ec2 describe-instances

# Only running instances
aws ec2 describe-instances --filters "Name=instance-state-name,Values=running"

# Instance details by ID
aws ec2 describe-instances --instance-ids i-1234567890abcdef0

# Start instance
aws ec2 start-instances --instance-ids i-1234567890abcdef0

# Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# Reboot instance
aws ec2 reboot-instances --instance-ids i-1234567890abcdef0

# Terminate instance
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0

# Create instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name MyKeyPair \
  --security-group-ids sg-903004f8 \
  --subnet-id subnet-6e7f829e \
  --count 1 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=MyInstance}]'

# Instance status
aws ec2 describe-instance-status --instance-ids i-1234567890abcdef0
```

### AMIs (Amazon Machine Images)

```bash
# List all AMIs (own)
aws ec2 describe-images --owners self

# Search public AMIs
aws ec2 describe-images --owners amazon --filters "Name=name,Values=amzn2-ami-hvm-*"

# Create AMI
aws ec2 create-image --instance-id i-1234567890abcdef0 --name "My Server Backup"

# Delete AMI
aws ec2 deregister-image --image-id ami-1234567890abcdef0
```

### Key Pairs

```bash
# List all key pairs
aws ec2 describe-key-pairs

# Create key pair
aws ec2 create-key-pair --key-name MyKeyPair --query 'KeyMaterial' --output text > MyKeyPair.pem

# Delete key pair
aws ec2 delete-key-pair --key-name MyKeyPair
```

### Security Groups

```bash
# List all security groups
aws ec2 describe-security-groups

# Create security group
aws ec2 create-security-group --group-name MySecurityGroup --description "My security group" --vpc-id vpc-1a2b3c4d

# Delete security group
aws ec2 delete-security-group --group-id sg-903004f8

# Add inbound rule (SSH)
aws ec2 authorize-security-group-ingress \
  --group-id sg-903004f8 \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

# Add inbound rule (HTTP)
aws ec2 authorize-security-group-ingress \
  --group-id sg-903004f8 \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Remove inbound rule
aws ec2 revoke-security-group-ingress \
  --group-id sg-903004f8 \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0
```

### Volumes (EBS)

```bash
# List all volumes
aws ec2 describe-volumes

# Create volume
aws ec2 create-volume --size 10 --availability-zone eu-central-1a --volume-type gp2

# Delete volume
aws ec2 delete-volume --volume-id vol-049df61146c4d7901

# Attach volume to instance
aws ec2 attach-volume --volume-id vol-049df61146c4d7901 --instance-id i-1234567890abcdef0 --device /dev/sdf

# Detach volume from instance
aws ec2 detach-volume --volume-id vol-049df61146c4d7901

# Create snapshot
aws ec2 create-snapshot --volume-id vol-049df61146c4d7901 --description "My snapshot"

# List snapshots
aws ec2 describe-snapshots --owner-ids self

# Delete snapshot
aws ec2 delete-snapshot --snapshot-id snap-1234567890abcdef0
```

### Elastic IPs

```bash
# Allocate Elastic IP
aws ec2 allocate-address --domain vpc

# List Elastic IPs
aws ec2 describe-addresses

# Associate Elastic IP with instance
aws ec2 associate-address --instance-id i-1234567890abcdef0 --allocation-id eipalloc-64d5890a

# Disassociate Elastic IP from instance
aws ec2 disassociate-address --association-id eipassoc-2bebb745

# Release Elastic IP
aws ec2 release-address --allocation-id eipalloc-64d5890a
```

---

## S3 (Simple Storage Service)

### Buckets

```bash
# List all buckets
aws s3 ls

# Create bucket
aws s3 mb s3://my-bucket-name

# Delete bucket (must be empty)
aws s3 rb s3://my-bucket-name

# Delete bucket (with content)
aws s3 rb s3://my-bucket-name --force

# Show bucket content
aws s3 ls s3://my-bucket-name

# Recursively show all objects
aws s3 ls s3://my-bucket-name --recursive

# With size information
aws s3 ls s3://my-bucket-name --recursive --human-readable --summarize
```

### Objects upload/download

```bash
# Upload file
aws s3 cp file.txt s3://my-bucket-name/

# Upload file to subfolder
aws s3 cp file.txt s3://my-bucket-name/folder/

# Download file
aws s3 cp s3://my-bucket-name/file.txt ./

# Upload folder recursively
aws s3 cp ./local-folder s3://my-bucket-name/remote-folder --recursive

# Download folder recursively
aws s3 cp s3://my-bucket-name/remote-folder ./local-folder --recursive

# Synchronize (only changed files)
aws s3 sync ./local-folder s3://my-bucket-name/remote-folder

# Synchronize (download)
aws s3 sync s3://my-bucket-name/remote-folder ./local-folder

# Delete object
aws s3 rm s3://my-bucket-name/file.txt

# Delete all objects in prefix
aws s3 rm s3://my-bucket-name/folder/ --recursive

# Move object
aws s3 mv s3://my-bucket-name/old-file.txt s3://my-bucket-name/new-file.txt
```

### Bucket Policies & ACLs

```bash
# Show bucket policy
aws s3api get-bucket-policy --bucket my-bucket-name

# Set bucket policy
aws s3api put-bucket-policy --bucket my-bucket-name --policy file://policy.json

# Delete bucket policy
aws s3api delete-bucket-policy --bucket my-bucket-name

# Show bucket ACL
aws s3api get-bucket-acl --bucket my-bucket-name

# Block public access
aws s3api put-public-access-block \
  --bucket my-bucket-name \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### Versioning & Lifecycle

```bash
# Enable versioning
aws s3api put-bucket-versioning --bucket my-bucket-name --versioning-configuration Status=Enabled

# Show versioning status
aws s3api get-bucket-versioning --bucket my-bucket-name

# List all versions
aws s3api list-object-versions --bucket my-bucket-name

# Set lifecycle policy
aws s3api put-bucket-lifecycle-configuration --bucket my-bucket-name --lifecycle-configuration file://lifecycle.json

# Show lifecycle policy
aws s3api get-bucket-lifecycle-configuration --bucket my-bucket-name
```

### Static Website Hosting

```bash
# Enable website hosting
aws s3 website s3://my-bucket-name/ --index-document index.html --error-document error.html

# Show website configuration
aws s3api get-bucket-website --bucket my-bucket-name

# Disable website hosting
aws s3api delete-bucket-website --bucket my-bucket-name
```

---

## VPC (Virtual Private Cloud)

### VPCs

```bash
# List all VPCs
aws ec2 describe-vpcs

# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Delete VPC
aws ec2 delete-vpc --vpc-id vpc-1a2b3c4d

# Show VPC details
aws ec2 describe-vpcs --vpc-ids vpc-1a2b3c4d
```

### Subnets

```bash
# List all subnets
aws ec2 describe-subnets

# Create subnet
aws ec2 create-subnet --vpc-id vpc-1a2b3c4d --cidr-block 10.0.1.0/24 --availability-zone eu-central-1a

# Delete subnet
aws ec2 delete-subnet --subnet-id subnet-6e7f829e

# Show subnets of a VPC
aws ec2 describe-subnets --filters "Name=vpc-id,Values=vpc-1a2b3c4d"
```

### Internet Gateway

```bash
# Create Internet Gateway
aws ec2 create-internet-gateway

# Attach Internet Gateway to VPC
aws ec2 attach-internet-gateway --internet-gateway-id igw-1a2b3c4d --vpc-id vpc-1a2b3c4d

# Detach Internet Gateway from VPC
aws ec2 detach-internet-gateway --internet-gateway-id igw-1a2b3c4d --vpc-id vpc-1a2b3c4d

# Delete Internet Gateway
aws ec2 delete-internet-gateway --internet-gateway-id igw-1a2b3c4d
```

### Route Tables

```bash
# List route tables
aws ec2 describe-route-tables

# Create route table
aws ec2 create-route-table --vpc-id vpc-1a2b3c4d

# Add route (Internet Gateway)
aws ec2 create-route --route-table-id rtb-22574640 --destination-cidr-block 0.0.0.0/0 --gateway-id igw-1a2b3c4d

# Associate subnet with route table
aws ec2 associate-route-table --route-table-id rtb-22574640 --subnet-id subnet-6e7f829e

# Delete route table
aws ec2 delete-route-table --route-table-id rtb-22574640
```

### NAT Gateway

```bash
# Create NAT Gateway
aws ec2 create-nat-gateway --subnet-id subnet-6e7f829e --allocation-id eipalloc-64d5890a

# List NAT Gateways
aws ec2 describe-nat-gateways

# Delete NAT Gateway
aws ec2 delete-nat-gateway --nat-gateway-id nat-05dba92075d71c568
```

---

## Lambda

### Functions

```bash
# List all functions
aws lambda list-functions

# Create function
aws lambda create-function \
  --function-name my-function \
  --runtime python3.9 \
  --role arn:aws:iam::123456789012:role/lambda-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://function.zip

# Update function (code)
aws lambda update-function-code \
  --function-name my-function \
  --zip-file fileb://function.zip

# Update function (configuration)
aws lambda update-function-configuration \
  --function-name my-function \
  --timeout 60 \
  --memory-size 256

# Delete function
aws lambda delete-function --function-name my-function

# Show function details
aws lambda get-function --function-name my-function

# Execute function
aws lambda invoke \
  --function-name my-function \
  --payload '{"key":"value"}' \
  response.json

# Show function logs (via CloudWatch)
aws logs tail /aws/lambda/my-function --follow
```

### Layers

```bash
# List layers
aws lambda list-layers

# Create layer
aws lambda publish-layer-version \
  --layer-name my-layer \
  --zip-file fileb://layer.zip \
  --compatible-runtimes python3.9

# Delete layer
aws lambda delete-layer-version --layer-name my-layer --version-number 1
```

### Triggers & Event Source Mappings

```bash
# Create event source mapping (SQS)
aws lambda create-event-source-mapping \
  --function-name my-function \
  --event-source-arn arn:aws:sqs:eu-central-1:123456789012:my-queue \
  --batch-size 10

# List event source mappings
aws lambda list-event-source-mappings --function-name my-function

# Delete event source mapping
aws lambda delete-event-source-mapping --uuid 12345678-1234-1234-1234-123456789012
```

---

## ECS (Elastic Container Service)

### Clusters

```bash
# List clusters
aws ecs list-clusters

# Create cluster
aws ecs create-cluster --cluster-name my-cluster

# Delete cluster
aws ecs delete-cluster --cluster my-cluster

# Cluster details
aws ecs describe-clusters --clusters my-cluster
```

### Task Definitions

```bash
# List task definitions
aws ecs list-task-definitions

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Task definition details
aws ecs describe-task-definition --task-definition my-task:1

# Deregister task definition
aws ecs deregister-task-definition --task-definition my-task:1
```

### Services

```bash
# List services of a cluster
aws ecs list-services --cluster my-cluster

# Create service
aws ecs create-service \
  --cluster my-cluster \
  --service-name my-service \
  --task-definition my-task:1 \
  --desired-count 2

# Update service
aws ecs update-service \
  --cluster my-cluster \
  --service my-service \
  --desired-count 3

# Delete service
aws ecs delete-service --cluster my-cluster --service my-service --force

# Service details
aws ecs describe-services --cluster my-cluster --services my-service
```

### Tasks

```bash
# List tasks of a cluster
aws ecs list-tasks --cluster my-cluster

# Run task
aws ecs run-task \
  --cluster my-cluster \
  --task-definition my-task:1 \
  --count 1

# Stop task
aws ecs stop-task --cluster my-cluster --task arn:aws:ecs:eu-central-1:123456789012:task/my-cluster/1234567890abcdef0

# Task details
aws ecs describe-tasks --cluster my-cluster --tasks arn:aws:ecs:eu-central-1:123456789012:task/my-cluster/1234567890abcdef0
```

---

## ECR (Elastic Container Registry)

### Repositories

```bash
# List repositories
aws ecr describe-repositories

# Create repository
aws ecr create-repository --repository-name my-app

# Delete repository
aws ecr delete-repository --repository-name my-app --force

# Login to ECR (Docker)
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.eu-central-1.amazonaws.com
```

### Images

```bash
# List images of a repository
aws ecr list-images --repository-name my-app

# Image details
aws ecr describe-images --repository-name my-app

# Delete image
aws ecr batch-delete-image \
  --repository-name my-app \
  --image-ids imageTag=latest

# Push image (after Docker login)
docker tag my-app:latest 123456789012.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest
docker push 123456789012.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest

# Pull image
docker pull 123456789012.dkr.ecr.eu-central-1.amazonaws.com/my-app:latest
```

### Lifecycle Policies

```bash
# Set lifecycle policy
aws ecr put-lifecycle-policy \
  --repository-name my-app \
  --lifecycle-policy-text file://policy.json

# Show lifecycle policy
aws ecr get-lifecycle-policy --repository-name my-app

# Delete lifecycle policy
aws ecr delete-lifecycle-policy --repository-name my-app
```

---

## RDS (Relational Database Service)

### DB Instances

```bash
# List DB instances
aws rds describe-db-instances

# Create DB instance
aws rds create-db-instance \
  --db-instance-identifier mydb \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password MyPassword123 \
  --allocated-storage 20

# Delete DB instance
aws rds delete-db-instance \
  --db-instance-identifier mydb \
  --skip-final-snapshot

# Delete DB instance with final snapshot
aws rds delete-db-instance \
  --db-instance-identifier mydb \
  --final-db-snapshot-identifier mydb-final-snapshot

# Start DB instance
aws rds start-db-instance --db-instance-identifier mydb

# Stop DB instance
aws rds stop-db-instance --db-instance-identifier mydb

# DB instance details
aws rds describe-db-instances --db-instance-identifier mydb
```

### Snapshots

```bash
# List snapshots
aws rds describe-db-snapshots

# Create snapshot
aws rds create-db-snapshot \
  --db-instance-identifier mydb \
  --db-snapshot-identifier mydb-snapshot

# Delete snapshot
aws rds delete-db-snapshot --db-snapshot-identifier mydb-snapshot

# Restore DB from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier mydb-restored \
  --db-snapshot-identifier mydb-snapshot
```

### Parameter Groups

```bash
# List parameter groups
aws rds describe-db-parameter-groups

# Create parameter group
aws rds create-db-parameter-group \
  --db-parameter-group-name myparamgroup \
  --db-parameter-group-family postgres14 \
  --description "My parameter group"

# Set parameter
aws rds modify-db-parameter-group \
  --db-parameter-group-name myparamgroup \
  --parameters "ParameterName=max_connections,ParameterValue=100,ApplyMethod=immediate"
```

---

## DynamoDB

### Tables

```bash
# List tables
aws dynamodb list-tables

# Create table
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions AttributeName=UserId,AttributeType=S \
  --key-schema AttributeName=UserId,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Delete table
aws dynamodb delete-table --table-name Users

# Table details
aws dynamodb describe-table --table-name Users
```

### Items

```bash
# Add item
aws dynamodb put-item \
  --table-name Users \
  --item '{"UserId":{"S":"user123"},"Name":{"S":"John Doe"},"Age":{"N":"30"}}'

# Get item
aws dynamodb get-item \
  --table-name Users \
  --key '{"UserId":{"S":"user123"}}'

# Update item
aws dynamodb update-item \
  --table-name Users \
  --key '{"UserId":{"S":"user123"}}' \
  --update-expression "SET Age = :age" \
  --expression-attribute-values '{":age":{"N":"31"}}'

# Delete item
aws dynamodb delete-item \
  --table-name Users \
  --key '{"UserId":{"S":"user123"}}'

# Scan all items
aws dynamodb scan --table-name Users

# Query items
aws dynamodb query \
  --table-name Users \
  --key-condition-expression "UserId = :userId" \
  --expression-attribute-values '{":userId":{"S":"user123"}}'
```

### Batch Operations

```bash
# Batch write (multiple items)
aws dynamodb batch-write-item --request-items file://items.json

# Batch get (multiple items)
aws dynamodb batch-get-item --request-items file://keys.json
```

---

## CloudFormation

### Stacks

```bash
# List stacks
aws cloudformation list-stacks

# Create stack
aws cloudformation create-stack \
  --stack-name my-stack \
  --template-body file://template.yaml \
  --parameters ParameterKey=KeyName,ParameterValue=MyKey

# Create stack with S3 template
aws cloudformation create-stack \
  --stack-name my-stack \
  --template-url https://s3.amazonaws.com/mybucket/template.yaml

# Update stack
aws cloudformation update-stack \
  --stack-name my-stack \
  --template-body file://template.yaml

# Delete stack
aws cloudformation delete-stack --stack-name my-stack

# Show stack status
aws cloudformation describe-stacks --stack-name my-stack

# Show stack events
aws cloudformation describe-stack-events --stack-name my-stack

# Show stack outputs
aws cloudformation describe-stacks --stack-name my-stack --query 'Stacks[0].Outputs'
```

### Change Sets

```bash
# Create change set
aws cloudformation create-change-set \
  --stack-name my-stack \
  --change-set-name my-changes \
  --template-body file://template.yaml

# Show change set
aws cloudformation describe-change-set \
  --stack-name my-stack \
  --change-set-name my-changes

# Execute change set
aws cloudformation execute-change-set \
  --stack-name my-stack \
  --change-set-name my-changes

# Delete change set
aws cloudformation delete-change-set \
  --stack-name my-stack \
  --change-set-name my-changes
```

### Stack Drift

```bash
# Start drift detection
aws cloudformation detect-stack-drift --stack-name my-stack

# Show drift status
aws cloudformation describe-stack-drift-detection-status --stack-drift-detection-id <detection-id>

# Show drift details
aws cloudformation describe-stack-resource-drifts --stack-name my-stack
```

---

## CloudWatch

### Logs

```bash
# List log groups
aws logs describe-log-groups

# Create log group
aws logs create-log-group --log-group-name /aws/lambda/my-function

# Delete log group
aws logs delete-log-group --log-group-name /aws/lambda/my-function

# List log streams
aws logs describe-log-streams --log-group-name /aws/lambda/my-function

# Get logs
aws logs filter-log-events --log-group-name /aws/lambda/my-function

# Filter logs with pattern
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-function \
  --filter-pattern "ERROR"

# Show logs in real-time (tail)
aws logs tail /aws/lambda/my-function --follow

# Logs between time periods
aws logs filter-log-events \
  --log-group-name /aws/lambda/my-function \
  --start-time 1609459200000 \
  --end-time 1609545600000
```

### Metrics

```bash
# List metrics
aws cloudwatch list-metrics

# List metrics of a namespace
aws cloudwatch list-metrics --namespace AWS/EC2

# Get metric statistics
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 3600 \
  --statistics Average

# Send custom metric
aws cloudwatch put-metric-data \
  --namespace MyApp \
  --metric-name RequestCount \
  --value 100
```

### Alarms

```bash
# List alarms
aws cloudwatch describe-alarms

# Create alarm
aws cloudwatch put-metric-alarm \
  --alarm-name cpu-mon \
  --alarm-description "CPU usage exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# Delete alarm
aws cloudwatch delete-alarms --alarm-names cpu-mon

# Show alarm status
aws cloudwatch describe-alarm-history --alarm-name cpu-mon
```

---

## Route 53

### Hosted Zones

```bash
# List hosted zones
aws route53 list-hosted-zones

# Create hosted zone
aws route53 create-hosted-zone \
  --name example.com \
  --caller-reference $(date +%s)

# Delete hosted zone
aws route53 delete-hosted-zone --id Z1234567890ABC

# Hosted zone details
aws route53 get-hosted-zone --id Z1234567890ABC
```

### Record Sets

```bash
# List record sets
aws route53 list-resource-record-sets --hosted-zone-id Z1234567890ABC

# Create/modify record set (via change batch)
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://change-batch.json

# Example change-batch.json for A record:
# {
#   "Changes": [{
#     "Action": "CREATE",
#     "ResourceRecordSet": {
#       "Name": "www.example.com",
#       "Type": "A",
#       "TTL": 300,
#       "ResourceRecords": [{"Value": "192.0.2.1"}]
#     }
#   }]
# }

# Delete record set
# (Same command with "Action": "DELETE")
```

### Health Checks

```bash
# List health checks
aws route53 list-health-checks

# Create health check
aws route53 create-health-check \
  --health-check-config IPAddress=192.0.2.1,Port=80,Type=HTTP,ResourcePath=/

# Delete health check
aws route53 delete-health-check --health-check-id 1234567890abc

# Health check status
aws route53 get-health-check-status --health-check-id 1234567890abc
```

---

## ELB (Elastic Load Balancing)

### Application Load Balancers (ALB)

```bash
# List load balancers
aws elbv2 describe-load-balancers

# Create ALB
aws elbv2 create-load-balancer \
  --name my-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups sg-12345678

# Delete ALB
aws elbv2 delete-load-balancer --load-balancer-arn arn:aws:elasticloadbalancing:...

# List target groups
aws elbv2 describe-target-groups

# Create target group
aws elbv2 create-target-group \
  --name my-targets \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-12345678

# Register targets
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --targets Id=i-1234567890abcdef0 Id=i-0987654321fedcba0

# Show target health
aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:...
```

### Listeners

```bash
# List listeners
aws elbv2 describe-listeners --load-balancer-arn arn:aws:elasticloadbalancing:...

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...

# Delete listener
aws elbv2 delete-listener --listener-arn arn:aws:elasticloadbalancing:...
```

---

## Auto Scaling

### Auto Scaling Groups

```bash
# List Auto Scaling groups
aws autoscaling describe-auto-scaling-groups

# Create Auto Scaling group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name my-asg \
  --launch-configuration-name my-launch-config \
  --min-size 1 \
  --max-size 5 \
  --desired-capacity 2 \
  --vpc-zone-identifier "subnet-12345678,subnet-87654321"

# Update Auto Scaling group
aws autoscaling update-auto-scaling-group \
  --auto-scaling-group-name my-asg \
  --min-size 2 \
  --max-size 10

# Delete Auto Scaling group
aws autoscaling delete-auto-scaling-group \
  --auto-scaling-group-name my-asg \
  --force-delete

# Show instances in Auto Scaling group
aws autoscaling describe-auto-scaling-instances
```

### Launch Configurations

```bash
# List launch configurations
aws autoscaling describe-launch-configurations

# Create launch configuration
aws autoscaling create-launch-configuration \
  --launch-configuration-name my-launch-config \
  --image-id ami-1234567890abcdef0 \
  --instance-type t2.micro \
  --key-name MyKeyPair \
  --security-groups sg-12345678

# Delete launch configuration
aws autoscaling delete-launch-configuration --launch-configuration-name my-launch-config
```

### Scaling Policies

```bash
# List scaling policies
aws autoscaling describe-policies

# Create scaling policy (target tracking)
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name my-asg \
  --policy-name cpu-target-tracking \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration file://config.json

# Delete scaling policy
aws autoscaling delete-policy \
  --auto-scaling-group-name my-asg \
  --policy-name cpu-target-tracking
```

---

## SNS (Simple Notification Service)

### Topics

```bash
# List topics
aws sns list-topics

# Create topic
aws sns create-topic --name my-topic

# Delete topic
aws sns delete-topic --topic-arn arn:aws:sns:eu-central-1:123456789012:my-topic

# Show topic attributes
aws sns get-topic-attributes --topic-arn arn:aws:sns:eu-central-1:123456789012:my-topic
```

### Subscriptions

```bash
# List subscriptions
aws sns list-subscriptions

# Create subscription (email)
aws sns subscribe \
  --topic-arn arn:aws:sns:eu-central-1:123456789012:my-topic \
  --protocol email \
  --notification-endpoint user@example.com

# Create subscription (SQS)
aws sns subscribe \
  --topic-arn arn:aws:sns:eu-central-1:123456789012:my-topic \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:eu-central-1:123456789012:my-queue

# Delete subscription
aws sns unsubscribe --subscription-arn arn:aws:sns:eu-central-1:123456789012:my-topic:12345678-1234-1234-1234-123456789012
```

### Publish Messages

```bash
# Send message to topic
aws sns publish \
  --topic-arn arn:aws:sns:eu-central-1:123456789012:my-topic \
  --message "Hello World"

# Message with subject
aws sns publish \
  --topic-arn arn:aws:sns:eu-central-1:123456789012:my-topic \
  --message "Hello World" \
  --subject "Test Message"

# Message from file
aws sns publish \
  --topic-arn arn:aws:sns:eu-central-1:123456789012:my-topic \
  --message file://message.txt
```

---

## SQS (Simple Queue Service)

### Queues

```bash
# List queues
aws sqs list-queues

# Create queue (standard)
aws sqs create-queue --queue-name my-queue

# Create queue (FIFO)
aws sqs create-queue --queue-name my-queue.fifo --attributes FifoQueue=true

# Delete queue
aws sqs delete-queue --queue-url https://sqs.eu-central-1.amazonaws.com/123456789012/my-queue

# Show queue attributes
aws sqs get-queue-attributes \
  --queue-url https://sqs.eu-central-1.amazonaws.com/123456789012/my-queue \
  --attribute-names All

# Get queue URL
aws sqs get-queue-url --queue-name my-queue
```

### Messages

```bash
# Send message
aws sqs send-message \
  --queue-url https://sqs.eu-central-1.amazonaws.com/123456789012/my-queue \
  --message-body "Hello World"

# Send message with attributes
aws sqs send-message \
  --queue-url https://sqs.eu-central-1.amazonaws.com/123456789012/my-queue \
  --message-body "Hello World" \
  --message-attributes '{"Priority":{"DataType":"Number","StringValue":"1"}}'

# Receive messages
aws sqs receive-message \
  --queue-url https://sqs.eu-central-1.amazonaws.com/123456789012/my-queue

# Receive multiple messages
aws sqs receive-message \
  --queue-url https://sqs.eu-central-1.amazonaws.com/123456789012/my-queue \
  --max-number-of-messages 10

# Delete message
aws sqs delete-message \
  --queue-url https://sqs.eu-central-1.amazonaws.com/123456789012/my-queue \
  --receipt-handle <receipt-handle>

# Purge queue
aws sqs purge-queue --queue-url https://sqs.eu-central-1.amazonaws.com/123456789012/my-queue
```

### Dead Letter Queues

```bash
# Set DLQ redrive policy
aws sqs set-queue-attributes \
  --queue-url https://sqs.eu-central-1.amazonaws.com/123456789012/my-queue \
  --attributes file://redrive-policy.json

# redrive-policy.json:
# {
#   "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:eu-central-1:123456789012:my-dlq\",\"maxReceiveCount\":\"3\"}"
# }
```

---

## Secrets Manager

### Secrets

```bash
# List secrets
aws secretsmanager list-secrets

# Create secret
aws secretsmanager create-secret \
  --name MySecret \
  --secret-string '{"username":"admin","password":"MyPassword123"}'

# Create secret from file
aws secretsmanager create-secret \
  --name MySecret \
  --secret-string file://secret.json

# Get secret
aws secretsmanager get-secret-value --secret-id MySecret

# Update secret
aws secretsmanager update-secret \
  --secret-id MySecret \
  --secret-string '{"username":"admin","password":"NewPassword456"}'

# Delete secret (with recovery window)
aws secretsmanager delete-secret \
  --secret-id MySecret \
  --recovery-window-in-days 30

# Delete secret immediately
aws secretsmanager delete-secret \
  --secret-id MySecret \
  --force-delete-without-recovery

# Restore secret
aws secretsmanager restore-secret --secret-id MySecret
```

### Rotation

```bash
# Enable rotation
aws secretsmanager rotate-secret \
  --secret-id MySecret \
  --rotation-lambda-arn arn:aws:lambda:eu-central-1:123456789012:function:MyRotationFunction

# Set rotation rules
aws secretsmanager update-secret \
  --secret-id MySecret \
  --rotation-rules AutomaticallyAfterDays=30
```

---

## Systems Manager (SSM)

### Parameter Store

```bash
# List parameters
aws ssm describe-parameters

# Create parameter (string)
aws ssm put-parameter \
  --name /myapp/config/db-host \
  --value "db.example.com" \
  --type String

# Create parameter (SecureString)
aws ssm put-parameter \
  --name /myapp/config/db-password \
  --value "MyPassword123" \
  --type SecureString

# Get parameter
aws ssm get-parameter --name /myapp/config/db-host

# Get SecureString parameter (decrypted)
aws ssm get-parameter --name /myapp/config/db-password --with-decryption

# Get multiple parameters
aws ssm get-parameters --names /myapp/config/db-host /myapp/config/db-password --with-decryption

# Get parameters by path
aws ssm get-parameters-by-path --path /myapp/config --recursive

# Update parameter
aws ssm put-parameter \
  --name /myapp/config/db-host \
  --value "newdb.example.com" \
  --overwrite

# Delete parameter
aws ssm delete-parameter --name /myapp/config/db-host
```

### Session Manager

```bash
# Start session to EC2 instance
aws ssm start-session --target i-1234567890abcdef0

# List sessions
aws ssm describe-sessions --state Active

# Terminate session
aws ssm terminate-session --session-id <session-id>
```

### Run Command

```bash
# Execute command on instance
aws ssm send-command \
  --document-name "AWS-RunShellScript" \
  --targets "Key=instanceids,Values=i-1234567890abcdef0" \
  --parameters 'commands=["echo Hello World"]'

# Show command invocations
aws ssm list-command-invocations --command-id <command-id>

# Show command output
aws ssm get-command-invocation \
  --command-id <command-id> \
  --instance-id i-1234567890abcdef0
```

---

## CloudTrail

### Trails

```bash
# List trails
aws cloudtrail list-trails

# Create trail
aws cloudtrail create-trail \
  --name my-trail \
  --s3-bucket-name my-trail-bucket

# Start trail
aws cloudtrail start-logging --name my-trail

# Stop trail
aws cloudtrail stop-logging --name my-trail

# Delete trail
aws cloudtrail delete-trail --name my-trail

# Show trail status
aws cloudtrail get-trail-status --name my-trail
```

### Events

```bash
# Show events (last 90 days)
aws cloudtrail lookup-events

# Events with filter
aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=RunInstances

# Events between time periods
aws cloudtrail lookup-events \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z
```

---

## Useful Tips & Tricks

### JQ for JSON Parsing

```bash
# Installation
brew install jq  # macOS
sudo apt install jq  # Ubuntu

# Examples with jq
# List all instance IDs
aws ec2 describe-instances | jq -r '.Reservations[].Instances[].InstanceId'

# Public IPs of all running instances
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  | jq -r '.Reservations[].Instances[].PublicIpAddress'

# Instance name and ID as table
aws ec2 describe-instances | jq -r '.Reservations[].Instances[] | "\(.Tags[]|select(.Key=="Name").Value) \(.InstanceId)"'
```

### Aliases for common commands

```bash
# Add to ~/.zshrc or ~/.bashrc
alias awsp='export AWS_PROFILE='
alias awsr='export AWS_REGION='
alias ec2list='aws ec2 describe-instances --query "Reservations[].Instances[].[InstanceId,State.Name,InstanceType,PublicIpAddress,Tags[?Key==`Name`].Value|[0]]" --output table'
alias s3list='aws s3 ls'
alias lambdalist='aws lambda list-functions --query "Functions[].[FunctionName,Runtime,LastModified]" --output table'
```

### AWS CLI Pagination

```bash
# Disable automatic pagination
aws s3api list-objects --bucket my-bucket --no-paginate

# Set page size (for large results)
aws s3api list-objects --bucket my-bucket --page-size 100

# Limit max items
aws s3api list-objects --bucket my-bucket --max-items 50
```

### Query & Filter

```bash
# Query with --query (JMESPath)
aws ec2 describe-instances --query 'Reservations[].Instances[].[InstanceId,State.Name]'

# Filter with --filters
aws ec2 describe-instances --filters "Name=instance-type,Values=t2.micro" "Name=instance-state-name,Values=running"

# Combined
aws ec2 describe-instances \
  --filters "Name=tag:Environment,Values=production" \
  --query 'Reservations[].Instances[].[InstanceId,PublicIpAddress]'
```

### Dry Run

```bash
# Many commands support --dry-run
aws ec2 run-instances --dry-run --image-id ami-1234567890abcdef0 --instance-type t2.micro

# Indicates whether the command would succeed without executing it
```

### AWS CLI with Docker

```bash
# Run AWS CLI in Docker container
docker run --rm -it \
  -v ~/.aws:/root/.aws \
  -v $(pwd):/aws \
  amazon/aws-cli s3 ls

# Alias for Docker AWS CLI
alias awscli='docker run --rm -it -v ~/.aws:/root/.aws -v $(pwd):/aws amazon/aws-cli'
```

### Debugging

```bash
# Enable debug output
aws s3 ls --debug

# Show only HTTP requests
aws s3 ls --debug 2>&1 | grep -A 10 "Making request"
```

---

## Common Workflows

### Create EC2 instance with everything

```bash
# 1. Create key pair
aws ec2 create-key-pair --key-name MyKeyPair --query 'KeyMaterial' --output text > MyKeyPair.pem
chmod 400 MyKeyPair.pem

# 2. Create security group
SG_ID=$(aws ec2 create-security-group \
  --group-name MySecurityGroup \
  --description "My security group" \
  --vpc-id vpc-1a2b3c4d \
  --query 'GroupId' --output text)

# 3. Allow SSH access
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

# 4. Start instance
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name MyKeyPair \
  --security-group-ids $SG_ID \
  --query 'Instances[0].InstanceId' \
  --output text)

# 5. Wait for instance
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

# 6. Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text)

echo "Instance $INSTANCE_ID is running at $PUBLIC_IP"
echo "Connect with: ssh -i MyKeyPair.pem ec2-user@$PUBLIC_IP"
```

### Set up S3 bucket with website hosting

```bash
# 1. Create bucket
aws s3 mb s3://my-website-bucket

# 2. Remove public access block (for website)
aws s3api put-public-access-block \
  --bucket my-website-bucket \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# 3. Website configuration
aws s3 website s3://my-website-bucket/ \
  --index-document index.html \
  --error-document error.html

# 4. Bucket policy for public read
cat > bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::my-website-bucket/*"
  }]
}
EOF

aws s3api put-bucket-policy \
  --bucket my-website-bucket \
  --policy file://bucket-policy.json

# 5. Upload website files
aws s3 sync ./website s3://my-website-bucket/

# 6. Show website URL
echo "Website URL: http://my-website-bucket.s3-website-eu-central-1.amazonaws.com"
```

### Deploy Lambda function with everything

```bash
# 1. Create IAM role for Lambda
cat > trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

ROLE_ARN=$(aws iam create-role \
  --role-name lambda-execution-role \
  --assume-role-policy-document file://trust-policy.json \
  --query 'Role.Arn' \
  --output text)

# 2. Attach basic execution policy
aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# 3. Zip Lambda code
zip function.zip lambda_function.py

# 4. Create Lambda function
aws lambda create-function \
  --function-name my-function \
  --runtime python3.9 \
  --role $ROLE_ARN \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://function.zip

# 5. Test function
aws lambda invoke \
  --function-name my-function \
  --payload '{"key":"value"}' \
  response.json

cat response.json
```

---

## Best Practices

### Security

- Never store access keys in code or Git
- Use IAM roles instead of access keys for EC2/ECS/Lambda
- Rotate access keys regularly
- Enable MFA for important operations
- Follow principle of least privilege

### Performance

- Use `--query` to retrieve only needed data
- Use `--filters` server-side instead of client-side filtering
- Choose region close to your location

### Costs

- Clean up unused resources regularly
- Use AWS Cost Explorer and Budgets
- Use tags for cost allocation
- Reserved Instances for predictable workloads

### Automation

- Use AWS CLI in Bash/Python scripts
- CloudFormation/Terraform for Infrastructure as Code
- Integrate CI/CD pipelines with AWS CLI

---

## Further Resources

- [AWS CLI Command Reference](https://awscli.amazonaws.com/v2/documentation/api/latest/index.html)
- [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/)
- [JMESPath Tutorial](https://jmespath.org/tutorial.html)
- [AWS CLI GitHub](https://github.com/aws/aws-cli)

---
