const { describe } = require('riteway');
//const mockFs = require('mock-fs');

const { getAxiosConfig } = require('../lib/helpers');

describe('#getAxiosConfig', async assert => {
  assert({
    given: '`apiBaseUrl`',
    should: 'add a `baseURL` to config',
    actual: getAxiosConfig({ apiBaseUrl: 'abc' })?.baseURL,
    expected: 'abc'
  });

  assert({
    given: '`token`',
    should: 'add a `token` to config.headers',
    actual: getAxiosConfig({ token: 'abc' })?.headers['Authorization'],
    expected: 'Bearer abc'
  });

  // Use mock-fs
  /*
  assert({
    given: '`caCertPath`',
    should: 'add a `httpsAgent` to config with a cert',
    actual: typeof getAxiosConfig({ caCertPath: 'fixures/test.ca' })?.httpsAgent,
    expected: 'object'
  });
  */

  let config = getAxiosConfig({ apiBaseUrl: 'host.docker.internal', token: 'abc' });
  assert({
    given: '`apiBaseUrl` for the Docker host and a token',
    should: 'add a `Host` header to config.headers',
    actual: config?.headers['Host'],
    expected: '127.0.0.1'
  });
  assert({
    given: '`apiBaseUrl` for the Docker host and a token',
    should: 'add a `token` header to config.headers',
    actual: config?.headers['Authorization'],
    expected: 'Bearer abc'
  });

});
