#!/bin/bash

set -e

echo "🚀 Deploying Pravia Flux API to Azure Container Apps (QA)"
echo "=========================================================="
echo ""

# Configuration
REGISTRY="acrpraviamuleqaereh4t.azurecr.io"
IMAGE_NAME="pravia-mule/pravia-data-api-qa"
CONTAINER_APP="ca-pravia-data-api-qa"
RESOURCE_GROUP="rg-pravia-mule-qa-eastus"

# Check if logged into Azure
echo "🔐 Checking Azure login..."
if ! az account show &> /dev/null; then
  echo "❌ Not logged into Azure. Run: az login"
  exit 1
fi

echo "✅ Azure login verified"
echo ""

# Check and login to Azure Container Registry if needed
echo "🔐 Checking Azure Container Registry access..."
if ! docker pull ${REGISTRY}/hello-world:latest &> /dev/null 2>&1; then
  echo "🔑 Logging into Azure Container Registry..."
  az acr login --name acrpraviamuleqaereh4t
  echo "✅ ACR login successful"
else
  echo "✅ ACR access verified"
fi
echo ""

# Build Docker image from monorepo root for AMD64 platform
echo "🏗️  Building Docker image for linux/amd64..."
cd ../../..
docker buildx build --platform linux/amd64 \
  -f api/flux/Dockerfile \
  -t ${REGISTRY}/${IMAGE_NAME}:latest \
  --push .

echo "✅ Docker image built and pushed"
echo ""

# Get current environment variables from Container App
echo "📋 Getting current environment variables..."
CURRENT_ENV=$(az containerapp show \
  --name ${CONTAINER_APP} \
  --resource-group ${RESOURCE_GROUP} \
  --query "properties.template.containers[0].env" \
  -o json)

echo "✅ Environment variables retrieved"
echo ""

# Update Container App with NODE_ENV=production
echo "🔄 Updating Container App with NODE_ENV=production..."
az containerapp update \
  --name ${CONTAINER_APP} \
  --resource-group ${RESOURCE_GROUP} \
  --image ${REGISTRY}/${IMAGE_NAME}:latest \
  --set-env-vars NODE_ENV=production

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Container App Details:"
az containerapp show \
  --name ${CONTAINER_APP} \
  --resource-group ${RESOURCE_GROUP} \
  --query "{name:name,fqdn:properties.configuration.ingress.fqdn,image:properties.template.containers[0].image,status:properties.runningStatus}" \
  --output table

echo ""
FQDN=$(az containerapp show --name ${CONTAINER_APP} --resource-group ${RESOURCE_GROUP} --query "properties.configuration.ingress.fqdn" -o tsv)
echo "🌐 API URL: https://${FQDN}/api"
echo "📚 Swagger: https://${FQDN}/docs"
echo ""
echo "🧪 Test health:"
echo "curl https://${FQDN}/api/health"
echo ""
echo "⚠️  NODE_ENV=production - Production logging enabled"
