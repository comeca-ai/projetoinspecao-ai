#!/bin/bash

# Backup da configuração do Nginx
cp /etc/nginx/sites-available/inspecao.digital /root/projetoinspecao-ai/monitoring/nginx-backup.conf

echo "Backup do Nginx salvo em: $(date)"