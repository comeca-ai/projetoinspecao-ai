#!/bin/bash

# Script para manter a aplicação React sempre rodando
cd /root/projetoinspecao-ai

# Função para iniciar a aplicação
start_app() {
    echo "$(date): Iniciando aplicação React..."
    nohup npm run dev > server.log 2>&1 &
    APP_PID=$!
    echo $APP_PID > app.pid
    echo "$(date): Aplicação iniciada com PID $APP_PID"
}

# Verificar se a aplicação está rodando
if [ -f app.pid ]; then
    PID=$(cat app.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo "$(date): Aplicação já está rodando com PID $PID"
    else
        echo "$(date): PID $PID não encontrado, reiniciando..."
        rm -f app.pid
        start_app
    fi
else
    echo "$(date): Arquivo PID não encontrado, iniciando aplicação..."
    start_app
fi

# Verificar se a porta 8080 está respondendo
sleep 3
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "$(date): ✅ Aplicação está respondendo na porta 8080"
else
    echo "$(date): ❌ Aplicação não está respondendo, tentando reiniciar..."
    pkill -f "vite"
    sleep 2
    start_app
fi