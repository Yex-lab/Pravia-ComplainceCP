# Mule Vite Deployment Guide

## Azure Static Web App

**Resource Name:** `swa-pravia-app-dev`  
**Resource Group:** `rg-pravia-mule-dev-eastus`  
**Region:** East US 2  
**Preview URL:** https://blue-sea-08fbdc80f-preview.eastus2.3.azurestaticapps.net  
**Production URL:** https://blue-sea-08fbdc80f.3.azurestaticapps.net

## Manual Deployment

### Prerequisites
- Azure CLI installed and authenticated
- Node.js >= 20
- pnpm installed

### Steps

1. **Ensure correct environment variables**
   ```bash
   # Make sure .env has the correct API URLs
   # .env.local will override .env if it exists
   cat .env | grep VITE_
   ```

2. **Run deployment script**
   ```bash
   cd apps/mule-vite
   ./deploy/deploy-azure.sh
   ```

The script will:
- Build the application with production optimizations
- Get the deployment token from Azure
- Deploy to Azure Static Web App preview environment

## GitHub Actions (Not Yet Configured)

To set up automated deployments:

1. Create `.github/workflows/deploy-mule-vite.yml`
2. Add Azure Static Web App deployment token as GitHub secret
3. Configure workflow to trigger on push to main branch

## Environment Variables

Environment variables are baked into the build at build time (Vite behavior).

### Client-side variables (in .env):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (safe to expose)
- `VITE_AUTH_API_URL` - Auth API endpoint
- `VITE_DATA_API_URL` - Data API endpoint
- `VITE_APP_ENV` - Environment name
- `VITE_LOG_LEVEL` - Logging level
- `VITE_PRVC_*` - PRVC configuration IDs

### Important Notes:
- `.env.local` overrides `.env` - use for local development only
- Never commit `.env.local` to git
- Supabase anon key is safe to expose (designed for client-side use)
- Service role keys should NEVER be in client builds

## Troubleshooting

### API calls going to localhost
- Check if `.env.local` exists and has localhost URLs
- Rename `.env.local` to `.env.local.bak` for deployments
- Clear Vite cache: `rm -rf node_modules/.vite dist`
- Rebuild: `pnpm build`

### Routing not working (404 errors)
- Ensure `public/staticwebapp.config.json` exists
- Config should have `navigationFallback` set to `/index.html`

### Environment variables not updating
- Remember: Vite env vars are baked in at build time
- Must rebuild after changing .env files
- Check built files: `grep "your-api-url" dist/assets/*.js`
