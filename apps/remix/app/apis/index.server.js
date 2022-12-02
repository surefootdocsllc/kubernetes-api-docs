import fetchOpenApis from "fetch-openapis";

// Handle environment variables

function setEnv() {
  const config = {};

  if(process.env.ENDPOINT) config['apiBaseUrl'] = process.env.ENDPOINT;
  if(process.env.TOKEN) config['token'] = process.env.TOKEN;
  if(process.env.CACERT) config['caCertPath'] = process.env.CACERT;

  return config;
}

export async function getResources() {
  const config = setEnv();

  const { getAllResources } = fetchOpenApis({ ...config });
  const data = await getAllResources().then(unsorted => unsorted.sort((a, b) => a.kind.localeCompare(b.kind)));
  return data;
}

export async function getSchema(kindGroupVersion = {}) {
  const config = setEnv();

  const { getSchema } = fetchOpenApis({ ...config });
  const data = await getSchema({ ...kindGroupVersion });
  return data;
}
