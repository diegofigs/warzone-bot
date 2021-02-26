const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const schedule = require('node-schedule');

const jobFiles = fs.readdirSync(`./jobs`).filter(file => file.endsWith('.js'));
for (const jobName of jobFiles) {
  const { name, cron, rule, execute } = require(`./jobs/${jobName}`);
  const frequency = rule ? rule : cron;
  schedule.scheduleJob(name, frequency, execute);
  console.log(`Scheduled: ${new Date().toLocaleString('en')}`);
}