# Azure Deployment - Pravia Flux API (Data API)

## 📋 Prerequisites

- Azure CLI installed: `brew install azure-cli` (macOS) or [Download](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- Docker Desktop with buildx support
- Access to Azure subscription and Container Registry

---

## 🔐 Initial Setup

### 1. Login to Azure
```bash
az login
```

### 2. Set Subscription (if needed)
```bash
# List subscriptions
az account list --output table

# Set active subscription
az account set --subscription "InnAdvisory"
```

### 3. Login to Azure Container Registry
```bash
az acr login --name acrpraviamuledevereh4t
```

**Note:** ACR login is required before pushing images. The login token expires after a few hours, so re-run if you get authentication errors.

---

## 🌐 Endpoints

- **API Base:** https://ca-pravia-data-api-dev.graybay-593c9998.eastus.azurecontainerapps.io/api
- **Health Check:** https://ca-pravia-data-api-dev.graybay-593c9998.eastus.azurecontainerapps.io/api/health
- **Swagger UI:** https://ca-pravia-data-api-dev.graybay-593c9998.eastus.azurecontainerapps.io/docs
- **OpenAPI JSON:** https://ca-pravia-data-api-dev.graybay-593c9998.eastus.azurecontainerapps.io/api-json

---

## 📦 Deployment Details

### Container Registry
- **Registry:** `acrpraviamuledevereh4t.azurecr.io`
- **Image:** `pravia-mule/pravia-data-api-dev:latest`
- **Platform:** `linux/amd64`

### Azure Resources
- **Resource Group:** `rg-pravia-mule-dev-eastus`
- **Container App:** `ca-pravia-data-api-dev`
- **Location:** `eastus`

---

## 🚀 Quick Deployment

### Dev Environment
```bash
cd api/flux/deploy
./deploy-azure-dev.sh
```

### QA Environment
```bash
cd api/flux/deploy
./deploy-azure-qa.sh
```

**What it does:**
1. Checks Azure login
2. Builds Docker image for `linux/amd64`
3. Pushes to Azure Container Registry
4. Updates Container App with new image

---

## 🧪 Testing

### Health Check
```bash
curl https://ca-pravia-data-api-dev.graybay-593c9998.eastus.azurecontainerapps.io/api/health
```

### Access Swagger UI
Open in browser: https://ca-pravia-data-api-dev.graybay-593c9998.eastus.azurecontainerapps.io/docs

---

## ⚙️ Configuration

Environment variables are managed via:
1. **Azure Container App** - Current runtime configuration
2. **Bicep Templates** - `infra/azure/pravia-mule/infra/main.bicep`

### View Current Configuration
```bash
az containerapp show \
  --name ca-pravia-data-api-dev \
  --resource-group rg-pravia-mule-dev-eastus \
  --query "properties.template.containers[0].env" \
  -o table
```

---

## 🔧 Manual Deployment

### 1. Build for AMD64
```bash
# From monorepo root
docker buildx build --platform linux/amd64 \
  -f api/flux/Dockerfile \
  -t acrpraviamuledevereh4t.azurecr.io/pravia-mule/pravia-data-api-dev:latest \
  --push .
```

### 2. Update Container App
```bash
az containerapp update \
  --name ca-pravia-data-api-dev \
  --resource-group rg-pravia-mule-dev-eastus \
  --image acrpraviamuledevereh4t.azurecr.io/pravia-mule/pravia-data-api-dev:latest
```

---

## 📊 Monitoring

### View Logs
```bash
az containerapp logs show \
  --name ca-pravia-data-api-dev \
  --resource-group rg-pravia-mule-dev-eastus \
  --follow
```

### Check Status
```bash
az containerapp show \
  --name ca-pravia-data-api-dev \
  --resource-group rg-pravia-mule-dev-eastus \
  --query "{name:name,status:properties.runningStatus,replicas:properties.template.scale}" \
  --output table
```

---

## 🔄 Rollback

```bash
# List revisions
az containerapp revision list \
  --name ca-pravia-data-api-dev \
  --resource-group rg-pravia-mule-dev-eastus \
  --output table

# Activate previous revision
az containerapp revision activate \
  --name ca-pravia-data-api-dev \
  --resource-group rg-pravia-mule-dev-eastus \
  --revision <revision-name>
```

---

## 🔧 Troubleshooting

### Authentication Required Error
```
ERROR: failed to push: unauthorized: authentication required
```
**Solution:** Re-login to ACR
```bash
az acr login --name acrpraviamuledevereh4t
```

### Not Logged into Azure
```
ERROR: Please run 'az login' to setup account.
```
**Solution:** Login to Azure
```bash
az login
```

### Docker Buildx Not Available
```
ERROR: docker buildx command not found
```
**Solution:** Enable Docker Desktop experimental features or update Docker Desktop

---

## 🔗 Related Resources

- **Foundry API Deployment:** `api/foundry/deploy/`
- **Infrastructure Code:** `infra/azure/pravia-mule/`
- **Azure Portal:** https://portal.azure.com
- **Container Registry:** `acrpraviamuledevereh4t`
