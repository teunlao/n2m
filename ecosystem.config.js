module.exports = {
  apps: [
    {
      name: 'blog-app',
      script: 'examples/blog-app/dist/server.js',
      watch: true,
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    }
  ]
};