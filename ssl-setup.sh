#!/bin/bash

# Script para configurar SSL/HTTPS com Let's Encrypt
DOMAIN="inspecao.digital"
EMAIL="felipe.tancredi@grupoaltavilla.com.br"

echo "🔐 Configurando SSL para $DOMAIN..."

# Instalar certbot se não existir
if ! command -v certbot &> /dev/null; then
    echo "📦 Instalando Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# Obter certificado SSL
echo "🔑 Obtendo certificado SSL..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL

# Configurar renovação automática
echo "🔄 Configurando renovação automática..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Verificar status
echo "✅ Testando configuração..."
nginx -t

if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo "🎉 SSL configurado com sucesso!"
    echo "🌐 Sua aplicação está disponível em:"
    echo "   - https://$DOMAIN"
    echo "   - https://www.$DOMAIN"
else
    echo "❌ Erro na configuração do Nginx"
fi