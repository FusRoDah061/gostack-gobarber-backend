module.exports = {
  apps: [{
    name: "gobarber_backend",
    script: "./dist/shared/infra/http/server.js",
    instances: "max",
    log_file: "combined.log",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
