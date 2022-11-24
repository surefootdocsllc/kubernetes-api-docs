const axios = require('axios');
const { default: PQueue } = require('p-queue');

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

module.exports = ({ apiBaseUrl = 'http://localhost:8001' } = {}) => {
  const $axios = axios.create({
    baseURL: apiBaseUrl
  });

  return {
    getAllResources: getAllResources.bind(null, $axios),
    getSchema: getSchema.bind(null, $axios)
  };
};
