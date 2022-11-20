const { getSchema } = require("..");

async function main() {
  const hostAndPort = process.argv[2] || '';
  const kind = process.argv[3] || ''
  const group = process.argv[4] || ''
  const version = process.argv[5] || ''

  const openApiSpec = await getSchema({ kind, group, version, hostAndPort, secure: false });
  //console.log(openApiSpec);
  console.log(JSON.stringify(openApiSpec, null, 2));
}

main();
