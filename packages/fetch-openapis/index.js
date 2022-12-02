const axios = require('axios');
//const { default: PQueue } = require('p-queue');

const { getAxiosConfig } = require('./lib/helpers');
const { fetchApiGroups, fetchApiGroupResources, fetchOpenApiSpec, extractOpenApiSchema } = require('./lib');

// Get a specific schema for a known resource
async function getSchema($axios, { kind = '', group = '', version = '' } = {}) {
  const openApiSpec = await fetchOpenApiSpec($axios, { group, version });
  return extractOpenApiSchema(openApiSpec, { kind, group, version });
}

/**
 * Fetch all API resources available in the cluster
*/
async function getAllResources($axios) {
  const groups = await fetchApiGroups($axios, { crds: true });

  const resources = await Promise.all([
    fetchApiGroupResources($axios),
    ...groups.map(({ name: group, version }) => fetchApiGroupResources($axios, { group, version }))
  ]);

  return resources.flat();
}

// TODO - If baseURL is not a valid URL, probably need to throw an exception
// because this is fatal.
module.exports = ({ apiBaseUrl = 'http://localhost:8001', token = '', caCertPath = '' } = {}) => {
  const config = getAxiosConfig({
    apiBaseUrl,
    token,
    caCertPath
  });

  const $axios = axios.create({ ...config });

  return {
    getAllResources: getAllResources.bind(null, $axios),
    getSchema: getSchema.bind(null, $axios)
  };
};
