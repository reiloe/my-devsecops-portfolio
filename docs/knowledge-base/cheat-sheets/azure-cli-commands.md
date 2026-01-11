---
title: ☁️ Azure CLI Commands
sidebar_label: Azure CLI
sidebar_position: 6
tags: [azure, azure-cli, cloud, infrastructure, cheat-sheet]
---

# ☁️ Azure CLI Commands Cheat Sheet

Comprehensive reference for the most commonly used Azure CLI (az) commands.

---

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Account & Subscription Management](#account--subscription-management)
3. [Resource Groups](#resource-groups)
4. [Virtual Machines](#virtual-machines)
5. [Storage Accounts](#storage-accounts)
6. [Azure Container Instances](#azure-container-instances)
7. [Azure Kubernetes Service (AKS)](#azure-kubernetes-service-aks)
8. [Azure Container Registry (ACR)](#azure-container-registry-acr)
9. [App Service](#app-service)
10. [Azure Functions](#azure-functions)
11. [Azure SQL Database](#azure-sql-database)
12. [Cosmos DB](#cosmos-db)
13. [Virtual Networks](#virtual-networks)
14. [Azure Key Vault](#azure-key-vault)
15. [Azure Active Directory](#azure-active-directory)
16. [Monitor & Logs](#monitor--logs)
17. [Azure DevOps](#azure-devops)
18. [Azure Policy](#azure-policy)
19. [ARM Templates & Bicep](#arm-templates--bicep)
20. [Tags & Resource Management](#tags--resource-management)

---

## Setup & Configuration

### Installation

```bash
# Install Azure CLI (macOS)
brew update && brew install azure-cli

# Install Azure CLI (Linux - Ubuntu/Debian)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Install Azure CLI (Linux - RPM)
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo dnf install azure-cli

# Install Azure CLI (Windows)
# Download from: https://aka.ms/installazurecliwindows

# Update Azure CLI
az upgrade

# Check version
az version
```

### Login & Authentication

```bash
# Login interactively
az login

# Login with device code (for remote sessions)
az login --use-device-code

# Login with service principal
az login --service-principal -u <app-id> -p <password> --tenant <tenant-id>

# Login with managed identity
az login --identity

# Logout
az logout

# Show current account
az account show

# List available subscriptions
az account list --output table
```

### Configuration

```bash
# Set default subscription
az account set --subscription "Subscription Name"
az account set --subscription <subscription-id>

# Set default location
az configure --defaults location=eastus

# Set default resource group
az configure --defaults group=myResourceGroup

# Show current configuration
az configure --list-defaults

# Set output format (json, yaml, table, tsv)
az configure --defaults output=table

# Clear defaults
az configure --defaults location='' group=''
```

### Cloud Configuration

```bash
# Show current cloud
az cloud show

# List available clouds
az cloud list

# Switch to different cloud
az cloud set --name AzureUSGovernment
az cloud set --name AzureChinaCloud
az cloud set --name AzureCloud  # Public cloud
```

---

## Account & Subscription Management

### Subscriptions

```bash
# List all subscriptions
az account list
az account list --output table
az account list --query "[].{Name:name, ID:id, State:state}"

# Show current subscription
az account show
az account show --output table

# Set active subscription
az account set --subscription "Production"
az account set --subscription <subscription-id>

# Get subscription details
az account show --subscription <subscription-id>

# List locations
az account list-locations
az account list-locations --output table
az account list-locations --query "[?metadata.regionCategory=='Recommended'].{Name:name, DisplayName:displayName}"
```

### Management Groups

```bash
# List management groups
az account management-group list

# Show management group
az account management-group show --name <group-name>

# Create management group
az account management-group create --name <group-name>

# Delete management group
az account management-group delete --name <group-name>
```

---

## Resource Groups

### Basic Operations

```bash
# List all resource groups
az group list
az group list --output table
az group list --query "[].{Name:name, Location:location}"

# Create resource group
az group create --name myResourceGroup --location eastus

# Show resource group details
az group show --name myResourceGroup

# Check if resource group exists
az group exists --name myResourceGroup

# Delete resource group
az group delete --name myResourceGroup
az group delete --name myResourceGroup --yes --no-wait  # No confirmation, async

# List resources in resource group
az resource list --resource-group myResourceGroup
az resource list --resource-group myResourceGroup --output table
```

### Resource Group Management

```bash
# Update resource group tags
az group update --name myResourceGroup --tags Environment=Production

# Export resource group as template
az group export --name myResourceGroup

# Lock resource group
az lock create --name deleteLock --lock-type CanNotDelete --resource-group myResourceGroup

# List locks
az lock list --resource-group myResourceGroup

# Delete lock
az lock delete --name deleteLock --resource-group myResourceGroup

# Wait for resource group deletion
az group wait --name myResourceGroup --deleted
```

---

## Virtual Machines

### List & Show VMs

```bash
# List all VMs
az vm list
az vm list --output table
az vm list --query "[].{Name:name, ResourceGroup:resourceGroup, Location:location}"

# List VMs in resource group
az vm list --resource-group myResourceGroup

# Show VM details
az vm show --resource-group myResourceGroup --name myVM

# Show VM instance view
az vm get-instance-view --resource-group myResourceGroup --name myVM
```

### Create & Delete VMs

```bash
# Create Ubuntu VM
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys

# Create Windows VM
az vm create \
  --resource-group myResourceGroup \
  --name myWindowsVM \
  --image Win2022Datacenter \
  --size Standard_D2s_v3 \
  --admin-username azureuser \
  --admin-password <password>

# Create VM with public IP
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image Ubuntu2204 \
  --public-ip-sku Standard \
  --public-ip-address-allocation static

# Delete VM
az vm delete --resource-group myResourceGroup --name myVM --yes

# Delete VM and all associated resources
az vm delete --resource-group myResourceGroup --name myVM --yes
az disk delete --resource-group myResourceGroup --name myVM_OsDisk_1 --yes
az network nic delete --resource-group myResourceGroup --name myVMVMNic --yes
az network public-ip delete --resource-group myResourceGroup --name myVMPublicIP --yes
```

### VM Operations

```bash
# Start VM
az vm start --resource-group myResourceGroup --name myVM

# Stop VM (deallocate)
az vm deallocate --resource-group myResourceGroup --name myVM

# Stop VM (without deallocation)
az vm stop --resource-group myResourceGroup --name myVM

# Restart VM
az vm restart --resource-group myResourceGroup --name myVM

# Resize VM
az vm resize --resource-group myResourceGroup --name myVM --size Standard_DS3_v2

# List available VM sizes
az vm list-sizes --location eastus
az vm list-sizes --location eastus --output table

# Get VM power state
az vm get-instance-view --resource-group myResourceGroup --name myVM --query instanceView.statuses[1].displayStatus
```

### VM Images

```bash
# List popular images
az vm image list --output table

# List all images from publisher
az vm image list --publisher Canonical --all --output table

# List Ubuntu images
az vm image list --offer Ubuntu --all --output table

# Show image details
az vm image show --location eastus --urn Canonical:0001-com-ubuntu-server-jammy:22_04-lts:latest
```

### VM Extensions

```bash
# List VM extensions
az vm extension list --resource-group myResourceGroup --vm-name myVM

# Install extension
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name customScript \
  --publisher Microsoft.Azure.Extensions

# Delete extension
az vm extension delete --resource-group myResourceGroup --vm-name myVM --name customScript
```

### VM Access

```bash
# Open port
az vm open-port --resource-group myResourceGroup --name myVM --port 80

# Get VM public IP
az vm show --resource-group myResourceGroup --name myVM --show-details --query publicIps -o tsv

# Get VM private IP
az vm show --resource-group myResourceGroup --name myVM --show-details --query privateIps -o tsv

# SSH into VM
ssh azureuser@<public-ip>

# Run command on VM
az vm run-command invoke \
  --resource-group myResourceGroup \
  --name myVM \
  --command-id RunShellScript \
  --scripts "apt-get update && apt-get install -y nginx"
```

---

## Storage Accounts

### Storage Account Management

```bash
# List storage accounts
az storage account list
az storage account list --output table

# Create storage account
az storage account create \
  --name mystorageaccount \
  --resource-group myResourceGroup \
  --location eastus \
  --sku Standard_LRS

# Show storage account
az storage account show --name mystorageaccount --resource-group myResourceGroup

# Delete storage account
az storage account delete --name mystorageaccount --resource-group myResourceGroup --yes

# Get storage account keys
az storage account keys list --account-name mystorageaccount --resource-group myResourceGroup

# Get connection string
az storage account show-connection-string --name mystorageaccount --resource-group myResourceGroup
```

### Blob Storage

```bash
# Create container
az storage container create \
  --name mycontainer \
  --account-name mystorageaccount

# List containers
az storage container list --account-name mystorageaccount --output table

# Upload blob
az storage blob upload \
  --account-name mystorageaccount \
  --container-name mycontainer \
  --name myfile.txt \
  --file ./myfile.txt

# Download blob
az storage blob download \
  --account-name mystorageaccount \
  --container-name mycontainer \
  --name myfile.txt \
  --file ./downloaded.txt

# List blobs
az storage blob list \
  --account-name mystorageaccount \
  --container-name mycontainer \
  --output table

# Delete blob
az storage blob delete \
  --account-name mystorageaccount \
  --container-name mycontainer \
  --name myfile.txt

# Delete container
az storage container delete \
  --name mycontainer \
  --account-name mystorageaccount

# Generate SAS token
az storage blob generate-sas \
  --account-name mystorageaccount \
  --container-name mycontainer \
  --name myfile.txt \
  --permissions r \
  --expiry 2024-12-31T23:59:00Z
```

### File Shares

```bash
# Create file share
az storage share create \
  --name myshare \
  --account-name mystorageaccount

# List file shares
az storage share list --account-name mystorageaccount --output table

# Upload file
az storage file upload \
  --account-name mystorageaccount \
  --share-name myshare \
  --source ./myfile.txt

# Download file
az storage file download \
  --account-name mystorageaccount \
  --share-name myshare \
  --path myfile.txt \
  --dest ./downloaded.txt

# Delete file share
az storage share delete \
  --name myshare \
  --account-name mystorageaccount
```

---

## Azure Container Instances

### Container Instance Operations

```bash
# Create container instance
az container create \
  --resource-group myResourceGroup \
  --name mycontainer \
  --image nginx \
  --dns-name-label myapp-dns \
  --ports 80

# Create with environment variables
az container create \
  --resource-group myResourceGroup \
  --name mycontainer \
  --image myapp:latest \
  --environment-variables 'ENV=production' 'DEBUG=false'

# Create with ACR authentication
az container create \
  --resource-group myResourceGroup \
  --name mycontainer \
  --image myregistry.azurecr.io/myapp:latest \
  --registry-login-server myregistry.azurecr.io \
  --registry-username <username> \
  --registry-password <password>

# List container instances
az container list --output table

# Show container details
az container show --resource-group myResourceGroup --name mycontainer

# Show container logs
az container logs --resource-group myResourceGroup --name mycontainer

# Follow logs
az container attach --resource-group myResourceGroup --name mycontainer

# Execute command in container
az container exec \
  --resource-group myResourceGroup \
  --name mycontainer \
  --exec-command "/bin/bash"

# Restart container
az container restart --resource-group myResourceGroup --name mycontainer

# Delete container
az container delete --resource-group myResourceGroup --name mycontainer --yes
```

---

## Azure Kubernetes Service (AKS)

### Cluster Management

```bash
# List AKS clusters
az aks list --output table

# Create AKS cluster
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --node-count 3 \
  --enable-managed-identity \
  --generate-ssh-keys

# Create with specific Kubernetes version
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --kubernetes-version 1.28.0 \
  --node-count 3

# Show cluster details
az aks show --resource-group myResourceGroup --name myAKSCluster

# Get credentials (configure kubectl)
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster

# Get credentials for admin
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster --admin

# Delete cluster
az aks delete --resource-group myResourceGroup --name myAKSCluster --yes --no-wait
```

### Cluster Operations

```bash
# Start cluster
az aks start --resource-group myResourceGroup --name myAKSCluster

# Stop cluster
az aks stop --resource-group myResourceGroup --name myAKSCluster

# Scale cluster
az aks scale --resource-group myResourceGroup --name myAKSCluster --node-count 5

# Upgrade cluster
az aks upgrade \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --kubernetes-version 1.28.0

# List available upgrades
az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster

# List available Kubernetes versions
az aks get-versions --location eastus --output table
```

### Node Pools

```bash
# List node pools
az aks nodepool list --resource-group myResourceGroup --cluster-name myAKSCluster --output table

# Add node pool
az aks nodepool add \
  --resource-group myResourceGroup \
  --cluster-name myAKSCluster \
  --name mynodepool \
  --node-count 3 \
  --node-vm-size Standard_DS2_v2

# Scale node pool
az aks nodepool scale \
  --resource-group myResourceGroup \
  --cluster-name myAKSCluster \
  --name mynodepool \
  --node-count 5

# Delete node pool
az aks nodepool delete \
  --resource-group myResourceGroup \
  --cluster-name myAKSCluster \
  --name mynodepool
```

### AKS Add-ons

```bash
# Enable monitoring
az aks enable-addons \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --addons monitoring

# Enable Azure Policy
az aks enable-addons \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --addons azure-policy

# Disable addon
az aks disable-addons \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --addons monitoring

# List addons
az aks show --resource-group myResourceGroup --name myAKSCluster --query addonProfiles
```

---

## Azure Container Registry (ACR)

### Registry Management

```bash
# Create container registry
az acr create \
  --resource-group myResourceGroup \
  --name myregistry \
  --sku Basic

# List registries
az acr list --output table

# Show registry details
az acr show --name myregistry --resource-group myResourceGroup

# Delete registry
az acr delete --name myregistry --resource-group myResourceGroup --yes

# Login to registry
az acr login --name myregistry

# Get login server
az acr show --name myregistry --query loginServer --output tsv
```

### Image Management

```bash
# List repositories
az acr repository list --name myregistry --output table

# List tags
az acr repository show-tags --name myregistry --repository myapp --output table

# Show image manifest
az acr repository show --name myregistry --repository myapp --tag latest

# Delete image
az acr repository delete --name myregistry --repository myapp --tag latest --yes

# Delete repository
az acr repository delete --name myregistry --repository myapp --yes

# Import image
az acr import \
  --name myregistry \
  --source docker.io/library/nginx:latest \
  --image nginx:latest

# Build image in ACR
az acr build \
  --registry myregistry \
  --image myapp:v1 \
  --file Dockerfile \
  .
```

### ACR Tasks

```bash
# Create ACR task
az acr task create \
  --registry myregistry \
  --name buildtask \
  --image myapp:{{.Run.ID}} \
  --context https://github.com/myorg/myrepo.git \
  --file Dockerfile \
  --git-access-token <token>

# List tasks
az acr task list --registry myregistry --output table

# Run task
az acr task run --registry myregistry --name buildtask

# Show task runs
az acr task list-runs --registry myregistry --output table

# Show task logs
az acr task logs --registry myregistry --run-id <run-id>
```

### Webhooks

```bash
# Create webhook
az acr webhook create \
  --registry myregistry \
  --name mywebhook \
  --uri https://myapp.com/webhook \
  --actions push

# List webhooks
az acr webhook list --registry myregistry --output table

# Get webhook events
az acr webhook list-events --registry myregistry --name mywebhook

# Delete webhook
az acr webhook delete --registry myregistry --name mywebhook
```

---

## App Service

### App Service Plan

```bash
# Create App Service Plan
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku B1 \
  --is-linux

# List App Service Plans
az appservice plan list --output table

# Show plan details
az appservice plan show --name myAppServicePlan --resource-group myResourceGroup

# Scale plan
az appservice plan update \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku P1V2

# Delete plan
az appservice plan delete --name myAppServicePlan --resource-group myResourceGroup --yes
```

### Web Apps

```bash
# Create web app
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name mywebapp \
  --runtime "NODE:18-lts"

# Create web app with container
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name mywebapp \
  --deployment-container-image-name nginx:latest

# List web apps
az webapp list --output table

# Show web app
az webapp show --name mywebapp --resource-group myResourceGroup

# Delete web app
az webapp delete --name mywebapp --resource-group myResourceGroup

# Get default hostname
az webapp show --name mywebapp --resource-group myResourceGroup --query defaultHostName -o tsv
```

### Web App Configuration

```bash
# Set app settings
az webapp config appsettings set \
  --name mywebapp \
  --resource-group myResourceGroup \
  --settings KEY1=value1 KEY2=value2

# List app settings
az webapp config appsettings list \
  --name mywebapp \
  --resource-group myResourceGroup

# Set connection string
az webapp config connection-string set \
  --name mywebapp \
  --resource-group myResourceGroup \
  --connection-string-type SQLAzure \
  --settings MyDb="Server=myserver;Database=mydb"

# Configure custom domain
az webapp config hostname add \
  --webapp-name mywebapp \
  --resource-group myResourceGroup \
  --hostname www.example.com
```

### Deployment

```bash
# Deploy from ZIP
az webapp deploy \
  --resource-group myResourceGroup \
  --name mywebapp \
  --src-path ./app.zip

# Deploy from GitHub
az webapp deployment source config \
  --name mywebapp \
  --resource-group myResourceGroup \
  --repo-url https://github.com/myorg/myrepo \
  --branch main \
  --manual-integration

# Set deployment user
az webapp deployment user set --user-name <username> --password <password>

# List deployment credentials
az webapp deployment list-publishing-credentials \
  --name mywebapp \
  --resource-group myResourceGroup

# Restart web app
az webapp restart --name mywebapp --resource-group myResourceGroup

# Stop web app
az webapp stop --name mywebapp --resource-group myResourceGroup

# Start web app
az webapp start --name mywebapp --resource-group myResourceGroup
```

### Logs & Monitoring

```bash
# Enable logging
az webapp log config \
  --name mywebapp \
  --resource-group myResourceGroup \
  --application-logging filesystem \
  --level verbose

# Tail logs
az webapp log tail --name mywebapp --resource-group myResourceGroup

# Download logs
az webapp log download \
  --name mywebapp \
  --resource-group myResourceGroup \
  --log-file logs.zip
```

---

## Azure Functions

### Function App Management

```bash
# Create function app
az functionapp create \
  --resource-group myResourceGroup \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name myfunctionapp \
  --storage-account mystorageaccount

# List function apps
az functionapp list --output table

# Show function app
az functionapp show --name myfunctionapp --resource-group myResourceGroup

# Delete function app
az functionapp delete --name myfunctionapp --resource-group myResourceGroup

# Start function app
az functionapp start --name myfunctionapp --resource-group myResourceGroup

# Stop function app
az functionapp stop --name myfunctionapp --resource-group myResourceGroup

# Restart function app
az functionapp restart --name myfunctionapp --resource-group myResourceGroup
```

### Function Configuration

```bash
# Set app settings
az functionapp config appsettings set \
  --name myfunctionapp \
  --resource-group myResourceGroup \
  --settings KEY1=value1

# List app settings
az functionapp config appsettings list \
  --name myfunctionapp \
  --resource-group myResourceGroup

# Delete app setting
az functionapp config appsettings delete \
  --name myfunctionapp \
  --resource-group myResourceGroup \
  --setting-names KEY1
```

### Function Deployment

```bash
# Deploy from ZIP
az functionapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name myfunctionapp \
  --src function.zip

# List functions
az functionapp function show \
  --name myfunctionapp \
  --resource-group myResourceGroup \
  --function-name myfunction
```

---

## Azure SQL Database

### SQL Server Management

```bash
# Create SQL Server
az sql server create \
  --name mysqlserver \
  --resource-group myResourceGroup \
  --location eastus \
  --admin-user myadmin \
  --admin-password <password>

# List SQL servers
az sql server list --output table

# Show SQL server
az sql server show --name mysqlserver --resource-group myResourceGroup

# Delete SQL server
az sql server delete --name mysqlserver --resource-group myResourceGroup --yes

# Update admin password
az sql server update \
  --name mysqlserver \
  --resource-group myResourceGroup \
  --admin-password <new-password>
```

### Firewall Rules

```bash
# Create firewall rule
az sql server firewall-rule create \
  --resource-group myResourceGroup \
  --server mysqlserver \
  --name AllowMyIP \
  --start-ip-address 1.2.3.4 \
  --end-ip-address 1.2.3.4

# Allow Azure services
az sql server firewall-rule create \
  --resource-group myResourceGroup \
  --server mysqlserver \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# List firewall rules
az sql server firewall-rule list \
  --resource-group myResourceGroup \
  --server mysqlserver \
  --output table

# Delete firewall rule
az sql server firewall-rule delete \
  --name AllowMyIP \
  --resource-group myResourceGroup \
  --server mysqlserver
```

### Database Management

```bash
# Create database
az sql db create \
  --resource-group myResourceGroup \
  --server mysqlserver \
  --name mydb \
  --service-objective S0

# List databases
az sql db list --resource-group myResourceGroup --server mysqlserver --output table

# Show database
az sql db show --resource-group myResourceGroup --server mysqlserver --name mydb

# Delete database
az sql db delete --name mydb --resource-group myResourceGroup --server mysqlserver --yes

# Scale database
az sql db update \
  --resource-group myResourceGroup \
  --server mysqlserver \
  --name mydb \
  --service-objective S1

# Create database from backup
az sql db restore \
  --dest-name mydb-restored \
  --resource-group myResourceGroup \
  --server mysqlserver \
  --name mydb \
  --time "2024-12-01T12:00:00Z"
```

### Connection Strings

```bash
# Show connection string
az sql db show-connection-string \
  --server mysqlserver \
  --name mydb \
  --client ado.net

# Get connection string (JDBC)
az sql db show-connection-string \
  --server mysqlserver \
  --name mydb \
  --client jdbc
```

---

## Cosmos DB

### Account Management

```bash
# Create Cosmos DB account
az cosmosdb create \
  --name mycosmosdb \
  --resource-group myResourceGroup \
  --kind GlobalDocumentDB

# Create with SQL API
az cosmosdb create \
  --name mycosmosdb \
  --resource-group myResourceGroup \
  --default-consistency-level Eventual \
  --locations regionName=eastus failoverPriority=0 isZoneRedundant=False

# List Cosmos DB accounts
az cosmosdb list --output table

# Show Cosmos DB account
az cosmosdb show --name mycosmosdb --resource-group myResourceGroup

# Delete Cosmos DB account
az cosmosdb delete --name mycosmosdb --resource-group myResourceGroup --yes

# Get connection strings
az cosmosdb keys list --name mycosmosdb --resource-group myResourceGroup --type connection-strings

# Get keys
az cosmosdb keys list --name mycosmosdb --resource-group myResourceGroup
```

### Database & Container Operations

```bash
# Create database
az cosmosdb sql database create \
  --account-name mycosmosdb \
  --resource-group myResourceGroup \
  --name mydb

# List databases
az cosmosdb sql database list \
  --account-name mycosmosdb \
  --resource-group myResourceGroup

# Create container
az cosmosdb sql container create \
  --account-name mycosmosdb \
  --resource-group myResourceGroup \
  --database-name mydb \
  --name mycontainer \
  --partition-key-path /id

# List containers
az cosmosdb sql container list \
  --account-name mycosmosdb \
  --resource-group myResourceGroup \
  --database-name mydb

# Delete container
az cosmosdb sql container delete \
  --account-name mycosmosdb \
  --resource-group myResourceGroup \
  --database-name mydb \
  --name mycontainer --yes

# Delete database
az cosmosdb sql database delete \
  --account-name mycosmosdb \
  --resource-group myResourceGroup \
  --name mydb --yes
```

---

## Virtual Networks

### VNet Management

```bash
# Create virtual network
az network vnet create \
  --resource-group myResourceGroup \
  --name myVNet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name mySubnet \
  --subnet-prefix 10.0.1.0/24

# List virtual networks
az network vnet list --output table

# Show VNet details
az network vnet show --resource-group myResourceGroup --name myVNet

# Delete VNet
az network vnet delete --resource-group myResourceGroup --name myVNet

# Update VNet
az network vnet update \
  --resource-group myResourceGroup \
  --name myVNet \
  --dns-servers 10.0.0.4 10.0.0.5
```

### Subnet Management

```bash
# Create subnet
az network vnet subnet create \
  --resource-group myResourceGroup \
  --vnet-name myVNet \
  --name mySubnet2 \
  --address-prefix 10.0.2.0/24

# List subnets
az network vnet subnet list --resource-group myResourceGroup --vnet-name myVNet --output table

# Show subnet
az network vnet subnet show \
  --resource-group myResourceGroup \
  --vnet-name myVNet \
  --name mySubnet

# Delete subnet
az network vnet subnet delete \
  --resource-group myResourceGroup \
  --vnet-name myVNet \
  --name mySubnet2
```

### Network Security Groups (NSG)

```bash
# Create NSG
az network nsg create \
  --resource-group myResourceGroup \
  --name myNSG

# List NSGs
az network nsg list --output table

# Create NSG rule
az network nsg rule create \
  --resource-group myResourceGroup \
  --nsg-name myNSG \
  --name AllowSSH \
  --priority 1000 \
  --source-address-prefixes '*' \
  --source-port-ranges '*' \
  --destination-address-prefixes '*' \
  --destination-port-ranges 22 \
  --access Allow \
  --protocol Tcp

# List NSG rules
az network nsg rule list --resource-group myResourceGroup --nsg-name myNSG --output table

# Delete NSG rule
az network nsg rule delete \
  --resource-group myResourceGroup \
  --nsg-name myNSG \
  --name AllowSSH

# Delete NSG
az network nsg delete --resource-group myResourceGroup --name myNSG
```

### Public IP Addresses

```bash
# Create public IP
az network public-ip create \
  --resource-group myResourceGroup \
  --name myPublicIP \
  --sku Standard \
  --allocation-method Static

# List public IPs
az network public-ip list --output table

# Show public IP
az network public-ip show --resource-group myResourceGroup --name myPublicIP

# Delete public IP
az network public-ip delete --resource-group myResourceGroup --name myPublicIP
```

### Network Interface Cards (NIC)

```bash
# Create NIC
az network nic create \
  --resource-group myResourceGroup \
  --name myNIC \
  --vnet-name myVNet \
  --subnet mySubnet \
  --public-ip-address myPublicIP

# List NICs
az network nic list --output table

# Show NIC
az network nic show --resource-group myResourceGroup --name myNIC

# Delete NIC
az network nic delete --resource-group myResourceGroup --name myNIC
```

### Load Balancer

```bash
# Create load balancer
az network lb create \
  --resource-group myResourceGroup \
  --name myLoadBalancer \
  --sku Standard \
  --public-ip-address myPublicIP

# Create backend pool
az network lb address-pool create \
  --resource-group myResourceGroup \
  --lb-name myLoadBalancer \
  --name myBackendPool

# Create health probe
az network lb probe create \
  --resource-group myResourceGroup \
  --lb-name myLoadBalancer \
  --name myHealthProbe \
  --protocol tcp \
  --port 80

# Create load balancing rule
az network lb rule create \
  --resource-group myResourceGroup \
  --lb-name myLoadBalancer \
  --name myHTTPRule \
  --protocol tcp \
  --frontend-port 80 \
  --backend-port 80 \
  --frontend-ip-name LoadBalancerFrontEnd \
  --backend-pool-name myBackendPool \
  --probe-name myHealthProbe
```

---

## Azure Key Vault

### Key Vault Management

```bash
# Create Key Vault
az keyvault create \
  --name mykeyvault \
  --resource-group myResourceGroup \
  --location eastus

# List Key Vaults
az keyvault list --output table

# Show Key Vault
az keyvault show --name mykeyvault

# Delete Key Vault
az keyvault delete --name mykeyvault

# Purge deleted Key Vault
az keyvault purge --name mykeyvault

# Recover deleted Key Vault
az keyvault recover --name mykeyvault
```

### Secrets

```bash
# Set secret
az keyvault secret set \
  --vault-name mykeyvault \
  --name mysecret \
  --value "MySecretValue"

# Get secret
az keyvault secret show \
  --vault-name mykeyvault \
  --name mysecret

# Get secret value only
az keyvault secret show \
  --vault-name mykeyvault \
  --name mysecret \
  --query value -o tsv

# List secrets
az keyvault secret list --vault-name mykeyvault

# Delete secret
az keyvault secret delete \
  --vault-name mykeyvault \
  --name mysecret

# List deleted secrets
az keyvault secret list-deleted --vault-name mykeyvault

# Recover deleted secret
az keyvault secret recover \
  --vault-name mykeyvault \
  --name mysecret
```

### Keys

```bash
# Create key
az keyvault key create \
  --vault-name mykeyvault \
  --name mykey \
  --protection software

# List keys
az keyvault key list --vault-name mykeyvault

# Show key
az keyvault key show \
  --vault-name mykeyvault \
  --name mykey

# Delete key
az keyvault key delete \
  --vault-name mykeyvault \
  --name mykey
```

### Certificates

```bash
# Create certificate
az keyvault certificate create \
  --vault-name mykeyvault \
  --name mycert \
  --policy "$(az keyvault certificate get-default-policy)"

# List certificates
az keyvault certificate list --vault-name mykeyvault

# Download certificate
az keyvault certificate download \
  --vault-name mykeyvault \
  --name mycert \
  --file cert.pem

# Delete certificate
az keyvault certificate delete \
  --vault-name mykeyvault \
  --name mycert
```

### Access Policies

```bash
# Set access policy
az keyvault set-policy \
  --name mykeyvault \
  --object-id <user-or-service-principal-object-id> \
  --secret-permissions get list set delete

# Delete access policy
az keyvault delete-policy \
  --name mykeyvault \
  --object-id <object-id>
```

---

## Azure Active Directory

### Users

```bash
# List users
az ad user list --output table

# Create user
az ad user create \
  --display-name "John Doe" \
  --user-principal-name john@example.onmicrosoft.com \
  --password <password>

# Show user
az ad user show --id john@example.onmicrosoft.com

# Delete user
az ad user delete --id john@example.onmicrosoft.com

# Get signed-in user
az ad signed-in-user show
```

### Groups

```bash
# List groups
az ad group list --output table

# Create group
az ad group create \
  --display-name "My Group" \
  --mail-nickname mygroup

# Show group
az ad group show --group "My Group"

# Add member to group
az ad group member add \
  --group "My Group" \
  --member-id <user-object-id>

# List group members
az ad group member list --group "My Group"

# Remove member from group
az ad group member remove \
  --group "My Group" \
  --member-id <user-object-id>

# Delete group
az ad group delete --group "My Group"
```

### Service Principals

```bash
# List service principals
az ad sp list --output table

# Create service principal
az ad sp create-for-rbac --name myapp

# Create with specific role
az ad sp create-for-rbac \
  --name myapp \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/myResourceGroup

# Show service principal
az ad sp show --id <app-id>

# Delete service principal
az ad sp delete --id <app-id>

# Reset credentials
az ad sp credential reset --id <app-id>
```

### App Registrations

```bash
# List applications
az ad app list --output table

# Create application
az ad app create --display-name myapp

# Show application
az ad app show --id <app-id>

# Delete application
az ad app delete --id <app-id>
```

---

## Monitor & Logs

### Activity Logs

```bash
# List activity logs
az monitor activity-log list --output table

# List logs for resource group
az monitor activity-log list \
  --resource-group myResourceGroup \
  --output table

# List logs for specific resource
az monitor activity-log list \
  --resource-id <resource-id> \
  --output table

# List logs with time range
az monitor activity-log list \
  --start-time 2024-12-01T00:00:00Z \
  --end-time 2024-12-02T00:00:00Z
```

### Diagnostic Settings

```bash
# Create diagnostic setting
az monitor diagnostic-settings create \
  --resource <resource-id> \
  --name myDiagnostics \
  --logs '[{"category": "Administrative","enabled": true}]' \
  --workspace <log-analytics-workspace-id>

# List diagnostic settings
az monitor diagnostic-settings list --resource <resource-id>

# Show diagnostic setting
az monitor diagnostic-settings show \
  --resource <resource-id> \
  --name myDiagnostics

# Delete diagnostic setting
az monitor diagnostic-settings delete \
  --resource <resource-id> \
  --name myDiagnostics
```

### Metrics

```bash
# List metric definitions
az monitor metrics list-definitions --resource <resource-id>

# Get metrics
az monitor metrics list \
  --resource <resource-id> \
  --metric "Percentage CPU" \
  --start-time 2024-12-01T00:00:00Z \
  --end-time 2024-12-02T00:00:00Z
```

### Alerts

```bash
# Create metric alert
az monitor metrics alert create \
  --name myAlert \
  --resource-group myResourceGroup \
  --scopes <resource-id> \
  --condition "avg Percentage CPU > 80" \
  --description "Alert when CPU exceeds 80%"

# List alerts
az monitor metrics alert list --output table

# Delete alert
az monitor metrics alert delete \
  --name myAlert \
  --resource-group myResourceGroup
```

### Log Analytics

```bash
# Create Log Analytics workspace
az monitor log-analytics workspace create \
  --resource-group myResourceGroup \
  --workspace-name myworkspace

# List workspaces
az monitor log-analytics workspace list --output table

# Query logs
az monitor log-analytics query \
  --workspace <workspace-id> \
  --analytics-query "AzureActivity | take 10"

# Delete workspace
az monitor log-analytics workspace delete \
  --resource-group myResourceGroup \
  --workspace-name myworkspace
```

---

## Azure DevOps

### Organizations & Projects

```bash
# Set default organization
az devops configure --defaults organization=https://dev.azure.com/myorg

# Set default project
az devops configure --defaults project=myproject

# List projects
az devops project list --output table

# Create project
az devops project create --name myproject

# Show project
az devops project show --project myproject

# Delete project
az devops project delete --id <project-id> --yes
```

### Repositories

```bash
# List repositories
az repos list --output table

# Create repository
az repos create --name myrepo

# Show repository
az repos show --repository myrepo

# Delete repository
az repos delete --id <repo-id> --yes

# Import repository
az repos import create \
  --git-source-url https://github.com/user/repo \
  --repository myrepo
```

### Pipelines

```bash
# List pipelines
az pipelines list --output table

# Create pipeline
az pipelines create \
  --name mypipeline \
  --repository myrepo \
  --branch main \
  --yml-path azure-pipelines.yml

# Run pipeline
az pipelines run --name mypipeline

# Show pipeline
az pipelines show --name mypipeline

# Delete pipeline
az pipelines delete --id <pipeline-id> --yes

# List pipeline runs
az pipelines runs list --output table

# Show pipeline run
az pipelines runs show --id <run-id>
```

---

## Azure Policy

### Policy Definitions

```bash
# List policy definitions
az policy definition list --output table

# Show policy definition
az policy definition show --name <policy-name>

# Create custom policy definition
az policy definition create \
  --name mypolicy \
  --rules policy-rules.json \
  --params policy-params.json

# Delete policy definition
az policy definition delete --name mypolicy
```

### Policy Assignments

```bash
# List policy assignments
az policy assignment list --output table

# Assign policy
az policy assignment create \
  --name myassignment \
  --policy <policy-id> \
  --scope /subscriptions/<subscription-id>

# Assign to resource group
az policy assignment create \
  --name myassignment \
  --policy <policy-id> \
  --resource-group myResourceGroup

# Show policy assignment
az policy assignment show --name myassignment

# Delete policy assignment
az policy assignment delete --name myassignment
```

### Policy Compliance

```bash
# List policy states
az policy state list --output table

# Get compliance summary
az policy state summarize

# Trigger compliance scan
az policy state trigger-scan --resource-group myResourceGroup
```

---

## ARM Templates & Bicep

### ARM Template Deployment

```bash
# Deploy ARM template
az deployment group create \
  --resource-group myResourceGroup \
  --template-file template.json \
  --parameters parameters.json

# Deploy with inline parameters
az deployment group create \
  --resource-group myResourceGroup \
  --template-file template.json \
  --parameters storageAccountName=mystorageacct

# Validate template
az deployment group validate \
  --resource-group myResourceGroup \
  --template-file template.json \
  --parameters parameters.json

# What-if deployment
az deployment group what-if \
  --resource-group myResourceGroup \
  --template-file template.json \
  --parameters parameters.json

# List deployments
az deployment group list --resource-group myResourceGroup --output table

# Show deployment
az deployment group show \
  --resource-group myResourceGroup \
  --name <deployment-name>

# Delete deployment
az deployment group delete \
  --resource-group myResourceGroup \
  --name <deployment-name>

# Export template
az group export \
  --resource-group myResourceGroup \
  --output-file exported-template.json
```

### Subscription-Level Deployments

```bash
# Deploy to subscription
az deployment sub create \
  --location eastus \
  --template-file template.json

# Validate subscription deployment
az deployment sub validate \
  --location eastus \
  --template-file template.json
```

### Bicep

```bash
# Build Bicep file to ARM template
az bicep build --file main.bicep

# Decompile ARM template to Bicep
az bicep decompile --file template.json

# Upgrade Bicep CLI
az bicep upgrade

# Deploy Bicep file
az deployment group create \
  --resource-group myResourceGroup \
  --template-file main.bicep \
  --parameters parameters.json
```

---

## Tags & Resource Management

### Tags

```bash
# Add tags to resource
az resource tag \
  --tags Environment=Production Department=IT \
  --ids <resource-id>

# Add tags to resource group
az group update \
  --name myResourceGroup \
  --tags Environment=Production

# List all tags
az tag list --output table

# List resources by tag
az resource list --tag Environment=Production --output table

# Remove tag
az resource update \
  --ids <resource-id> \
  --remove tags.Environment
```

### Resource Management

```bash
# List all resources
az resource list --output table

# List resources by type
az resource list --resource-type "Microsoft.Compute/virtualMachines" --output table

# Show resource
az resource show --ids <resource-id>

# Move resources to another resource group
az resource move \
  --destination-group targetResourceGroup \
  --ids <resource-id1> <resource-id2>

# Delete resource
az resource delete --ids <resource-id>

# Lock resource
az lock create \
  --name deleteLock \
  --lock-type CanNotDelete \
  --resource-group myResourceGroup \
  --resource-name myVM \
  --resource-type Microsoft.Compute/virtualMachines
```

### Resource Providers

```bash
# List resource providers
az provider list --output table

# Show resource provider
az provider show --namespace Microsoft.Compute

# Register resource provider
az provider register --namespace Microsoft.ContainerService

# Unregister resource provider
az provider unregister --namespace Microsoft.ContainerService

# List resource provider operations
az provider operation show --namespace Microsoft.Compute
```

---

## Useful Tips & Tricks

### Output Formatting

```bash
# Table format (human-readable)
az vm list --output table

# JSON format (default)
az vm list --output json

# YAML format
az vm list --output yaml

# TSV format (for scripting)
az vm list --output tsv

# None (no output)
az vm list --output none
```

### JMESPath Queries

```bash
# Query specific fields
az vm list --query "[].{Name:name, Location:location}"

# Filter results
az vm list --query "[?location=='eastus']"

# Get single field
az vm show --name myVM --resource-group myResourceGroup --query name -o tsv

# Complex queries
az vm list --query "[?starts_with(name,'web')].{Name:name, State:powerState}"
```

### Batch Operations

```bash
# Delete multiple resource groups
for rg in rg1 rg2 rg3; do
  az group delete --name $rg --yes --no-wait
done

# Stop multiple VMs
az vm list --query "[].{Name:name, RG:resourceGroup}" -o tsv | \
  while read name rg; do
    az vm stop --name $name --resource-group $rg --no-wait
  done
```

### Using Variables

```bash
# Store resource ID
VM_ID=$(az vm show --name myVM --resource-group myResourceGroup --query id -o tsv)

# Use in commands
az vm restart --ids $VM_ID

# Store subscription ID
SUB_ID=$(az account show --query id -o tsv)
```

### Interactive Mode

```bash
# Start interactive mode
az interactive

# Features:
# - Auto-completion
# - Command examples
# - Parameter hints
```

### Extensions

```bash
# List installed extensions
az extension list

# Install extension
az extension add --name azure-devops

# Update extension
az extension update --name azure-devops

# Remove extension
az extension remove --name azure-devops

# List available extensions
az extension list-available --output table
```

### Debugging

```bash
# Verbose output
az vm list --verbose

# Debug mode
az vm list --debug

# Dry run (some commands)
az vm create --dry-run ...
```

### Performance

```bash
# Run command without waiting
az vm start --name myVM --resource-group myResourceGroup --no-wait

# Parallel operations
az vm start --ids $ID1 --no-wait
az vm start --ids $ID2 --no-wait
az vm start --ids $ID3 --no-wait
```

---

## Common Workflows

### Deploy Complete Web Application

```bash
# 1. Create resource group
az group create --name webapp-rg --location eastus

# 2. Create storage account
az storage account create \
  --name webappstorage123 \
  --resource-group webapp-rg \
  --sku Standard_LRS

# 3. Create App Service plan
az appservice plan create \
  --name webapp-plan \
  --resource-group webapp-rg \
  --sku B1 \
  --is-linux

# 4. Create web app
az webapp create \
  --resource-group webapp-rg \
  --plan webapp-plan \
  --name mywebapp123 \
  --runtime "NODE:18-lts"

# 5. Configure app settings
az webapp config appsettings set \
  --name mywebapp123 \
  --resource-group webapp-rg \
  --settings STORAGE_CONNECTION_STRING="<connection-string>"

# 6. Deploy application
az webapp deploy \
  --resource-group webapp-rg \
  --name mywebapp123 \
  --src-path ./app.zip
```

### Set Up AKS Cluster with ACR

```bash
# 1. Create resource group
az group create --name aks-rg --location eastus

# 2. Create ACR
az acr create \
  --resource-group aks-rg \
  --name myregistry123 \
  --sku Basic

# 3. Create AKS cluster
az aks create \
  --resource-group aks-rg \
  --name myAKSCluster \
  --node-count 2 \
  --enable-managed-identity \
  --generate-ssh-keys

# 4. Attach ACR to AKS
az aks update \
  --resource-group aks-rg \
  --name myAKSCluster \
  --attach-acr myregistry123

# 5. Get credentials
az aks get-credentials \
  --resource-group aks-rg \
  --name myAKSCluster

# 6. Verify connection
kubectl get nodes
```

### Create VM with Full Network Setup

```bash
# 1. Create resource group
az group create --name vm-rg --location eastus

# 2. Create VNet
az network vnet create \
  --resource-group vm-rg \
  --name myVNet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name mySubnet \
  --subnet-prefix 10.0.1.0/24

# 3. Create NSG
az network nsg create \
  --resource-group vm-rg \
  --name myNSG

# 4. Add NSG rule for SSH
az network nsg rule create \
  --resource-group vm-rg \
  --nsg-name myNSG \
  --name AllowSSH \
  --priority 1000 \
  --source-address-prefixes '*' \
  --destination-port-ranges 22 \
  --access Allow \
  --protocol Tcp

# 5. Create public IP
az network public-ip create \
  --resource-group vm-rg \
  --name myPublicIP \
  --sku Standard

# 6. Create NIC
az network nic create \
  --resource-group vm-rg \
  --name myNIC \
  --vnet-name myVNet \
  --subnet mySubnet \
  --public-ip-address myPublicIP \
  --network-security-group myNSG

# 7. Create VM
az vm create \
  --resource-group vm-rg \
  --name myVM \
  --nics myNIC \
  --image Ubuntu2204 \
  --admin-username azureuser \
  --generate-ssh-keys
```

---

## Best Practices

### Security

```bash
# Always use managed identities instead of passwords when possible
az webapp identity assign --name mywebapp --resource-group myResourceGroup

# Use Key Vault for secrets
az keyvault secret set --vault-name mykeyvault --name dbpassword --value "SecurePass123"

# Limit access with RBAC
az role assignment create \
  --role "Reader" \
  --assignee <user-or-principal-id> \
  --scope /subscriptions/<subscription-id>/resourceGroups/myResourceGroup

# Enable resource locks for critical resources
az lock create \
  --name deleteLock \
  --lock-type CanNotDelete \
  --resource-group production-rg
```

### Cost Management

```bash
# Use tags for cost tracking
az group update --name myResourceGroup --tags CostCenter=Engineering Project=WebApp

# Stop VMs when not in use
az vm deallocate --resource-group myResourceGroup --name myVM

# Use Azure Spot VMs for non-critical workloads
az vm create \
  --resource-group myResourceGroup \
  --name mySpotVM \
  --priority Spot \
  --eviction-policy Deallocate

# Review and delete unused resources
az resource list --resource-group myResourceGroup
```

### Automation

```bash
# Use scripts with error handling
set -e  # Exit on error
az group create --name myResourceGroup --location eastus
az vm create --resource-group myResourceGroup --name myVM ...

# Use ARM templates or Bicep for infrastructure as code
az deployment group create \
  --resource-group myResourceGroup \
  --template-file infrastructure.bicep

# Schedule automated backups
# Use Azure Automation or Azure Functions
```

### Performance

```bash
# Use --no-wait for long-running operations
az vm create ... --no-wait

# Use parallel operations
for i in {1..5}; do
  az vm create --name vm$i ... --no-wait
done

# Use query filters to reduce data transfer
az vm list --query "[].{Name:name}" -o tsv
```

---

## Further Resources

- **Official Documentation**: [https://docs.microsoft.com/cli/azure/](https://docs.microsoft.com/cli/azure/)
- **Azure CLI Reference**: [https://docs.microsoft.com/cli/azure/reference-index](https://docs.microsoft.com/cli/azure/reference-index)
- **Azure CLI GitHub**: [https://github.com/Azure/azure-cli](https://github.com/Azure/azure-cli)
- **Azure Samples**: [https://github.com/Azure-Samples](https://github.com/Azure-Samples)
- **Azure Updates**: [https://azure.microsoft.com/updates/](https://azure.microsoft.com/updates/)
- **Azure Architecture Center**: [https://docs.microsoft.com/azure/architecture/](https://docs.microsoft.com/azure/architecture/)
- **Azure Quickstart Templates**: [https://github.com/Azure/azure-quickstart-templates](https://github.com/Azure/azure-quickstart-templates)

---

**Tip:** Use `az <command> --help` or `az find "<command>"` to get detailed information and examples for any Azure CLI command!
