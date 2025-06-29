#!/bin/bash

# Health Check Script for inspecao.digital
# Verifica e recupera automaticamente a aplicação

LOG_FILE="/root/projetoinspecao-ai/logs/health-check.log"
APP_DIR="/root/projetoinspecao-ai"
SITE_URL="https://inspecao.digital"
SITE_WWW="https://www.inspecao.digital"

# Função para log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Função para verificar URL
check_url() {
    local url=$1
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
    echo "$http_code"
}

# Função para verificar aplicação
check_app() {
    local port_check=$(netstat -tlnp 2>/dev/null | grep :8080 | wc -l)
    if [ "$port_check" -eq 0 ]; then
        return 1
    fi
    return 0
}

# Função para recuperar aplicação
recover_app() {
    log "❌ Aplicação não está respondendo. Iniciando recuperação..."
    
    cd "$APP_DIR"
    
    # Verificar se PM2 está rodando
    if ! pm2 status | grep -q "inspecao-digital"; then
        log "PM2 não encontrado. Iniciando aplicação..."
        pm2 start npm --name inspecao-digital -- run dev
    else
        log "Reiniciando aplicação via PM2..."
        pm2 restart inspecao-digital
    fi
    
    # Aguardar aplicação iniciar
    sleep 10
    
    # Verificar novamente
    if check_app; then
        log "✅ Aplicação recuperada com sucesso!"
        return 0
    else
        log "❌ Falha na recuperação. Tentando kill forçado..."
        pkill -f "vite"
        sleep 2
        pm2 start npm --name inspecao-digital -- run dev
        sleep 10
    fi
}

# MAIN CHECK ROUTINE
log "=== Iniciando Health Check ==="

# 1. Verificar Nginx
if ! systemctl is-active --quiet nginx; then
    log "❌ Nginx não está rodando. Reiniciando..."
    systemctl start nginx
    sleep 2
fi

# 2. Verificar aplicação na porta 8080
if ! check_app; then
    log "❌ Aplicação não está na porta 8080"
    recover_app
fi

# 3. Verificar URLs
main_status=$(check_url "$SITE_URL")
www_status=$(check_url "$SITE_WWW")

log "Status HTTPS principal: $main_status"
log "Status HTTPS www: $www_status"

# 4. Verificar se precisa recuperar
if [ "$main_status" != "200" ] || [ "$www_status" != "200" ]; then
    log "❌ Site não está respondendo corretamente"
    
    # Verificar Nginx
    nginx -t 2>&1 | grep -q "successful"
    if [ $? -ne 0 ]; then
        log "❌ Configuração do Nginx com erro"
        # Tentar restaurar última configuração conhecida
        cp /root/projetoinspecao-ai/monitoring/nginx-backup.conf /etc/nginx/sites-available/inspecao.digital 2>/dev/null
        systemctl reload nginx
    fi
    
    # Recuperar aplicação
    recover_app
    
    # Verificar novamente após recuperação
    sleep 5
    main_status=$(check_url "$SITE_URL")
    www_status=$(check_url "$SITE_WWW")
    
    if [ "$main_status" == "200" ] && [ "$www_status" == "200" ]; then
        log "✅ Site recuperado com sucesso!"
    else
        log "❌ ALERTA: Site ainda não está respondendo após recuperação!"
        # Aqui você pode adicionar notificação por email/webhook
    fi
else
    log "✅ Todos os serviços estão funcionando normalmente"
fi

log "=== Health Check Finalizado ===\n"

# Limpar logs antigos (manter últimos 7 dias)
find /root/projetoinspecao-ai/logs -name "*.log" -mtime +7 -delete 2>/dev/null

exit 0