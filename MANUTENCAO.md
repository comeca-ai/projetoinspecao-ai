# 🛠️ Manual de Manutenção - inspecao.digital

## 📋 Visão Geral da Infraestrutura

### **Componentes Principais:**
1. **Aplicação React**: Rodando na porta 8080 (Vite)
2. **PM2**: Gerenciador de processos Node.js
3. **Nginx**: Proxy reverso e servidor web
4. **SSL/HTTPS**: Certificados Let's Encrypt
5. **Monitoramento**: Health checks automáticos

### **URLs Funcionais:**
- https://inspecao.digital (principal)
- https://www.inspecao.digital (redireciona para principal)
- http://inspecao.digital (redireciona para HTTPS)
- http://www.inspecao.digital (redireciona para HTTPS)

---

## 🚀 Comandos Essenciais

### **Verificar Status Rápido:**
```bash
# Teste completo
/root/projetoinspecao-ai/monitoring/simple-test.sh

# Status da aplicação
pm2 status

# Logs em tempo real
pm2 logs inspecao-digital --lines 50

# Status do Nginx
systemctl status nginx
```

### **Reiniciar Aplicação:**
```bash
# Reiniciar suave
pm2 restart inspecao-digital

# Reiniciar forçado
pm2 stop inspecao-digital
pm2 start npm --name inspecao-digital -- run dev

# Recarregar Nginx
systemctl reload nginx
```

### **Em Caso de Problemas:**
```bash
# 1. Verificar se aplicação está rodando
netstat -tlnp | grep :8080

# 2. Se não estiver, reiniciar
cd /root/projetoinspecao-ai
pm2 start npm --name inspecao-digital -- run dev

# 3. Verificar logs de erro
pm2 logs inspecao-digital --err --lines 100

# 4. Testar manualmente
curl -I https://inspecao.digital
```

---

## 🔄 Sistema de Recuperação Automática

### **1. PM2 Auto-Restart**
- Configurado para reiniciar automaticamente em caso de crash
- Máximo de 10 tentativas com delay de 4 segundos
- Reinicia se usar mais de 1GB de memória

### **2. Health Check Automático**
- Executa a cada 5 minutos via systemd timer
- Verifica:
  - Nginx rodando
  - Aplicação na porta 8080
  - URLs respondendo com HTTP 200
- Tenta recuperar automaticamente se detectar problemas

### **3. Startup Automático**
- PM2 configurado para iniciar com o sistema
- Nginx inicia automaticamente
- Health check inicia 2 minutos após boot

---

## 📁 Estrutura de Arquivos

### **Aplicação:**
```
/root/projetoinspecao-ai/
├── src/                    # Código fonte React
├── dist/                   # Build de produção
├── logs/                   # Logs da aplicação
├── monitoring/             # Scripts de monitoramento
│   ├── health-check.sh     # Script principal de health check
│   ├── simple-test.sh      # Teste rápido manual
│   ├── backup-nginx.sh     # Backup da config do Nginx
│   └── nginx-backup.conf   # Backup da configuração
├── ecosystem.config.js     # Configuração PM2
└── vite.config.ts          # Configuração Vite
```

### **Configurações Sistema:**
```
/etc/nginx/sites-available/inspecao.digital  # Config Nginx
/etc/systemd/system/inspecao-monitor.service # Serviço health check
/etc/systemd/system/inspecao-monitor.timer   # Timer health check
/etc/letsencrypt/live/inspecao.digital/      # Certificados SSL
```

---

## 🔧 Troubleshooting

### **Problema: Site não carrega**
```bash
# 1. Verificar DNS
nslookup inspecao.digital

# 2. Verificar aplicação
pm2 status
curl http://localhost:8080

# 3. Verificar Nginx
nginx -t
systemctl status nginx

# 4. Verificar logs
pm2 logs inspecao-digital --err
tail -f /var/log/nginx/error.log
```

### **Problema: Erro 502 Bad Gateway**
```bash
# Aplicação não está rodando na porta 8080
cd /root/projetoinspecao-ai
pm2 restart inspecao-digital

# Se não resolver
pm2 delete inspecao-digital
pm2 start npm --name inspecao-digital -- run dev
```

### **Problema: Erro SSL/HTTPS**
```bash
# Verificar certificados
certbot certificates

# Renovar manualmente se necessário
certbot renew --force-renewal

# Recarregar Nginx
systemctl reload nginx
```

---

## 📊 Monitoramento

### **Logs Importantes:**
```bash
# Logs da aplicação
/root/projetoinspecao-ai/logs/pm2-*.log

# Logs do health check
/root/projetoinspecao-ai/logs/health-check.log

# Logs do Nginx
/var/log/nginx/error.log
/var/log/nginx/access.log

# Logs do sistema
journalctl -u inspecao-monitor.service
```

### **Métricas PM2:**
```bash
# Ver consumo de recursos
pm2 monit

# Ver informações detalhadas
pm2 info inspecao-digital

# Ver métricas
pm2 describe inspecao-digital
```

---

## 🔐 Segurança

### **Certificados SSL:**
- Renovação automática configurada via cron
- Válidos por 90 dias
- Comando manual: `certbot renew`

### **Firewall:**
```bash
# Verificar status
ufw status

# Portas abertas necessárias
- 80 (HTTP)
- 443 (HTTPS)
- 22 (SSH)
```

---

## 🆘 Recuperação de Emergência

### **Se tudo falhar:**
```bash
# 1. Parar tudo
pm2 kill
systemctl stop nginx

# 2. Limpar processos travados
pkill -f "vite"
pkill -f "node"

# 3. Reiniciar serviços
systemctl start nginx
cd /root/projetoinspecao-ai
pm2 start npm --name inspecao-digital -- run dev
pm2 save

# 4. Verificar
/root/projetoinspecao-ai/monitoring/simple-test.sh
```

### **Restaurar Configuração Nginx:**
```bash
# Backup está em:
cp /root/projetoinspecao-ai/monitoring/nginx-backup.conf /etc/nginx/sites-available/inspecao.digital
systemctl reload nginx
```

---

## 📞 Contatos e Suporte

- **Domínio**: GoDaddy (felipe.tancredi@grupoaltavilla.com.br)
- **Servidor**: 195.35.17.156
- **Health Check**: Executa a cada 5 minutos automaticamente

---

## ✅ Checklist Diário

1. [ ] Verificar se site está acessível
2. [ ] Checar logs de erro: `pm2 logs --err --lines 50`
3. [ ] Verificar espaço em disco: `df -h`
4. [ ] Verificar consumo de recursos: `pm2 monit`
5. [ ] Testar todas as URLs: `/root/projetoinspecao-ai/monitoring/simple-test.sh`

---

**Última atualização**: 29 de junho de 2025
**Aplicação está configurada para alta disponibilidade com recuperação automática!**