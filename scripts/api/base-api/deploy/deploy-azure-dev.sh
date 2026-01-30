#!/bin/bash

set -e

echo "🚀 Deploying Pravia Incidents API to Azure Container Apps"
echo "====================================================="
echo ""

# Configuration
REGISTRY="acrpraviaincidentsdevereh4t.azurecr.io"
IMAGE_NAME="pravia-incidents/pravia-incidents-api-dev"
CONTAINER_APP="ca-pravia-incidents-data-api-dev"
RESOURCE_GROUP="rg-pravia-incidents-dev-eastus"

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
  az acr login --name acrpraviaincidentsdevereh4t
  echo "✅ ACR login successful"
else
  echo "✅ ACR access verified"
fi
echo ""

# Build Docker image from monorepo root for AMD64 platform
echo "🏗️  Building Docker image for linux/amd64..."
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MONOREPO_ROOT="$( cd "${SCRIPT_DIR}/../../.." && pwd )"
cd "${MONOREPO_ROOT}"
docker buildx build --platform linux/amd64 \
  -f api/incidents/Dockerfile \
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

# Check if PORT env var exists (it should NOT be set)
echo "🔍 Checking for PORT environment variable..."
PORT_VAR=$(echo "$CURRENT_ENV" | jq -r '.[] | select(.name == "PORT") | .value // .secretRef')
if [ -n "$PORT_VAR" ]; then
  echo "⚠️  WARNING: PORT environment variable is set to: $PORT_VAR"
  echo "⚠️  This will cause the app to fail! Removing PORT variable..."
  az containerapp update \
    --name ${CONTAINER_APP} \
    --resource-group ${RESOURCE_GROUP} \
    --remove-env-vars PORT > /dev/null
  echo "✅ PORT variable removed"
else
  echo "✅ PORT variable not set (correct)"
fi
echo ""

# Update Container App
echo "🔄 Updating Container App..."
az containerapp update \
  --name ${CONTAINER_APP} \
  --resource-group ${RESOURCE_GROUP} \
  --image ${REGISTRY}/${IMAGE_NAME}:latest

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
echo "🌐 API URL: https://ca-pravia-incidents-data-api-dev.graybay-593c9998.eastus.azurecontainerapps.io/api"
echo "📚 Swagger: https://ca-pravia-incidents-data-api-dev.graybay-593c9998.eastus.azurecontainerapps.io/docs"
echo ""
echo "🧪 Test health:"
echo "curl https://ca-pravia-incidents-data-api-dev.graybay-593c9998.eastus.azurecontainerapps.io/api/health"
