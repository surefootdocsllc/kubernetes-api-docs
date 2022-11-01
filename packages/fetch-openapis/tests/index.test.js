const { describe } = require('riteway');
const fs = require('fs/promises');

const readFixture = async (fixtureFile) => {
  let jsonData = {};
  try {
    jsonData = JSON.parse(await fs.readFile(`${__dirname}/fixtures/${fixtureFile}.json`));
    console.log(jsonData);
  }
  catch(e) {
    console.error(e.message);
  }
  return jsonData;
}

// "kind": "APIGroupList",
// "apiVersion": "v1",
function getGroups({ groups }) {
  return groups.reduce((flatGroups, group) => {
    const { name, versions, preferredVersion } = group;
    const flatGroup = versions.map(({ version, groupVersion }) => ({
      name, version, groupVersion, preferred: preferredVersion.groupVersion == groupVersion
    }));
    return [ ...flatGroups, ...flatGroup ];
  }, []);
}

// "kind": "APIResourceList",
// "groupVersion": "v1",
function getResources({ groupVersion, resources }) {
  const parts = groupVersion.split('/');
  const version = parts.pop();
  const group = parts.length == 1 ? '' : parts[0];
  return resources.reduce((flatResources, resource) => {
    const { name } = resource;
    return [ ...flatResources, { name, group, version, groupVersion, storageVersionHash } ];
  }, []);
}

describe('test', async assert => {
  const json = await readFixture('apis-crd-endpoint');
  const final = getGroups(json);
  console.log(final);
});
