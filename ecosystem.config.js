const dotenv = require('dotenv');
dotenv.config();

const merge_logs = true;
const ignore_watch = ['.history', 'node_modules'];
const env = {
  NODE_ENV: 'development',
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  DISCORD_DAILY_STATS_WEBHOOK_ID: process.env.DISCORD_DAILY_STATS_WEBHOOK_ID,
  DISCORD_DAILY_STATS_WEBHOOK_TOKEN: process.env.DISCORD_DAILY_STATS_WEBHOOK_TOKEN,
  WZ_USERNAME: process.env.WZ_USERNAME,
  WZ_PASSWORD: process.env.WZ_PASSWORD
};
const env_production = {
  ...env,
  NODE_ENV: 'production'
};

module.exports = {
  apps : [{
    name: 'wz-bot',
    script: './index.js',
    watch: '.',
    ignore_watch,
    merge_logs,
    env,
    env_production
  }, {
    name: 'schedule',
    script: './schedule.js',
    watch: '.',
    ignore_watch,
    merge_logs,
    env,
    env_production
  }],

  deploy : {
    production : {
      user : process.env.SSH_USERNAME,
      host : process.env.SSH_HOST,
      ref  : 'origin/main',
      repo : 'git@github.com:diegofigs/warzone-bot.git',
      path : '/root/warzone-bot',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && \
        pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      env: env_production
    }
  }
};
