const https = require('https');
const axios = require('axios');

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

module.exports = async (ip, port, username, protocol) => {
  try {
    const response = await instance.get(`${protocol}://${ip}:${port}/api/${username}`);

    const { data } = response;

    if (!data) {
      return {};
    }

    delete data.config.UTC;
    delete data.config.localtime;
    delete data.config.whitelist;

    return data;
  } catch (e) {
    return {};
  }
};
