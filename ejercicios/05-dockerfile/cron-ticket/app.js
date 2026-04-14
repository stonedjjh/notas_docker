const cron = require("node-cron");
let times = 0;
const {syncDB} = require('./tasks/sync-db')


cron.schedule("1-59/5 * * * * *", syncDB);

console.log("Inicio");
