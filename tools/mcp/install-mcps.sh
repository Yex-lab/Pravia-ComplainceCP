#!/bin/bash

# MCP Installer for Pravia Monorepo
# Manages both custom (local) and popular (public) MCP servers

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Custom MCPs in ./tools/
declare -A CUSTOM_MCPS=(
    ["aws-docs-mcp"]="AWS documentation and guides"
    ["aws-resources-mcp"]="AWS resource recommendations and best practices"
    ["component-converter-mcp"]="UI component conversion tools"
    ["context-manager-mcp"]="Context and session management"
    ["frontend-templates-mcp"]="Frontend code templates"
    ["monorepo-compliance-mcp"]="Monorepo standards and compliance"
    ["npm-packages-mcp"]="NPM package information and versions"
)

# Popular MCPs from npm registry
declare -A POPULAR_MCPS=(
    ["filesystem"]="File system operations"
    ["brave-search"]="Web search capabilities"
    ["github"]="GitHub repository management"
    ["postgres"]="PostgreSQL database operations"
    ["sqlite"]="SQLite database operations"
    ["puppeteer"]="Web automation and scraping"
    ["fetch"]="HTTP requests and API interactions"
    ["memory"]="Persistent memory and context storage"
)

print_header() {
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    MCP Installer                             ║${NC}"
    echo -e "${BLUE}║          Custom (Local) + Popular (Public) MCPs             ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
}

show_custom_status() {
    echo -e "${YELLOW}📋 Custom MCP Status (./tools/):${NC}"
    echo
    
    for mcp in "${!CUSTOM_MCPS[@]}"; do
        echo -n "  $mcp: "
        if [[ -f "./$mcp/package.json" ]]; then
            echo -e "${GREEN}✅ Available${NC}"
        else
            echo -e "${RED}❌ Not found${NC}"
        fi
        echo -e "     ${CUSTOM_MCPS[$mcp]}"
        echo
    done
}

install_popular_mcp() {
    local name=$1
    echo -e "${YELLOW}Installing ${name}...${NC}"
    
    if npx @modelcontextprotocol/create-server@latest "$name" --yes --directory "../mcp-servers/$name" 2>/dev/null; then
        echo -e "${GREEN}✅ Successfully installed ${name}${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to install ${name}${NC}"
        return 1
    fi
}

install_popular_mcps() {
    echo -e "${YELLOW}═══ POPULAR MCPs ═══${NC}"
    echo
    
    local installed_count=0
    
    for mcp in "${!POPULAR_MCPS[@]}"; do
        echo -e "${CYAN}📦 ${mcp}${NC}"
        echo -e "   ${POPULAR_MCPS[$mcp]}"
        echo
        
        read -p "Install this MCP? [y/N/q(uit)]: " choice
        case $choice in
            [Yy]*)
                if install_popular_mcp "$mcp"; then
                    ((installed_count++))
                fi
                ;;
            [Qq]*)
                echo -e "${RED}🛑 Installation cancelled${NC}"
                break
                ;;
            *)
                echo -e "${YELLOW}⏭️  Skipped ${mcp}${NC}"
                ;;
        esac
        echo
    done
    
    echo -e "${GREEN}🎉 Installed ${installed_count} popular MCP(s)${NC}"
}

main() {
    print_header
    
    echo -e "${PURPLE}Choose installation type:${NC}"
    echo -e "  ${CYAN}1${NC} - Show custom MCP status"
    echo -e "  ${CYAN}2${NC} - Install popular MCPs"
    echo -e "  ${CYAN}3${NC} - Both"
    echo -e "  ${CYAN}q${NC} - Quit"
    echo
    
    read -p "Your choice [1/2/3/q]: " choice
    
    case $choice in
        1)
            echo
            show_custom_status
            echo -e "${BLUE}💡 Configure Q CLI MCP settings to enable/disable custom MCPs${NC}"
            ;;
        2)
            echo
            mkdir -p ../mcp-servers
            install_popular_mcps
            ;;
        3)
            echo
            show_custom_status
            echo
            mkdir -p ../mcp-servers
            install_popular_mcps
            ;;
        [Qq]*)
            echo -e "${YELLOW}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
}

main "$@"