#!/bin/bash
set -e

# Colors for logging
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Validate required arguments
if [ -z "$1" ] || [ -z "$2" ]; then
  log_error "Usage: $0 <package-path> <git-repo-url>"
  log_info "Example: $0 packages/api-types git@github.com:org/api-types.git"
  exit 1
fi

PACKAGE_PATH="$1"
GIT_REPO="$2"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
TEMP_DIR="/tmp/deploy_${TIMESTAMP}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/../logs/packages/deploy"
LOG_FILE="$LOG_DIR/deploy_${TIMESTAMP}.log"

# Create log directory
mkdir -p "$LOG_DIR"

# Redirect all output to log file and console
exec > >(tee -a "$LOG_FILE") 2>&1

log_info "Starting deployment at $(date)"
log_info "Package: $PACKAGE_PATH"
log_info "Target repo: $GIT_REPO"
log_info "Log file: $LOG_FILE"

# Validate package exists
if [ ! -d "$PACKAGE_PATH" ]; then
  log_error "Package path does not exist: $PACKAGE_PATH"
  exit 1
fi

cd "$PACKAGE_PATH"

# Get package info
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
log_info "Deploying $PACKAGE_NAME@$PACKAGE_VERSION"

# Build package
log_info "Building package..."
if pnpm build; then
  log_success "Build completed"
else
  log_error "Build failed"
  exit 1
fi

# Create temp directory
log_info "Preparing deployment directory..."
mkdir -p "$TEMP_DIR"

# Copy necessary files
log_info "Copying files..."
cp -r dist "$TEMP_DIR/" 2>/dev/null || log_warn "No dist directory"
cp package.json "$TEMP_DIR/"
cp README.md "$TEMP_DIR/" 2>/dev/null || log_warn "No README.md"
cp LICENSE "$TEMP_DIR/" 2>/dev/null || log_warn "No LICENSE"
[ -f ".npmignore" ] && cp .npmignore "$TEMP_DIR/"

cd "$TEMP_DIR"

# Initialize git if needed
if [ ! -d ".git" ]; then
  log_info "Initializing git repository..."
  git init
  git remote add origin "$GIT_REPO"
fi

# Configure git - use global config if available
GIT_USER_NAME="${GIT_USER_NAME:-$(git config --global user.name || echo 'CI Deploy')}"
GIT_USER_EMAIL="${GIT_USER_EMAIL:-$(git config --global user.email || echo 'deploy@pravia.local')}"
git config user.name "$GIT_USER_NAME"
git config user.email "$GIT_USER_EMAIL"
log_info "Using git user: $GIT_USER_NAME <$GIT_USER_EMAIL>"

# Commit and push
log_info "Committing changes..."
git add -A
git commit -m "Release v${PACKAGE_VERSION} - $(date -u +%Y-%m-%dT%H:%M:%SZ)" || log_warn "No changes to commit"

log_info "Pushing to remote..."
if git push -f origin main 2>&1; then
  log_success "Successfully pushed to $GIT_REPO"
else
  log_error "Push failed"
  exit 1
fi

# Tag version
log_info "Creating version tag..."
git tag -a "v${PACKAGE_VERSION}" -m "Version ${PACKAGE_VERSION}" || log_warn "Tag already exists"
git push origin "v${PACKAGE_VERSION}" 2>&1 || log_warn "Tag push failed"

# Cleanup
cd -
rm -rf "$TEMP_DIR"
log_success "Deployment complete!"
log_info "Cleaned up temporary directory"
log_info "Log saved to: $LOG_FILE"
