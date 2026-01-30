# AWS Resources MCP Server

An MCP (Model Context Protocol) server that provides up-to-date AWS resource information, best practices, and infrastructure recommendations for building robust cloud infrastructure.

## Features

- **Latest AWS Resources**: Get current information about AWS service versions, instance types, and configurations
- **Best Practices**: Access AWS Well-Architected Framework recommendations
- **Resource Recommendations**: Get tailored suggestions based on use case and budget
- **Configuration Validation**: Validate infrastructure configurations against AWS best practices

## Available Tools

### 1. `get_latest_aws_resources`
Get the latest AWS resource types, versions, and recommendations.

**Parameters:**
- `service` (optional): AWS service category (`compute`, `storage`, `database`, `networking`, `security`, or `all`)

**Example:**
```bash
# Get all latest resources
get_latest_aws_resources

# Get only compute resources
get_latest_aws_resources --service compute
```

### 2. `get_aws_best_practices`
Get AWS best practices for infrastructure optimization.

**Parameters:**
- `category` (optional): Best practice category (`cost_optimization`, `security`, `performance`, `reliability`, or `all`)

**Example:**
```bash
# Get all best practices
get_aws_best_practices

# Get only security best practices
get_aws_best_practices --category security
```

### 3. `check_resource_recommendations`
Get specific recommendations for AWS resources based on use case.

**Parameters:**
- `use_case` (required): Use case type (`web_app`, `api_backend`, `data_processing`, `ml_workload`, etc.)
- `budget` (optional): Budget consideration (`low`, `medium`, `high`) - defaults to `medium`

**Example:**
```bash
# Get recommendations for a web app with medium budget
check_resource_recommendations --use_case web_app --budget medium

# Get recommendations for API backend with low budget
check_resource_recommendations --use_case api_backend --budget low
```

### 4. `validate_infrastructure_config`
Validate infrastructure configuration against AWS best practices.

**Parameters:**
- `config` (required): Infrastructure configuration in JSON or YAML format

**Example:**
```bash
# Validate a CloudFormation template
validate_infrastructure_config --config '{"Resources": {"MyInstance": {"Type": "AWS::EC2::Instance", "Properties": {"InstanceType": "t3.micro"}}}}'
```

## Installation

1. Navigate to the tools directory:
```bash
cd tools/aws-resources-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Make the script executable:
```bash
chmod +x aws-resources-mcp.js
```

## Usage

### Standalone Usage
```bash
node aws-resources-mcp.js
```

### Integration with Amazon Q CLI

Add this MCP server to your Q CLI configuration to access AWS resource information directly in your development workflow.

## Resource Categories

### Compute
- EC2 instance types and recommendations
- Lambda runtime versions and limits
- ECS platform versions and capacity providers

### Storage
- S3 storage classes and recommendations
- EBS volume types and performance characteristics

### Database
- RDS engine versions and instance classes
- DynamoDB billing modes and recommendations

### Networking
- VPC configuration recommendations
- Load balancer types and protocols

### Security
- IAM policies and best practices
- KMS key types and recommendations

## Best Practice Categories

### Cost Optimization
- Spot instance usage
- Auto-scaling implementation
- Reserved instance recommendations
- Storage tiering strategies

### Security
- VPC Flow Logs
- AWS Config compliance
- Least privilege access
- Audit logging with CloudTrail

### Performance
- CloudFront CDN usage
- Database read replicas
- Caching strategies
- EBS optimization

### Reliability
- Multi-AZ deployments
- Health checks
- Auto Scaling Groups
- Automated backups

## Contributing

To add new AWS resources or best practices:

1. Update the `AWS_RESOURCES` object with new service information
2. Add new best practices to the `BEST_PRACTICES` object
3. Extend the recommendation logic in `getResourceRecommendations()`
4. Add validation rules in `validateInfrastructureConfig()`

## License

MIT License - see the main project LICENSE file for details.
