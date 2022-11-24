const { describe } = require('riteway');

const axios = require('axios');
const axiosMock = require("axios-mock-adapter");
const mock = new axiosMock(axios);

const { readFixture } = require('./util');

// Import module public API
const fetchOpenApis = require('..');
const { getAllResources, getSchema } = fetchOpenApis();

describe('fetchApiGroups()', async assert => {
  const GroupListPartial = await readFixture('apis-partial-grouplist');
  const k8sResourceList = await readFixture('api-v1-k8s-endpoint');
  const autoscalingResourceList = await readFixture('autoscaling-v1');
  const networkOperatorResourceList = await readFixture('network-operator-crds');

  mock.onGet(`/apis`).reply(() => {
    return [200, GroupListPartial];
  });
  mock.onGet(/\/api\/v1$/).reply(() => {
    return [200, k8sResourceList];
  });
  mock.onGet(/\/apis\/autoscaling\/v1$/).reply(() => {
    return [200, autoscalingResourceList];
  });
  mock.onGet(/\/apis\/network.operator.openshift.io\/v1$/).reply(() => {
    return [200, networkOperatorResourceList];
  });

  // result
  // await readFixture('resources.json');

  const data = await getAllResources();
  console.log(JSON.stringify(data, null, 2));

  //console.log(mock.history);

  /*
  assert({
    given: 'a group and host',
    should: 'fetch available API groups',
    actual: await getAllResources({ hostAndPort: 'any' }).then(v => v.length),
    expected: 78
  });
  */

});
