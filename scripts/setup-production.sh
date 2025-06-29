#!/bin/bash

# setup-production.sh
# Script para configuração segura do servidor de produção
# Autor: Claude Code Assistant
# Data: $(date +"%Y-%m-%d")

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
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

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        warn "Running as root. This is not recommended for security."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Aborted by user"
        fi
    fi
}

# Check system requirements
check_system() {
    log "Checking system requirements..."
    
    # Check OS
    if [[ ! -f /etc/os-release ]]; then
        error "Cannot determine OS version"
    fi
    
    . /etc/os-release
    info "Detected OS: $PRETTY_NAME"
    
    # Check if Ubuntu/Debian
    if [[ "$ID" != "ubuntu" && "$ID" != "debian" ]]; then
        warn "This script is optimized for Ubuntu/Debian. Proceed with caution."
    fi
    
    # Check available disk space (at least 2GB)
    available_space=$(df / | awk 'NR==2 {print $4}')
    if [[ $available_space -lt 2097152 ]]; then
        error "Insufficient disk space. At least 2GB required."
    fi
    
    # Check memory (at least 1GB)
    memory_kb=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    if [[ $memory_kb -lt 1048576 ]]; then
        warn "Low memory detected. At least 1GB recommended."
    fi
    
    log "System requirements check passed"
}

# Update system packages
update_system() {
    log "Updating system packages..."
    
    export DEBIAN_FRONTEND=noninteractive
    
    if command -v apt &> /dev/null; then
        apt update -qq
        apt upgrade -y -qq
        apt autoremove -y -qq
        apt autoclean -qq
    else
        error "apt package manager not found"
    fi
    
    log "System packages updated"
}

# Install required packages
install_packages() {
    log "Installing required packages..."
    
    local packages=(
        "nginx"
        "certbot"
        "python3-certbot-nginx"
        "ufw"
        "fail2ban"
        "htop"
        "curl"
        "wget"
        "unzip"
        "git"
        "nodejs"
        "npm"
        "pm2"
        "rsync"
        "logrotate"
    )
    
    for package in "${packages[@]}"; do
        if ! dpkg -l | grep -q "^ii  $package "; then
            info "Installing $package..."
            apt install -y -qq "$package" || warn "Failed to install $package"
        else
            info "$package is already installed"
        fi
    done
    
    # Install PM2 globally if not present
    if ! command -v pm2 &> /dev/null; then
        info "Installing PM2 globally..."
        npm install -g pm2
    fi
    
    log "Required packages installed"
}

# Configure firewall
setup_firewall() {
    log "Configuring firewall..."
    
    # Reset UFW to defaults
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (be careful not to lock yourself out)
    ufw allow ssh
    ufw allow 22/tcp
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Allow custom port 8080 for the application
    ufw allow 8080/tcp
    
    # Enable firewall
    ufw --force enable
    
    log "Firewall configured and enabled"
}

# Configure fail2ban
setup_fail2ban() {
    log "Configuring fail2ban..."
    
    # Create local jail configuration
    cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
filter = nginx-http-auth
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
EOF
    
    # Restart fail2ban
    systemctl restart fail2ban
    systemctl enable fail2ban
    
    log "Fail2ban configured and started"
}

# Create application directories
setup_directories() {
    log "Setting up application directories..."
    
    local app_user="www-data"
    local app_dir="/var/www/inspecao-ai"
    local backup_dir="/var/backups/inspecao-ai"
    local log_dir="/var/log/inspecao-ai"
    
    # Create directories with proper permissions
    mkdir -p "$app_dir"
    mkdir -p "$backup_dir"
    mkdir -p "$log_dir"
    
    # Set ownership
    chown -R $app_user:$app_user "$app_dir"
    chown -R $app_user:$app_user "$backup_dir"
    chown -R $app_user:$app_user "$log_dir"
    
    # Set permissions
    chmod 755 "$app_dir"
    chmod 750 "$backup_dir"
    chmod 750 "$log_dir"
    
    log "Application directories created"
}

# Configure Nginx security
setup_nginx_security() {
    log "Configuring Nginx security..."
    
    # Backup original nginx.conf
    cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
    
    # Create secure nginx configuration
    cat > /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    
    # Security Headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';" always;
    
    # MIME
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # Include other configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF

    # Test nginx configuration
    nginx -t || error "Nginx configuration test failed"
    
    log "Nginx security configuration completed"
}

# Setup log rotation
setup_logrotate() {
    log "Setting up log rotation..."
    
    cat > /etc/logrotate.d/inspecao-ai << EOF
/var/log/inspecao-ai/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
    su www-data www-data
}
EOF
    
    log "Log rotation configured"
}

# Create systemd service for the application
create_systemd_service() {
    log "Creating systemd service..."
    
    cat > /etc/systemd/system/inspecao-ai.service << EOF
[Unit]
Description=Inspeção AI Application
After=network.target
Wants=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/inspecao-ai
Environment=NODE_ENV=production
Environment=PORT=8080
ExecStart=/usr/bin/python3 -m http.server 8080
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
    
    systemctl daemon-reload
    systemctl enable inspecao-ai
    
    log "Systemd service created and enabled"
}

# Setup monitoring
setup_monitoring() {
    log "Setting up basic monitoring..."
    
    # Create monitoring script
    mkdir -p /opt/inspecao-ai/scripts
    
    cat > /opt/inspecao-ai/scripts/monitor.sh << 'EOF'
#!/bin/bash
# Basic monitoring script

LOG_FILE="/var/log/inspecao-ai/monitor.log"
APP_URL="http://localhost:8080"

# Check if application is responding
if curl -sf "$APP_URL" > /dev/null; then
    echo "$(date): Application is healthy" >> "$LOG_FILE"
else
    echo "$(date): Application is not responding" >> "$LOG_FILE"
    # Try to restart the service
    systemctl restart inspecao-ai
    echo "$(date): Service restart attempted" >> "$LOG_FILE"
fi
EOF
    
    chmod +x /opt/inspecao-ai/scripts/monitor.sh
    
    # Add cron job for monitoring
    echo "*/5 * * * * /opt/inspecao-ai/scripts/monitor.sh" | crontab -u www-data -
    
    log "Basic monitoring setup completed"
}

# Main function
main() {
    log "Starting production server setup..."
    
    check_root
    check_system
    update_system
    install_packages
    setup_firewall
    setup_fail2ban
    setup_directories
    setup_nginx_security
    setup_logrotate
    create_systemd_service
    setup_monitoring
    
    log "Production server setup completed successfully!"
    info "Next steps:"
    info "1. Run manage-secrets.sh to configure environment variables"
    info "2. Run ssl-setup.sh to configure SSL certificates"
    info "3. Deploy your application to /var/www/inspecao-ai"
    info "4. Configure your domain in Nginx sites-available"
    
    warn "Remember to:"
    warn "- Change default passwords"
    warn "- Configure your domain DNS"
    warn "- Test SSL configuration"
    warn "- Monitor logs regularly"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi