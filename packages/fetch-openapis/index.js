const { default: PQueue } = require('p-queue');

const { fetchApiGroups, fetchApiGroupResources, fetchOpenApiSpec, extractOpenApiSchema } = require('./lib');

// Get a specific schema for a known resource
async function getSchema({ kind = '', group = '', version = '', hostAndPort = '' } = {}) {
  const openApiSpec = await fetchOpenApiSpec({ group, version, hostAndPort, secure: false });
  return extractOpenApiSchema(openApiSpec, { kind, group, version });
}

/**
 * Fetch all API resources available in the cluster
*/
async function getAllResources({ hostAndPort = '', secure = true } = {}) {
  const groups = await fetchApiGroups({ hostAndPort, secure, crds: true });

  const resources = await Promise.all([
    fetchApiGroupResources({ hostAndPort, secure }),
    ...groups.map(({ name: group, version }) => fetchApiGroupResources({ hostAndPort, secure, group, version }))
  ]);

  return resources.flat();
}

module.exports = {
  getAllResources,
  getSchema
};
