#!/bin/bash

# health-check.sh
# Script para monitoramento e verificação de saúde da aplicação
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
APP_URL="http://localhost:8080"
APP_HTTPS_URL="https://localhost"
HEALTH_LOG="/var/log/inspecao-ai/health.log"
STATUS_FILE="/var/run/inspecao-ai/health.status"
CONFIG_FILE="/etc/inspecao-ai/health-check.conf"

# Default thresholds
CPU_THRESHOLD=80
MEMORY_THRESHOLD=80
DISK_THRESHOLD=85
RESPONSE_TIME_THRESHOLD=5
ERROR_RATE_THRESHOLD=10

# Logging functions
log() {
    local message="$1"
    local timestamp=$(date +'%Y-%m-%d %H:%M:%S')
    echo -e "${GREEN}[$timestamp] $message${NC}"
    echo "[$timestamp] INFO: $message" >> "$HEALTH_LOG"
}

warn() {
    local message="$1"
    local timestamp=$(date +'%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] WARNING: $message${NC}"
    echo "[$timestamp] WARN: $message" >> "$HEALTH_LOG"
}

error() {
    local message="$1"
    local timestamp=$(date +'%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] ERROR: $message${NC}"
    echo "[$timestamp] ERROR: $message" >> "$HEALTH_LOG"
}

info() {
    local message="$1"
    local timestamp=$(date +'%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp] INFO: $message${NC}"
    echo "[$timestamp] INFO: $message" >> "$HEALTH_LOG"
}

# Help function
show_help() {
    cat << EOF
Usage: $0 [COMMAND] [OPTIONS]

Commands:
    check               Run comprehensive health check
    monitor             Start continuous monitoring
    status              Show current application status
    metrics             Display system metrics
    logs                Show recent logs
    restart             Restart application services
    setup               Setup health monitoring
    report              Generate health report

Options:
    -u, --url <url>     Application URL to check (default: $APP_URL)
    -t, --timeout <sec> HTTP timeout in seconds (default: 10)
    -i, --interval <sec> Monitoring interval in seconds (default: 60)
    -f, --format <type> Output format: text, json, html (default: text)
    -q, --quiet         Suppress output (log only)
    -v, --verbose       Verbose output
    -h, --help          Show this help message

Examples:
    $0 check
    $0 monitor --interval 30
    $0 status --format json
    $0 metrics
EOF
}

# Initialize health monitoring
setup_health_monitoring() {
    log "Setting up health monitoring..."
    
    # Create directories
    mkdir -p /var/log/inspecao-ai
    mkdir -p /var/run/inspecao-ai
    mkdir -p /etc/inspecao-ai
    
    # Set permissions
    chown -R www-data:www-data /var/log/inspecao-ai
    chown -R www-data:www-data /var/run/inspecao-ai
    
    # Create log file
    touch "$HEALTH_LOG"
    chown www-data:www-data "$HEALTH_LOG"
    
    # Create configuration file
    if [[ ! -f "$CONFIG_FILE" ]]; then
        cat > "$CONFIG_FILE" << EOF
# Health Check Configuration
APP_URL=$APP_URL
APP_HTTPS_URL=$APP_HTTPS_URL
CPU_THRESHOLD=$CPU_THRESHOLD
MEMORY_THRESHOLD=$MEMORY_THRESHOLD
DISK_THRESHOLD=$DISK_THRESHOLD
RESPONSE_TIME_THRESHOLD=$RESPONSE_TIME_THRESHOLD
ERROR_RATE_THRESHOLD=$ERROR_RATE_THRESHOLD
NOTIFICATION_EMAIL=""
SLACK_WEBHOOK=""
EOF
    fi
    
    log "Health monitoring setup completed"
}

# Load configuration
load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        source "$CONFIG_FILE"
    fi
}

# Check HTTP endpoint
check_http_endpoint() {
    local url="$1"
    local timeout="${2:-10}"
    
    local start_time=$(date +%s.%N)
    local http_code
    local response_time
    
    if http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$url" 2>/dev/null); then
        local end_time=$(date +%s.%N)
        response_time=$(echo "$end_time - $start_time" | bc -l)
        
        if [[ "$http_code" == "200" ]]; then
            info "HTTP endpoint healthy: $url (${response_time}s)"
            return 0
        else
            warn "HTTP endpoint returned code $http_code: $url"
            return 1
        fi
    else
        error "HTTP endpoint unreachable: $url"
        return 1
    fi
}

# Check system resources
check_system_resources() {
    local status=0
    
    # CPU Usage
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    cpu_usage=${cpu_usage%.*}  # Remove decimal part
    
    if [[ $cpu_usage -gt $CPU_THRESHOLD ]]; then
        warn "High CPU usage: ${cpu_usage}% (threshold: ${CPU_THRESHOLD}%)"
        status=1
    else
        info "CPU usage: ${cpu_usage}%"
    fi
    
    # Memory Usage
    local memory_info=$(free | grep Mem)
    local total_memory=$(echo $memory_info | awk '{print $2}')
    local used_memory=$(echo $memory_info | awk '{print $3}')
    local memory_usage=$(( used_memory * 100 / total_memory ))
    
    if [[ $memory_usage -gt $MEMORY_THRESHOLD ]]; then
        warn "High memory usage: ${memory_usage}% (threshold: ${MEMORY_THRESHOLD}%)"
        status=1
    else
        info "Memory usage: ${memory_usage}%"
    fi
    
    # Disk Usage
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [[ $disk_usage -gt $DISK_THRESHOLD ]]; then
        warn "High disk usage: ${disk_usage}% (threshold: ${DISK_THRESHOLD}%)"
        status=1
    else
        info "Disk usage: ${disk_usage}%"
    fi
    
    return $status
}

# Check services
check_services() {
    local services=("nginx" "inspecao-ai")
    local status=0
    
    for service in "${services[@]}"; do
        if systemctl is-active --quiet "$service"; then
            info "Service $service is running"
        else
            error "Service $service is not running"
            status=1
        fi
    done
    
    return $status
}

# Check database connectivity
check_database() {
    # This is a placeholder for database health check
    # Implement based on your database type (PostgreSQL, Supabase, etc.)
    
    info "Database connectivity check (placeholder)"
    
    # Example for PostgreSQL:
    # if psql -h localhost -U username -d database -c "SELECT 1;" &>/dev/null; then
    #     info "Database connection successful"
    #     return 0
    # else
    #     error "Database connection failed"
    #     return 1
    # fi
    
    return 0
}

# Check SSL certificate
check_ssl_certificate() {
    local domain="${1:-localhost}"
    
    if [[ ! -f "/etc/letsencrypt/live/$domain/cert.pem" ]]; then
        warn "SSL certificate not found for $domain"
        return 1
    fi
    
    local cert_file="/etc/letsencrypt/live/$domain/cert.pem"
    local expiry_date=$(openssl x509 -enddate -noout -in "$cert_file" | cut -d= -f2)
    local expiry_timestamp=$(date -d "$expiry_date" +%s)
    local current_timestamp=$(date +%s)
    local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
    
    if [[ $days_until_expiry -lt 7 ]]; then
        error "SSL certificate expires in $days_until_expiry days"
        return 1
    elif [[ $days_until_expiry -lt 30 ]]; then
        warn "SSL certificate expires in $days_until_expiry days"
        return 1
    else
        info "SSL certificate valid for $days_until_expiry days"
        return 0
    fi
}

# Check log files for errors
check_logs() {
    local error_count=0
    local log_files=(
        "/var/log/nginx/error.log"
        "/var/log/inspecao-ai/app.log"
        "/var/log/inspecao-ai/health.log"
    )
    
    for log_file in "${log_files[@]}"; do
        if [[ -f "$log_file" ]]; then
            # Count errors in last 5 minutes
            local recent_errors=$(grep -c "$(date --date='5 minutes ago' '+%Y-%m-%d %H:%M')" "$log_file" 2>/dev/null || echo 0)
            error_count=$((error_count + recent_errors))
        fi
    done
    
    if [[ $error_count -gt $ERROR_RATE_THRESHOLD ]]; then
        warn "High error rate: $error_count errors in last 5 minutes"
        return 1
    else
        info "Error rate: $error_count errors in last 5 minutes"
        return 0
    fi
}

# Comprehensive health check
run_health_check() {
    local overall_status=0
    
    log "Starting comprehensive health check..."
    
    # HTTP endpoint check
    if ! check_http_endpoint "$APP_URL"; then
        overall_status=1
    fi
    
    # System resources
    if ! check_system_resources; then
        overall_status=1
    fi
    
    # Services
    if ! check_services; then
        overall_status=1
    fi
    
    # Database
    if ! check_database; then
        overall_status=1
    fi
    
    # SSL certificate
    if ! check_ssl_certificate; then
        overall_status=1
    fi
    
    # Log analysis
    if ! check_logs; then
        overall_status=1
    fi
    
    # Update status file
    echo "timestamp=$(date +%s)" > "$STATUS_FILE"
    echo "status=$overall_status" >> "$STATUS_FILE"
    echo "last_check=$(date)" >> "$STATUS_FILE"
    
    if [[ $overall_status -eq 0 ]]; then
        log "Health check completed: ALL SYSTEMS HEALTHY"
    else
        error "Health check completed: ISSUES DETECTED"
    fi
    
    return $overall_status
}

# Display system metrics
show_metrics() {
    log "System Metrics:"
    
    # System info
    echo "System Information:"
    echo "  OS: $(lsb_release -d 2>/dev/null | cut -d: -f2 | xargs || echo 'Unknown')"
    echo "  Kernel: $(uname -r)"
    echo "  Uptime: $(uptime -p)"
    echo
    
    # CPU info
    echo "CPU:"
    echo "  Cores: $(nproc)"
    echo "  Load Average: $(uptime | awk -F'load average:' '{print $2}')"
    echo
    
    # Memory info
    echo "Memory:"
    free -h
    echo
    
    # Disk info
    echo "Disk Usage:"
    df -h | grep -E '^/dev/'
    echo
    
    # Network info
    echo "Network:"
    ss -tuln | grep -E ':(80|443|8080)'
    echo
    
    # Process info
    echo "Application Processes:"
    ps aux | grep -E '(nginx|python|node)' | grep -v grep
}

# Show application status
show_status() {
    local format="${1:-text}"
    
    if [[ -f "$STATUS_FILE" ]]; then
        source "$STATUS_FILE"
        
        case "$format" in
            "json")
                cat << EOF
{
    "timestamp": $timestamp,
    "status": "$([[ $status -eq 0 ]] && echo "healthy" || echo "unhealthy")",
    "last_check": "$last_check",
    "uptime": "$(uptime -p)"
}
EOF
                ;;
            "text"|*)
                echo "Application Status: $([[ $status -eq 0 ]] && echo "HEALTHY" || echo "UNHEALTHY")"
                echo "Last Check: $last_check"
                echo "System Uptime: $(uptime -p)"
                ;;
        esac
    else
        echo "Status file not found. Run health check first."
    fi
}

# Restart application services
restart_services() {
    warn "Restarting application services..."
    
    local services=("nginx" "inspecao-ai")
    
    for service in "${services[@]}"; do
        if systemctl restart "$service"; then
            log "Service $service restarted successfully"
        else
            error "Failed to restart service $service"
        fi
    done
}

# Continuous monitoring
start_monitoring() {
    local interval="${1:-60}"
    
    log "Starting continuous monitoring (interval: ${interval}s)..."
    
    while true; do
        run_health_check
        sleep "$interval"
    done
}

# Generate health report
generate_report() {
    local report_file="/tmp/health-report-$(date +%Y%m%d-%H%M%S).html"
    
    log "Generating health report..."
    
    cat > "$report_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Health Report - Inspeção AI</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .healthy { color: green; }
        .warning { color: orange; }
        .error { color: red; }
        .metric { margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Health Report - Inspeção AI</h1>
    <p>Generated: $(date)</p>
    
    <h2>System Status</h2>
    <div class="metric">Overall Status: <span class="$([[ -f "$STATUS_FILE" ]] && source "$STATUS_FILE" && [[ $status -eq 0 ]] && echo "healthy" || echo "error")">$([[ -f "$STATUS_FILE" ]] && source "$STATUS_FILE" && [[ $status -eq 0 ]] && echo "HEALTHY" || echo "UNHEALTHY")</span></div>
    
    <h2>System Metrics</h2>
    <pre>$(show_metrics)</pre>
    
    <h2>Recent Logs</h2>
    <pre>$(tail -20 "$HEALTH_LOG" 2>/dev/null || echo "No logs available")</pre>
</body>
</html>
EOF
    
    log "Health report generated: $report_file"
    echo "$report_file"
}

# Main function
main() {
    local command="${1:-check}"
    local url="$APP_URL"
    local timeout=10
    local interval=60
    local format="text"
    local quiet=false
    local verbose=false
    
    # Load configuration
    load_config
    
    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
            -u|--url)
                url="$2"
                shift 2
                ;;
            -t|--timeout)
                timeout="$2"
                shift 2
                ;;
            -i|--interval)
                interval="$2"
                shift 2
                ;;
            -f|--format)
                format="$2"
                shift 2
                ;;
            -q|--quiet)
                quiet=true
                shift
                ;;
            -v|--verbose)
                verbose=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                command="$1"
                shift
                ;;
        esac
    done
    
    # Redirect output if quiet
    if [[ "$quiet" == "true" ]]; then
        exec > /dev/null
    fi
    
    case "$command" in
        "check")
            run_health_check
            ;;
        "monitor")
            start_monitoring "$interval"
            ;;
        "status")
            show_status "$format"
            ;;
        "metrics")
            show_metrics
            ;;
        "logs")
            tail -50 "$HEALTH_LOG"
            ;;
        "restart")
            restart_services
            ;;
        "setup")
            setup_health_monitoring
            ;;
        "report")
            generate_report
            ;;
        "help")
            show_help
            ;;
        *)
            error "Unknown command: $command. Use --help for usage information."
            exit 1
            ;;
    esac
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Ensure log directory exists
    mkdir -p "$(dirname "$HEALTH_LOG")"
    
    main "$@"
fi