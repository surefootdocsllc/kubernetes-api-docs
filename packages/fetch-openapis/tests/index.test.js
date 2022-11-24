const { describe } = require('riteway');

const axios = require('axios');
const axiosMock = require("axios-mock-adapter");
const mock = new axiosMock(axios);

const { readFixture } = require('./util');

const { getResources, getGroups, fetchApiGroupResources, fetchApiGroups, fetchOpenApiSpec } = require('../lib');

describe('test', async assert => {
  const json = await readFixture('apis-crd-endpoint');
  const final = getGroups(json);
  //console.log(final);
});

describe('fetch API group resources', async assert => {
  const data = await readFixture('api-v1-k8s-endpoint');
  mock.onGet(/api/).reply(() => {
    return [200, data];
  });

  const r = await fetchApiGroupResources({ group: 'group', version: 'ver', hostAndPort: 'aaa:33' });
  //console.log(r);
});

describe('fetchApiGroups()', async assert => {
  const data = await readFixture('apis-crd-endpoint');
  mock.onGet(/api/).reply(() => {
    return [200, data];
  });

  assert({
    given: 'a group and host',
    should: 'fetch available API groups',
    actual: await fetchApiGroups({ group: 'autoscaling', hostAndPort: 'any' }).then(v => v.length),
    expected: 78
  });

});

describe('fetchOpenApiSpec()', async assert => {
  const data = await readFixture('autoscaling-v1-openapi3');
  mock.onGet(/api/).reply(() => {
    return [200, data];
  });

  const r = await fetchOpenApiSpec({
    kind: 'HorizontalPodAutoscaler', group: 'autoscaling', version: 'v1', hostAndPort: 'any'
  });
});
