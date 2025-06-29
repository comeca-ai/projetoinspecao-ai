#!/bin/bash

# ssl-setup.sh
# Script para automação de certificados SSL com Let's Encrypt
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
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
SSL_CONFIG_DIR="/etc/nginx/ssl"
DHPARAM_FILE="/etc/nginx/ssl/dhparam.pem"

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
    setup <domain>      Setup SSL for domain
    renew              Renew all certificates
    status             Check SSL certificate status
    remove <domain>    Remove SSL configuration for domain
    test <domain>      Test SSL configuration
    auto-renew         Setup automatic renewal

Options:
    -e, --email <email>    Email for Let's Encrypt notifications
    -f, --force           Force certificate renewal
    -t, --test-cert       Use staging certificates for testing
    -h, --help           Show this help message

Examples:
    $0 setup example.com --email admin@example.com
    $0 renew
    $0 status
    $0 test example.com
EOF
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root"
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        error "Certbot is not installed. Run setup-production.sh first."
    fi
    
    # Check if nginx is installed and running
    if ! command -v nginx &> /dev/null; then
        error "Nginx is not installed. Run setup-production.sh first."
    fi
    
    if ! systemctl is-active --quiet nginx; then
        warn "Nginx is not running. Starting nginx..."
        systemctl start nginx
    fi
    
    # Check if port 80 and 443 are available
    if netstat -tuln | grep -q ":80 "; then
        local port80_process=$(netstat -tulnp | grep ":80 " | awk '{print $7}' | head -n1)
        if [[ "$port80_process" != *"nginx"* ]]; then
            warn "Port 80 is occupied by: $port80_process"
        fi
    fi
    
    log "Prerequisites check completed"
}

# Validate domain
validate_domain() {
    local domain="$1"
    
    if [[ -z "$domain" ]]; then
        error "Domain is required"
    fi
    
    # Basic domain validation
    if [[ ! "$domain" =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]]; then
        error "Invalid domain format: $domain"
    fi
    
    # Check if domain resolves to this server
    local domain_ip=$(dig +short "$domain" | tail -n1)
    local server_ip=$(curl -s http://ipinfo.io/ip)
    
    if [[ "$domain_ip" != "$server_ip" ]]; then
        warn "Domain $domain does not resolve to this server ($server_ip)"
        warn "Current DNS resolution: $domain_ip"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Aborted by user"
        fi
    fi
}

# Create SSL configuration directory
setup_ssl_config() {
    log "Setting up SSL configuration..."
    
    mkdir -p "$SSL_CONFIG_DIR"
    
    # Generate strong DH parameters if not exists
    if [[ ! -f "$DHPARAM_FILE" ]]; then
        info "Generating DH parameters (this may take a while)..."
        openssl dhparam -out "$DHPARAM_FILE" 2048
    fi
    
    # Create SSL configuration snippet
    cat > "$SSL_CONFIG_DIR/ssl-params.conf" << 'EOF'
# SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;

# SSL Session
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_stapling on;
ssl_stapling_verify on;

# DH Parameters
ssl_dhparam /etc/nginx/ssl/dhparam.pem;

# Security Headers
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
EOF
    
    log "SSL configuration setup completed"
}

# Create nginx site configuration
create_nginx_config() {
    local domain="$1"
    local config_file="$NGINX_SITES_AVAILABLE/$domain"
    
    log "Creating nginx configuration for $domain..."
    
    # Create initial HTTP configuration (for Let's Encrypt validation)
    cat > "$config_file" << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $domain;
    
    # Let's Encrypt validation
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# This HTTPS block will be uncommented after SSL certificate is obtained
# server {
#     listen 443 ssl http2;
#     listen [::]:443 ssl http2;
#     server_name $domain;
#     
#     # SSL Configuration
#     ssl_certificate /etc/letsencrypt/live/$domain/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/$domain/privkey.pem;
#     include /etc/nginx/ssl/ssl-params.conf;
#     
#     # Document root
#     root /var/www/inspecao-ai;
#     index index.html;
#     
#     # Application proxy
#     location / {
#         try_files \$uri \$uri/ /index.html;
#     }
#     
#     # API proxy (if needed)
#     location /api/ {
#         proxy_pass http://localhost:8080;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade \$http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host \$host;
#         proxy_set_header X-Real-IP \$remote_addr;
#         proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto \$scheme;
#         proxy_cache_bypass \$http_upgrade;
#     }
#     
#     # Security
#     location ~ /\. {
#         deny all;
#     }
#     
#     # Gzip
#     gzip on;
#     gzip_types text/css application/javascript application/json application/font-woff application/font-tff image/gif image/png image/jpeg application/octet-stream;
# }
EOF
    
    # Enable the site
    ln -sf "$config_file" "$NGINX_SITES_ENABLED/"
    
    # Test nginx configuration
    nginx -t || error "Nginx configuration test failed"
    
    # Reload nginx
    systemctl reload nginx
    
    log "Nginx configuration created and enabled"
}

# Obtain SSL certificate
obtain_ssl_certificate() {
    local domain="$1"
    local email="$2"
    local test_cert="${3:-false}"
    
    log "Obtaining SSL certificate for $domain..."
    
    local certbot_args=(
        "--nginx"
        "-d" "$domain"
        "--non-interactive"
        "--agree-tos"
        "--redirect"
    )
    
    if [[ -n "$email" ]]; then
        certbot_args+=("--email" "$email")
    else
        certbot_args+=("--register-unsafely-without-email")
    fi
    
    if [[ "$test_cert" == "true" ]]; then
        certbot_args+=("--staging")
        info "Using staging certificates for testing"
    fi
    
    # Run certbot
    if certbot "${certbot_args[@]}"; then
        log "SSL certificate obtained successfully"
    else
        error "Failed to obtain SSL certificate"
    fi
}

# Update nginx configuration for HTTPS
enable_https_config() {
    local domain="$1"
    local config_file="$NGINX_SITES_AVAILABLE/$domain"
    
    log "Enabling HTTPS configuration for $domain..."
    
    # Uncomment the HTTPS server block
    sed -i 's/^# server {/server {/' "$config_file"
    sed -i 's/^#     /    /' "$config_file"
    sed -i 's/^# }/}/' "$config_file"
    
    # Test and reload nginx
    nginx -t || error "Nginx configuration test failed"
    systemctl reload nginx
    
    log "HTTPS configuration enabled"
}

# Setup SSL for domain
setup_ssl() {
    local domain="$1"
    local email="$2"
    local test_cert="${3:-false}"
    
    check_root
    check_prerequisites
    validate_domain "$domain"
    setup_ssl_config
    create_nginx_config "$domain"
    obtain_ssl_certificate "$domain" "$email" "$test_cert"
    enable_https_config "$domain"
    
    log "SSL setup completed for $domain"
    info "Certificate location: /etc/letsencrypt/live/$domain/"
    info "Test your SSL configuration at: https://www.ssllabs.com/ssltest/analyze.html?d=$domain"
}

# Renew certificates
renew_certificates() {
    log "Renewing SSL certificates..."
    
    if certbot renew --quiet; then
        log "Certificate renewal completed"
        systemctl reload nginx
    else
        error "Certificate renewal failed"
    fi
}

# Check certificate status
check_certificate_status() {
    log "Checking SSL certificate status..."
    
    if [[ ! -d "/etc/letsencrypt/live" ]]; then
        warn "No certificates found"
        return
    fi
    
    for cert_dir in /etc/letsencrypt/live/*/; do
        if [[ -d "$cert_dir" ]]; then
            local domain=$(basename "$cert_dir")
            local cert_file="$cert_dir/cert.pem"
            
            if [[ -f "$cert_file" ]]; then
                local expiry_date=$(openssl x509 -enddate -noout -in "$cert_file" | cut -d= -f2)
                local expiry_timestamp=$(date -d "$expiry_date" +%s)
                local current_timestamp=$(date +%s)
                local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
                
                if [[ $days_until_expiry -lt 30 ]]; then
                    warn "Certificate for $domain expires in $days_until_expiry days"
                else
                    info "Certificate for $domain is valid for $days_until_expiry days"
                fi
            fi
        fi
    done
}

# Remove SSL configuration
remove_ssl() {
    local domain="$1"
    
    if [[ -z "$domain" ]]; then
        error "Domain is required"
    fi
    
    warn "This will remove SSL configuration for $domain"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        info "Operation cancelled"
        return
    fi
    
    # Remove nginx configuration
    rm -f "$NGINX_SITES_AVAILABLE/$domain"
    rm -f "$NGINX_SITES_ENABLED/$domain"
    
    # Remove SSL certificate
    certbot delete --cert-name "$domain" || warn "Failed to remove certificate"
    
    # Reload nginx
    systemctl reload nginx
    
    log "SSL configuration removed for $domain"
}

# Test SSL configuration
test_ssl() {
    local domain="$1"
    
    if [[ -z "$domain" ]]; then
        error "Domain is required"
    fi
    
    log "Testing SSL configuration for $domain..."
    
    # Test HTTPS connection
    if curl -sS --fail "https://$domain" > /dev/null; then
        log "HTTPS connection successful"
    else
        error "HTTPS connection failed"
    fi
    
    # Check SSL certificate
    local cert_info=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates)
    
    if [[ -n "$cert_info" ]]; then
        info "Certificate information:"
        echo "$cert_info"
    else
        error "Failed to retrieve certificate information"
    fi
    
    # Check SSL rating (requires external service)
    info "For detailed SSL analysis, visit: https://www.ssllabs.com/ssltest/analyze.html?d=$domain"
}

# Setup automatic renewal
setup_auto_renewal() {
    log "Setting up automatic certificate renewal..."
    
    # Create renewal script
    cat > /usr/local/bin/certbot-renew.sh << 'EOF'
#!/bin/bash
# Automatic certificate renewal script

LOG_FILE="/var/log/certbot-renewal.log"

echo "$(date): Starting certificate renewal" >> "$LOG_FILE"

if /usr/bin/certbot renew --quiet >> "$LOG_FILE" 2>&1; then
    echo "$(date): Certificate renewal successful" >> "$LOG_FILE"
    /bin/systemctl reload nginx >> "$LOG_FILE" 2>&1
else
    echo "$(date): Certificate renewal failed" >> "$LOG_FILE"
    exit 1
fi
EOF
    
    chmod +x /usr/local/bin/certbot-renew.sh
    
    # Add cron job for automatic renewal (twice daily)
    echo "0 */12 * * * /usr/local/bin/certbot-renew.sh" | crontab -
    
    # Create systemd timer as alternative
    cat > /etc/systemd/system/certbot-renewal.service << 'EOF'
[Unit]
Description=Certbot Renewal

[Service]
ExecStart=/usr/local/bin/certbot-renew.sh
EOF
    
    cat > /etc/systemd/system/certbot-renewal.timer << 'EOF'
[Unit]
Description=Certbot Renewal Timer

[Timer]
OnBootSec=300
OnUnitActiveSec=12h

[Install]
WantedBy=timers.target
EOF
    
    systemctl daemon-reload
    systemctl enable certbot-renewal.timer
    systemctl start certbot-renewal.timer
    
    log "Automatic renewal setup completed"
}

# Main function
main() {
    local command="${1:-}"
    local domain="${2:-}"
    local email=""
    local test_cert="false"
    
    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--email)
                email="$2"
                shift 2
                ;;
            -t|--test-cert)
                test_cert="true"
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                break
                ;;
        esac
    done
    
    case "$command" in
        "setup")
            setup_ssl "$domain" "$email" "$test_cert"
            ;;
        "renew")
            check_root
            renew_certificates
            ;;
        "status")
            check_certificate_status
            ;;
        "remove")
            check_root
            remove_ssl "$domain"
            ;;
        "test")
            test_ssl "$domain"
            ;;
        "auto-renew")
            check_root
            setup_auto_renewal
            ;;
        "help"|"")
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