const { readFileSync, existsSync } = require('node:fs');

let https;
try {
  https = require('node:https');
} catch (err) {
  throw new Error('Node.js was not built with TLS support!');
}

function getAxiosConfig({ apiBaseUrl = '', token = '', caCertPath = '' } = {}) {
  // Also solves https://github.com/axios/axios/issues/1134
  let config = {
    baseURL: apiBaseUrl
  };

  const addHeader = (c, pair) => {
    return { ...c, headers: { ...(c.hasOwnProperty('headers') ? c.headers : {}), ...pair } };
  };

  if(token) config = addHeader(config, {
    'Authorization': `Bearer ${token}`
  });
  if(caCertPath && existsSync(caCertPath)) config['httpsAgent'] = new https.Agent({
    ca: readFileSync(caCertPath)
  });
  // `kubectl proxy` rejects the 'Host' header from a Docker container
  if(/host\.docker\.internal/.test(apiBaseUrl)) config = addHeader(config, {
    'Host': '127.0.0.1'
  });

  return config;
}

module.exports = {
  getAxiosConfig
};
