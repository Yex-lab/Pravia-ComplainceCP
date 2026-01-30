#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

if [ -z "$1" ]; then
  log_error "Usage: $0 <repo-name> [description]"
  log_info "Example: $0 api-types 'Shared TypeScript types'"
  exit 1
fi

REPO_NAME="$1"
DESCRIPTION="${2:-Private package repository}"

log_info "Creating private repository: $REPO_NAME"

# Temporarily unset GITHUB_TOKEN if it's invalid
unset GITHUB_TOKEN

# Create repo using GitHub CLI
if command -v gh &> /dev/null; then
  gh repo create "$REPO_NAME" --private --description "$DESCRIPTION"
  log_success "Repository created: https://github.com/$(gh api user -q .login)/$REPO_NAME"
else
  log_error "GitHub CLI (gh) not installed"
  log_info "Install with: brew install gh"
  log_info "Then authenticate: gh auth login"
  exit 1
fi
