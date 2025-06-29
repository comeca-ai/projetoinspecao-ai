module.exports = {
  apps: [{
    name: 'inspecao-digital',
    script: 'npm',
    args: 'run dev',
    cwd: '/root/projetoinspecao-ai',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    
    // Estratégia de restart
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    
    // Variáveis de ambiente
    env: {
      NODE_ENV: 'development',
      PORT: 8080
    },
    
    // Configuração de logs
    error_file: '/root/projetoinspecao-ai/logs/pm2-error.log',
    out_file: '/root/projetoinspecao-ai/logs/pm2-out.log',
    log_file: '/root/projetoinspecao-ai/logs/pm2-combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    
    // Health check
    listen_timeout: 8000,
    kill_timeout: 5000,
    
    // Hooks de ciclo de vida
    post_update: ['npm install'],
    
    // Notificações de erro
    error_file: '/root/projetoinspecao-ai/logs/pm2-error.log',
    combine_logs: true,
    
    // Configurações adicionais
    source_map_support: true,
    instance_var: 'INSTANCE_ID',
    
    // Auto restart em caso de mudança no package.json
    watch_options: {
      followSymlinks: false,
      ignored: ['node_modules', 'logs', '.git']
    }
  }]
};