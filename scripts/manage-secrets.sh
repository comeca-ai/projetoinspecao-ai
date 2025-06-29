#!/bin/bash

# manage-secrets.sh
# Script para gestão segura de variáveis de ambiente e secrets
# Autor: Claude Code Assistant
# Data: $(date +"%Y-%m-%d")

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SECRETS_DIR="/etc/inspecao-ai"
ENV_FILE="$SECRETS_DIR/.env"
ENV_TEMPLATE_FILE="$SECRETS_DIR/.env.template"
BACKUP_DIR="/var/backups/inspecao-ai/secrets"

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Help function
show_help() {
    cat << EOF
Usage: $0 [COMMAND] [OPTIONS]

Commands:
    init            Initialize secrets management
    set <KEY> <VALUE>   Set an environment variable
    get <KEY>       Get an environment variable
    list            List all environment variables (values hidden)
    delete <KEY>    Delete an environment variable
    backup          Create backup of environment file
    restore <FILE>  Restore environment from backup
    validate        Validate environment configuration
    generate        Generate random secrets for common keys
    template        Create environment template file

Options:
    -h, --help      Show this help message
    -f, --force     Force operation without confirmation
    -q, --quiet     Suppress output

Examples:
    $0 init
    $0 set DATABASE_URL "postgresql://user:pass@localhost/db"
    $0 get DATABASE_URL
    $0 generate
    $0 validate
EOF
}

# Check if running with appropriate permissions
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root for security setup"
    fi
}

# Initialize secrets management
init_secrets() {
    log "Initializing secrets management..."
    
    # Create directories
    mkdir -p "$SECRETS_DIR"
    mkdir -p "$BACKUP_DIR"
    
    # Set secure permissions
    chmod 700 "$SECRETS_DIR"
    chmod 700 "$BACKUP_DIR"
    
    # Create empty env file if it doesn't exist
    if [[ ! -f "$ENV_FILE" ]]; then
        touch "$ENV_FILE"
        chmod 600 "$ENV_FILE"
        chown root:root "$ENV_FILE"
    fi
    
    # Create template file
    create_template
    
    log "Secrets management initialized"
}

# Create environment template
create_template() {
    log "Creating environment template..."
    
    cat > "$ENV_TEMPLATE_FILE" << 'EOF'
# Inspeção AI - Environment Variables Template
# Copy this file to .env and fill in the values

# Application Settings
NODE_ENV=production
PORT=8080
APP_NAME="Inspeção AI"
APP_URL=https://your-domain.com

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/inspecao_ai
DATABASE_SSL=true

# Supabase Configuration (if using Supabase)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Authentication & Security
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
SESSION_SECRET=your_session_secret_here

# API Keys
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password_here
EMAIL_FROM=noreply@your-domain.com

# File Storage
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# Monitoring & Logging
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn_here

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# SSL Configuration
SSL_CERT_PATH=/etc/letsencrypt/live/your-domain.com/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/your-domain.com/privkey.pem
EOF
    
    chmod 644 "$ENV_TEMPLATE_FILE"
    
    log "Environment template created at $ENV_TEMPLATE_FILE"
}

# Set environment variable
set_env_var() {
    local key="$1"
    local value="$2"
    
    if [[ -z "$key" || -z "$value" ]]; then
        error "Key and value are required"
    fi
    
    # Validate key format
    if [[ ! "$key" =~ ^[A-Z_][A-Z0-9_]*$ ]]; then
        error "Invalid key format. Use UPPERCASE_WITH_UNDERSCORES"
    fi
    
    # Backup current env file
    if [[ -f "$ENV_FILE" ]]; then
        cp "$ENV_FILE" "$ENV_FILE.backup"
    fi
    
    # Remove existing key if present
    if grep -q "^$key=" "$ENV_FILE" 2>/dev/null; then
        sed -i "/^$key=/d" "$ENV_FILE"
        info "Updated existing key: $key"
    else
        info "Added new key: $key"
    fi
    
    # Add new key=value
    echo "$key=$value" >> "$ENV_FILE"
    
    # Ensure secure permissions
    chmod 600 "$ENV_FILE"
    chown root:root "$ENV_FILE"
    
    log "Environment variable set successfully"
}

# Get environment variable
get_env_var() {
    local key="$1"
    
    if [[ -z "$key" ]]; then
        error "Key is required"
    fi
    
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file not found. Run 'init' first."
    fi
    
    local value=$(grep "^$key=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- | sed 's/^"\(.*\)"$/\1/')
    
    if [[ -n "$value" ]]; then
        echo "$value"
    else
        error "Key '$key' not found"
    fi
}

# List all environment variables
list_env_vars() {
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file not found. Run 'init' first."
    fi
    
    log "Environment variables:"
    
    while IFS='=' read -r key value; do
        if [[ -n "$key" && ! "$key" =~ ^[[:space:]]*# ]]; then
            # Hide sensitive values
            if [[ "$key" =~ (SECRET|KEY|PASS|TOKEN|URL) ]]; then
                echo "  $key=***HIDDEN***"
            else
                echo "  $key=$value"
            fi
        fi
    done < "$ENV_FILE"
}

# Delete environment variable
delete_env_var() {
    local key="$1"
    
    if [[ -z "$key" ]]; then
        error "Key is required"
    fi
    
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file not found"
    fi
    
    if grep -q "^$key=" "$ENV_FILE"; then
        # Backup before deletion
        cp "$ENV_FILE" "$ENV_FILE.backup"
        
        # Remove the key
        sed -i "/^$key=/d" "$ENV_FILE"
        
        log "Environment variable '$key' deleted"
    else
        warn "Key '$key' not found"
    fi
}

# Backup environment file
backup_env() {
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file not found"
    fi
    
    local backup_file="$BACKUP_DIR/env_backup_$(date +%Y%m%d_%H%M%S).env"
    
    cp "$ENV_FILE" "$backup_file"
    chmod 600 "$backup_file"
    
    log "Environment backup created: $backup_file"
}

# Restore environment file
restore_env() {
    local restore_file="$1"
    
    if [[ -z "$restore_file" ]]; then
        error "Backup file path is required"
    fi
    
    if [[ ! -f "$restore_file" ]]; then
        error "Backup file not found: $restore_file"
    fi
    
    # Backup current file
    if [[ -f "$ENV_FILE" ]]; then
        cp "$ENV_FILE" "$ENV_FILE.pre_restore"
    fi
    
    # Restore from backup
    cp "$restore_file" "$ENV_FILE"
    chmod 600 "$ENV_FILE"
    chown root:root "$ENV_FILE"
    
    log "Environment restored from: $restore_file"
}

# Validate environment configuration
validate_env() {
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file not found"
    fi
    
    log "Validating environment configuration..."
    
    local errors=0
    local warnings=0
    
    # Required variables
    local required_vars=(
        "NODE_ENV"
        "PORT"
        "APP_URL"
        "JWT_SECRET"
        "VITE_SUPABASE_URL"
        "VITE_SUPABASE_ANON_KEY"
    )
    
    # Check required variables
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$ENV_FILE"; then
            error "Required variable missing: $var"
            ((errors++))
        fi
    done
    
    # Check for weak secrets
    local weak_secrets=(
        "secret"
        "password"
        "123456"
        "your_key_here"
        "changeme"
    )
    
    for secret in "${weak_secrets[@]}"; do
        if grep -qi "$secret" "$ENV_FILE"; then
            warn "Weak or default secret detected. Please change it."
            ((warnings++))
        fi
    done
    
    # Check URL formats
    if grep -q "^APP_URL=" "$ENV_FILE"; then
        local app_url=$(get_env_var "APP_URL")
        if [[ ! "$app_url" =~ ^https?:// ]]; then
            warn "APP_URL should include protocol (https://)"
            ((warnings++))
        fi
    fi
    
    # Check port number
    if grep -q "^PORT=" "$ENV_FILE"; then
        local port=$(get_env_var "PORT")
        if [[ ! "$port" =~ ^[0-9]+$ ]] || [[ "$port" -lt 1 ]] || [[ "$port" -gt 65535 ]]; then
            error "Invalid port number: $port"
            ((errors++))
        fi
    fi
    
    # Summary
    if [[ $errors -eq 0 && $warnings -eq 0 ]]; then
        log "Environment validation passed ✓"
    else
        warn "Validation completed with $errors error(s) and $warnings warning(s)"
        if [[ $errors -gt 0 ]]; then
            exit 1
        fi
    fi
}

# Generate random secrets
generate_secrets() {
    log "Generating random secrets..."
    
    # Generate strong random strings
    local jwt_secret=$(openssl rand -hex 32)
    local encryption_key=$(openssl rand -hex 32)
    local session_secret=$(openssl rand -hex 24)
    
    info "Generated secrets (copy these to your .env file):"
    echo "JWT_SECRET=$jwt_secret"
    echo "ENCRYPTION_KEY=$encryption_key"
    echo "SESSION_SECRET=$session_secret"
    
    read -p "Do you want to automatically set these in the environment file? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        set_env_var "JWT_SECRET" "$jwt_secret"
        set_env_var "ENCRYPTION_KEY" "$encryption_key"
        set_env_var "SESSION_SECRET" "$session_secret"
        log "Secrets have been set in the environment file"
    fi
}

# Main function
main() {
    local command="${1:-}"
    
    case "$command" in
        "init")
            check_permissions
            init_secrets
            ;;
        "set")
            check_permissions
            set_env_var "${2:-}" "${3:-}"
            ;;
        "get")
            get_env_var "${2:-}"
            ;;
        "list")
            list_env_vars
            ;;
        "delete")
            check_permissions
            delete_env_var "${2:-}"
            ;;
        "backup")
            check_permissions
            backup_env
            ;;
        "restore")
            check_permissions
            restore_env "${2:-}"
            ;;
        "validate")
            validate_env
            ;;
        "generate")
            check_permissions
            generate_secrets
            ;;
        "template")
            check_permissions
            create_template
            ;;
        "-h"|"--help"|"help"|"")
            show_help
            ;;
        *)
            error "Unknown command: $command. Use --help for usage information."
            ;;
    esac
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi