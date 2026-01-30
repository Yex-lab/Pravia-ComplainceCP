#!/bin/bash

# Azure Static Web App Deployment Script
# Resource: swa-pravia-app-dev
# Resource Group: rg-pravia-mule-dev-eastus

set -e

echo "🏗️  Building application..."
pnpm build

echo "📦 Deploying to Azure Static Web App..."
az staticwebapp deploy \
  --name swa-pravia-app-dev \
  --resource-group rg-pravia-mule-dev-eastus \
  --source ./dist \
  --no-wait

echo "✅ Deployment initiated!"
echo "🌐 URL: https://blue-sea-08fbdc80f.3.azurestaticapps.net"
