const OpenApiParser = require('swagger-parser');

/*
Discovery endpoints

/api/v1: An APIResourceList object w/ k8s built-in APIs
/apis: An APIGroupList object w/ all API groups available, all API versions
/apis/<group>/<version>: An APIResourceList object w/ all resources for an API group version

OpenAPI spec emitters

/openapi/v3: paths for OpenAPI v3 specs that are available
/openapi/v3/api/v1: OpenAPI spec for k8s built-in APIs
/openapi/v3/apis/<group>/<version>: OpenAPI v3 specs
*/

const k8sCoreDiscoveryPath = '/api/v1';
const k8sCrdDiscoveryPath = '/apis';
const k8sCoreOpenApiPath = '/openapi/v3/api/v1';
const k8sCrdOpenApiPath = '/openapi/v3/apis';

// Some APIs include sibling resources, such as pods/status, but for the purposes
// here this just duplicates the parent schema.
const omitSiblings = kindName => /\//.test(kindName);

const emptyOpenApiDoc = () => ({
  data: {
  "openapi": "3.0.0",
  "info": {},
  "paths": {}
}});

const handleAxiosException = err => {
  const { request, response } = err;
  // status:401
  //statusText:'Unauthorized'
  if(response) {
    const { status, statusText } = response;
    console.error(`${response.config.url}: ${status}${statusText ? ' : ' + statusText : ''}`);
  }
  // 'ECONNREFUSED'
  else if(request) {
    console.error(`${err.message}`);
  }
  else {
    console.log(err.message);
    console.log(err.stack);
  }
};

/**
 * Gets a list of APIs within an API group.
 */
async function fetchApiGroupResources($axios, { group, version } = {}) {
  var httpResponse;

  const buildUrlFns = [
    () => `${group ? [k8sCrdDiscoveryPath, '/'].join('') : k8sCoreDiscoveryPath}`,
    () => `${group ? [group, '/'].join('') : ''}`,
    () => `${version ? version : ''}`
  ];
  const apiUrl = buildUrlFns.reduce((accum, fn) => accum.concat(fn()), []).join('');

  try {
    httpResponse = await $axios.get(apiUrl);
  }
  catch(err) {
    handleAxiosException(err);
    httpResponse = { data: {} }
  }

  return getResources({ ...httpResponse.data });
}

/**
 * Gets a list of API groups.
 */
async function fetchApiGroups($axios, { crds = false } = {}) {
  const apiUrl = `${ crds ? k8sCrdDiscoveryPath : k8sCoreDiscoveryPath }`;
  var httpResponse;

  try {
    httpResponse = await $axios.get(apiUrl);
  }
  catch(err) {
    handleAxiosException(err);
    httpResponse = { data: {} }
  }

  return getGroups({ groups: httpResponse.data.groups });
}

async function fetchOpenApiSpec($axios, { group = '', version = '' } = {}) {
  var httpResponse;

  //const groupVersion = group ? `${group}/${version}` : version;
  const buildUrlFns = [
    () => `${group ? [k8sCrdOpenApiPath, '/'].join('') : k8sCoreOpenApiPath}`,
    () => `${group ? [group, '/'].join('') : ''}`,
    () => `${group && version ? version : ''}`
  ];
  const apiUrl = buildUrlFns.reduce((accum, fn) => accum.concat(fn()), []).join('');

  try {
    httpResponse = await $axios.get(apiUrl);
  }
  catch(err) {
    handleAxiosException(err);
    httpResponse = emptyOpenApiDoc();
  }

  return await OpenApiParser.dereference(httpResponse.data);
}

function extractOpenApiSchema(schema = {}, { kind, group, version } = {}) {
  if(!schema.openapi) throw(new Error('You must specify a valid OpenAPI `schema`'));
  if(!kind) throw(new Error('You must specify `kind`'));
  if(typeof group != 'string') throw(new Error('You must specify `group`'));
  if(!version) throw(new Error('You must specify `version`'));

  const { components: { schemas = {} } = {} } = schema;

  if(Object.keys(schemas).length <= 0) return {};

  return Object.values(schemas).filter(v => {
    return (v['x-kubernetes-group-version-kind'] || []).some((o) => {
      return o.kind == kind && o.group == group && o.version == version;
    });
  })[0];
}

// "kind": "APIGroupList",
// "apiVersion": "v1",
function getGroups({ groups = [] } = {}) {
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
function getResources({ groupVersion = '', resources = [] } = {}) {
  const parts = groupVersion.split('/');
  const outerVersion = parts.pop();
  const outerGroup = parts.length == 1 ? parts[0] : '';
  return resources.reduce((flatResources, resource) => {
    const { name, kind, group, version, storageVersionHash } = resource;

    if(omitSiblings(name)) return [...flatResources];

    const o = {
      kind,
      group: (group ? group : outerGroup),
      version: (version ? version : outerVersion),
      groupVersion,
      storageVersionHash
    };

    return [ ...flatResources, o ];
  }, []);
}

module.exports = {
  fetchApiGroups,
  fetchApiGroupResources,
  fetchOpenApiSpec,
  extractOpenApiSchema,
  getGroups,
  getResources
};
