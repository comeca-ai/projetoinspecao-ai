#!/bin/bash

# Script simples para testar rapidamente se tudo está funcionando

echo "🔍 Testando inspecao.digital..."
echo "================================"

# Testar URLs
echo -n "✓ https://inspecao.digital: "
curl -s -o /dev/null -w "%{http_code}" https://inspecao.digital

echo -n "
✓ https://www.inspecao.digital: "
curl -s -o /dev/null -w "%{http_code}" https://www.inspecao.digital

echo "

✓ Aplicação na porta 8080: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080

echo "

✓ PM2 Status:"
pm2 list | grep inspecao-digital

echo "
✓ Nginx Status:"
systemctl is-active nginx

echo "
================================"
echo "✅ Teste concluído!"