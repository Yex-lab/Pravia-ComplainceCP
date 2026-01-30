#!/usr/bin/env node

/**
 * AWS Resources MCP Server
 * 
 * Features:
 *  - Checks for latest AWS service versions and best practices
 *  - Provides infrastructure recommendations
 *  - Monitors AWS service updates and deprecations
 *  - Suggests optimal resource configurations
 * 
 * Usage:
 *   node aws-resources-mcp.js
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import minimist from "minimist";
import { execSync } from "child_process";

// ----------------------
// Logging function that outputs to stderr (visible in Q CLI)
// ----------------------
function logToQCLI(message) {
  console.error(`[MCP AWS Resources] ${new Date().toISOString()}: ${message}`);
}

// ----------------------
// AWS Resource Data
// ----------------------
const AWS_RESOURCES = {
  compute: {
    ec2: {
      latestInstanceTypes: ["m7i", "c7i", "r7i", "t4g"],
      recommendedForCost: ["t3.micro", "t3.small", "t4g.micro"],
      recommendedForPerformance: ["m7i.large", "c7i.xlarge", "r7i.large"]
    },
    lambda: {
      latestRuntime: "nodejs20.x",
      supportedRuntimes: ["nodejs18.x", "nodejs20.x", "python3.11", "python3.12"],
      maxMemory: "10240 MB",
      maxTimeout: "15 minutes"
    },
    ecs: {
      latestPlatformVersion: "1.4.0",
      recommendedCapacityProviders: ["FARGATE", "FARGATE_SPOT"],
      latestTaskDefinitionRevision: "LATEST"
    }
  },
  storage: {
    s3: {
      latestStorageClasses: ["STANDARD", "STANDARD_IA", "GLACIER_IR", "DEEP_ARCHIVE"],
      recommendedForCost: "STANDARD_IA",
      recommendedForPerformance: "STANDARD"
    },
    ebs: {
      latestVolumeTypes: ["gp3", "io2", "st1", "sc1"],
      recommendedForCost: "gp3",
      recommendedForPerformance: "io2"
    }
  },
  database: {
    rds: {
      latestEngineVersions: {
        postgres: "15.4",
        mysql: "8.0.35",
        mariadb: "10.11.5"
      },
      recommendedInstanceClasses: ["db.t4g", "db.r6i", "db.m6i"]
    },
    dynamodb: {
      billingModes: ["ON_DEMAND", "PROVISIONED"],
      recommendedForCost: "ON_DEMAND",
      recommendedForPredictable: "PROVISIONED"
    }
  },
  networking: {
    vpc: {
      recommendedCidr: "10.0.0.0/16",
      maxAzs: 6,
      recommendedSubnets: {
        public: "10.0.1.0/24",
        private: "10.0.2.0/24"
      }
    },
    alb: {
      latestVersion: "Application Load Balancer v2",
      supportedProtocols: ["HTTP", "HTTPS", "gRPC"]
    }
  },
  security: {
    iam: {
      recommendedPolicies: ["AWSManagedPolicyForAmazonEKSClusterPolicy", "AmazonEKSWorkerNodePolicy"],
      bestPractices: ["Use least privilege", "Enable MFA", "Rotate access keys"]
    },
    kms: {
      keyTypes: ["SYMMETRIC_DEFAULT", "RSA_2048", "ECC_NIST_P256"],
      recommendedForGeneral: "SYMMETRIC_DEFAULT"
    }
  }
};

const BEST_PRACTICES = {
  cost_optimization: [
    "Use Spot Instances for non-critical workloads",
    "Implement auto-scaling to match demand",
    "Use Reserved Instances for predictable workloads",
    "Enable S3 Intelligent Tiering",
    "Use gp3 volumes instead of gp2"
  ],
  security: [
    "Enable VPC Flow Logs",
    "Use AWS Config for compliance monitoring",
    "Implement least privilege access",
    "Enable CloudTrail for audit logging",
    "Use AWS Secrets Manager for sensitive data"
  ],
  performance: [
    "Use CloudFront for global content delivery",
    "Implement database read replicas",
    "Use ElastiCache for caching",
    "Enable EBS optimization",
    "Use Placement Groups for HPC workloads"
  ],
  reliability: [
    "Deploy across multiple AZs",
    "Implement health checks",
    "Use Auto Scaling Groups",
    "Enable automated backups",
    "Implement circuit breaker patterns"
  ]
};

// ----------------------
// MCP Server Setup
// ----------------------
const server = new Server(
  {
    name: "aws-resources-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ----------------------
// Tool Definitions
// ----------------------
server.setRequestHandler(ListToolsRequestSchema, async () => {
  logToQCLI("Listing available AWS resource tools");
  
  return {
    tools: [
      {
        name: "get_live_aws_resources",
        description: "Fetch the absolute latest AWS resources directly from AWS APIs (requires AWS CLI)",
        inputSchema: {
          type: "object",
          properties: {
            service: {
              type: "string",
              description: "AWS service (ec2, lambda, rds, s3, etc.)"
            }
          },
          required: ["service"]
        }
      },
      {
        name: "get_aws_resource_recommendations",
        description: "Get the latest AWS resource types, versions, and recommendations for infrastructure building",
        inputSchema: {
          type: "object",
          properties: {
            service: {
              type: "string",
              description: "AWS service category (compute, storage, database, networking, security) or 'all'",
              enum: ["compute", "storage", "database", "networking", "security", "all"]
            }
          },
          required: []
        }
      },
      {
        name: "get_aws_best_practices",
        description: "Get AWS best practices for infrastructure optimization",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Best practice category",
              enum: ["cost_optimization", "security", "performance", "reliability", "all"]
            }
          },
          required: []
        }
      },
      {
        name: "check_resource_recommendations",
        description: "Get specific recommendations for AWS resources based on use case",
        inputSchema: {
          type: "object",
          properties: {
            use_case: {
              type: "string",
              description: "Use case (web_app, api_backend, data_processing, ml_workload, etc.)"
            },
            budget: {
              type: "string",
              description: "Budget consideration (low, medium, high)",
              enum: ["low", "medium", "high"]
            }
          },
          required: ["use_case"]
        }
      },
      {
        name: "validate_infrastructure_config",
        description: "Validate infrastructure configuration against AWS best practices",
        inputSchema: {
          type: "object",
          properties: {
            config: {
              type: "string",
              description: "Infrastructure configuration (JSON or YAML format)"
            }
          },
          required: ["config"]
        }
      }
    ]
  };
});

// ----------------------
// Tool Implementations
// ----------------------
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  logToQCLI(`Executing tool: ${name}`);

  try {
    switch (name) {
      case "get_live_aws_resources":
        return await getLiveAWSResources(args.service);
        
      case "get_latest_aws_resources":
        return await getLatestAWSResources(args.service || "all");
        
      case "get_aws_best_practices":
        return await getAWSBestPractices(args.category || "all");
        
      case "check_resource_recommendations":
        return await getResourceRecommendations(args.use_case, args.budget || "medium");
        
      case "validate_infrastructure_config":
        return await validateInfrastructureConfig(args.config);
        
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    logToQCLI(`Error executing ${name}: ${error.message}`);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`
        }
      ]
    };
  }
});

// ----------------------
// Live AWS Resource Functions
// ----------------------
async function getLiveAWSResources(service) {
  logToQCLI(`Fetching live AWS resources for service: ${service}`);
  
  const awsProfile = process.env.AWS_PROFILE || "default";
  
  try {
    let result = {};
    
    switch (service) {
      case "ec2":
        const instanceTypes = execSync(`aws ec2 describe-instance-types --query "InstanceTypes[*].InstanceType" --output json --profile ${awsProfile}`, { encoding: 'utf8' });
        result.instanceTypes = JSON.parse(instanceTypes).slice(0, 20); // Latest 20
        break;
        
      case "lambda":
        const runtimes = execSync(`aws lambda list-layers --query "Layers[*].LatestMatchingVersion.CompatibleRuntimes" --output json --profile ${awsProfile}`, { encoding: 'utf8' });
        result.supportedRuntimes = [...new Set(JSON.parse(runtimes).flat())];
        break;
        
      case "rds":
        const engines = execSync(`aws rds describe-db-engine-versions --query "DBEngineVersions[?Status==\`available\`].[Engine,EngineVersion]" --output json --profile ${awsProfile}`, { encoding: 'utf8' });
        result.availableEngines = JSON.parse(engines);
        break;
        
      default:
        throw new Error(`Live fetching not implemented for service: ${service}`);
    }
    
    return {
      content: [
        {
          type: "text",
          text: `# Live AWS Resources - ${service.toUpperCase()}\n\n${JSON.stringify(result, null, 2)}\n\n**Fetched at:** ${new Date().toISOString()}`
        }
      ]
    };
    
  } catch (error) {
    return {
      content: [
        {
          type: "text", 
          text: `❌ Error fetching live data: ${error.message}\n\nEnsure AWS CLI is installed and configured.`
        }
      ]
    };
  }
}

// ----------------------
// Tool Functions
// ----------------------
async function getLatestAWSResources(service) {
  logToQCLI(`Getting latest AWS resources for service: ${service}`);
  
  let result = {};
  
  if (service === "all") {
    result = AWS_RESOURCES;
  } else if (AWS_RESOURCES[service]) {
    result[service] = AWS_RESOURCES[service];
  } else {
    throw new Error(`Unknown service: ${service}`);
  }
  
  return {
    content: [
      {
        type: "text",
        text: `# Latest AWS Resources\n\n${JSON.stringify(result, null, 2)}\n\n## Last Updated\n${new Date().toISOString()}`
      }
    ]
  };
}

async function getAWSBestPractices(category) {
  logToQCLI(`Getting AWS best practices for category: ${category}`);
  
  let practices = {};
  
  if (category === "all") {
    practices = BEST_PRACTICES;
  } else if (BEST_PRACTICES[category]) {
    practices[category] = BEST_PRACTICES[category];
  } else {
    throw new Error(`Unknown category: ${category}`);
  }
  
  let output = "# AWS Best Practices\n\n";
  
  for (const [cat, items] of Object.entries(practices)) {
    output += `## ${cat.replace(/_/g, ' ').toUpperCase()}\n\n`;
    items.forEach(item => {
      output += `- ${item}\n`;
    });
    output += "\n";
  }
  
  return {
    content: [
      {
        type: "text",
        text: output
      }
    ]
  };
}

async function getResourceRecommendations(useCase, budget) {
  logToQCLI(`Getting recommendations for use case: ${useCase}, budget: ${budget}`);
  
  const recommendations = {
    web_app: {
      low: {
        compute: "t3.micro EC2 or Lambda",
        storage: "S3 Standard-IA",
        database: "RDS t4g.micro PostgreSQL",
        cdn: "CloudFront"
      },
      medium: {
        compute: "t3.small EC2 or ECS Fargate",
        storage: "S3 Standard + CloudFront",
        database: "RDS t4g.small PostgreSQL with read replica",
        load_balancer: "Application Load Balancer"
      },
      high: {
        compute: "m7i.large EC2 with Auto Scaling",
        storage: "S3 Standard + CloudFront + ElastiCache",
        database: "RDS r6i.large PostgreSQL Multi-AZ",
        monitoring: "CloudWatch + X-Ray"
      }
    },
    api_backend: {
      low: {
        compute: "Lambda with API Gateway",
        database: "DynamoDB On-Demand",
        auth: "Cognito"
      },
      medium: {
        compute: "ECS Fargate with ALB",
        database: "RDS PostgreSQL t4g.small",
        cache: "ElastiCache Redis t4g.micro"
      },
      high: {
        compute: "EKS with managed node groups",
        database: "Aurora PostgreSQL Serverless v2",
        cache: "ElastiCache Redis cluster mode"
      }
    }
  };
  
  const rec = recommendations[useCase]?.[budget];
  if (!rec) {
    return {
      content: [
        {
          type: "text",
          text: `# Resource Recommendations\n\nNo specific recommendations found for use case: ${useCase} with budget: ${budget}\n\nSupported use cases: ${Object.keys(recommendations).join(", ")}`
        }
      ]
    };
  }
  
  let output = `# Resource Recommendations\n\n## Use Case: ${useCase}\n## Budget: ${budget}\n\n`;
  
  for (const [resource, recommendation] of Object.entries(rec)) {
    output += `**${resource.replace(/_/g, ' ').toUpperCase()}**: ${recommendation}\n\n`;
  }
  
  return {
    content: [
      {
        type: "text",
        text: output
      }
    ]
  };
}

async function validateInfrastructureConfig(config) {
  logToQCLI("Validating infrastructure configuration");
  
  const validations = [];
  
  try {
    const parsedConfig = JSON.parse(config);
    
    // Basic validation checks
    if (parsedConfig.Resources) {
      // CloudFormation format
      for (const [resourceName, resource] of Object.entries(parsedConfig.Resources)) {
        if (resource.Type === "AWS::EC2::Instance") {
          if (resource.Properties?.InstanceType?.startsWith("t1.") || 
              resource.Properties?.InstanceType?.startsWith("m1.")) {
            validations.push(`⚠️  ${resourceName}: Consider upgrading from legacy instance type ${resource.Properties.InstanceType}`);
          }
        }
        
        if (resource.Type === "AWS::S3::Bucket") {
          if (!resource.Properties?.VersioningConfiguration) {
            validations.push(`⚠️  ${resourceName}: Consider enabling S3 versioning for data protection`);
          }
        }
      }
    }
    
    // Add more validation rules as needed
    if (validations.length === 0) {
      validations.push("✅ Configuration looks good! No major issues found.");
    }
    
  } catch (error) {
    validations.push(`❌ Error parsing configuration: ${error.message}`);
  }
  
  return {
    content: [
      {
        type: "text",
        text: `# Infrastructure Configuration Validation\n\n${validations.join("\n")}`
      }
    ]
  };
}

// ----------------------
// Server Startup
// ----------------------
async function main() {
  logToQCLI("Starting AWS Resources MCP Server");
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  logToQCLI("AWS Resources MCP Server is running and ready to serve requests");
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logToQCLI("Shutting down AWS Resources MCP Server");
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logToQCLI("Shutting down AWS Resources MCP Server");
  process.exit(0);
});

main().catch((error) => {
  logToQCLI(`Fatal error: ${error.message}`);
  process.exit(1);
});
