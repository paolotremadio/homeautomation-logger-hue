const path = require('path');
const logger = require('homeautomation-winston-logger');
const { isEqual } = require('lodash');

const apiQuery = require('./api/query');

const config = require(path.join(process.cwd(), 'config.json')); // eslint-disable-line

const log = logger(config.logFile, config.debug);
let eventsLogged = 0;

const responses = {};

const pullChanges = () => {
  config.hubs.forEach(async (hub) => {
    const { name } = hub;

    const data = await apiQuery(hub.ip, hub.port || 80, hub.username, hub.protocol || 'http');

    if (!isEqual(responses[name] || {}, data)) {
      eventsLogged += 1;
      log.info({ hub: name, response: data });
    }

    responses[name] = data;
  });
};

setInterval(
  () => {
    console.log(`${new Date()}: Still running - Events logged since last update: ${eventsLogged}`);
    eventsLogged = 0;
  },
  30 * 60 * 1000,
);

setInterval(
  pullChanges,
  config.updateFrequency * 1000,
);

console.log(`${new Date()}: Starting`);
pullChanges();
