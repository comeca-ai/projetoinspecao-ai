# Guia de Deploy - Projeto Inspeção AI

## Pré-requisitos

- Servidor Linux (Ubuntu/Debian recomendado)
- Nginx instalado
- Node.js 18+ (apenas para build local)
- Acesso SSH ao servidor
- Domínio configurado (DNS apontando para o servidor)

## Passo a Passo

### 1. Build Local

```bash
# Instalar dependências (se ainda não instalou)
npm install

# Criar build de produção
npm run build
```

### 2. Deploy para o Servidor

```bash
# Usar o script de deploy
./deploy.sh user@seu-servidor.com /var/www/inspecao-ai
```

Exemplo:
```bash
./deploy.sh root@189.90.123.45 /var/www/inspecao-ai
```

### 3. Configurar Nginx

1. Copie o arquivo nginx.conf para o servidor:
```bash
scp nginx.conf user@seu-servidor.com:/tmp/
```

2. No servidor, mova a configuração:
```bash
sudo mv /tmp/nginx.conf /etc/nginx/sites-available/inspecao-ai
sudo ln -s /etc/nginx/sites-available/inspecao-ai /etc/nginx/sites-enabled/
```

3. Edite a configuração:
```bash
sudo nano /etc/nginx/sites-available/inspecao-ai
```

Atualize:
- `server_name` com seu domínio
- `root` com o caminho correto
- Caminhos dos certificados SSL

4. Teste e recarregue o Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Configurar SSL (HTTPS)

Instale o Certbot e obtenha certificado:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com.br -d www.seu-dominio.com.br
```

### 5. Variáveis de Ambiente

1. No servidor, crie o arquivo .env:
```bash
sudo nano /var/www/inspecao-ai/.env
```

2. Adicione as variáveis (use .env.production como modelo):
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=seu-anon-key-aqui
```

### 6. Permissões

```bash
sudo chown -R www-data:www-data /var/www/inspecao-ai
sudo find /var/www/inspecao-ai -type f -exec chmod 644 {} \;
sudo find /var/www/inspecao-ai -type d -exec chmod 755 {} \;
```

## Atualizações Futuras

Para atualizar a aplicação:

1. Faça o build local:
```bash
npm run build
```

2. Execute o deploy:
```bash
./deploy.sh user@seu-servidor.com /var/www/inspecao-ai
```

## Troubleshooting

### Erro 404 nas rotas
- Verifique se o `try_files` está configurado corretamente no nginx.conf

### Erro de CORS
- Verifique as configurações do Supabase
- Confirme que o domínio está autorizado no painel do Supabase

### Página em branco
- Verifique o console do navegador (F12)
- Confirme que as variáveis de ambiente estão corretas
- Verifique os logs do Nginx: `sudo tail -f /var/log/nginx/inspecao-ai-error.log`

## Segurança

1. **Firewall**: Configure o UFW
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

2. **Atualizações**: Mantenha o sistema atualizado
```bash
sudo apt update && sudo apt upgrade
```

3. **Monitoramento**: Configure logs e alertas
```bash
# Verificar logs
sudo tail -f /var/log/nginx/inspecao-ai-access.log
sudo tail -f /var/log/nginx/inspecao-ai-error.log
```