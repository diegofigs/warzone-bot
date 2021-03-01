const fs = require('fs');
const schedule = require('node-schedule');

const jobFiles = fs.readdirSync(`./jobs`).filter(file => file.endsWith('.js'));
for (const jobName of jobFiles) {
  const { name, cron, rule, execute } = require(`./jobs/${jobName}`);
  const frequency = rule ? rule : cron;
  schedule.scheduleJob(name, frequency, execute);
  console.log(`Started at ${new Date().toLocaleString('en')}`);
}

process.on('SIGINT', function(msg) {  
	// process reload ongoing
	// close connections, clear cache, etc
	// by default, you have 1600ms
	console.log(msg + ' Grafully shutting down');
	process.exit(0);
});