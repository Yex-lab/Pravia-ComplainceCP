# Pravia CRM Platform

A modern CRM platform built with a microservices architecture using pnpm workspaces, featuring self-hosted Supabase and AWS deployment.

## 📋 Quick Navigation

### **🚀 Getting Started**
- [**Quick Start Guide**](./docs/getting-started/README.md) - Get running in 2 minutes
- [**Architecture Overview**](./docs/getting-started/architecture.md) - System design and components
- [**Essential Commands**](./docs/getting-started/commands.md) - Key development commands

### **🏗️ Infrastructure & Deployment**
- [**Deployment Guide**](./docs/infrastructure/README.md) - Production deployment steps
- [**Monitoring & Dashboards**](./docs/infrastructure/monitoring.md) - CloudWatch dashboards and alerts
- [**Cost Estimation**](./docs/infrastructure/cost-estimation.md) - Monthly cost breakdown
- **Deployment Stacks**
  - [**Foundation Stack**](./infra/aws/cdk/foundation-infra/README.md) - Shared infrastructure (DNS, SSL, storage)
  - [**Supabase Stack**](./infra/aws/cdk/supabase-infra/README.md) - Application infrastructure

### **🛠️ Development**
- [**Development Workflow**](./docs/development/README.md) - Local development setup
- [**UI Components**](./docs/development/ui-components.md) - Reusable UI package guide
- [**Standards**](./docs/development/standards.md) - Code quality, linting, and formatting standards
- [**Testing**](./docs/development/testing.md) - Jest testing guide and Playwright roadmap
- [**Database Options**](./docs/development/database-options.md) - PostgreSQL vs Supabase
- [**Configuration**](./docs/development/configuration.md) - Environment setup

> **AWS Credentials:** Use `--profile dev` for AWS CLI commands. Long-term access keys are configured for development convenience.

### **📚 Reference**
- [**Project Structure**](./docs/reference/project-structure.md) - Directory organization
- [**Troubleshooting**](./docs/reference/troubleshooting.md) - Common issues and solutions
- [**API Documentation**](./docs/reference/api-docs.md) - Service documentation links

### **🤖 AI Development Tools**
- [**MCP Extensions**](./docs/tools/README.md) - Model Context Protocol servers for enhanced AI capabilities

### **🤝 Contributing**
- [**Contributing Guide**](./CONTRIBUTING.md) - How to contribute to the project

---

## 📄 License

[Your License Here]
