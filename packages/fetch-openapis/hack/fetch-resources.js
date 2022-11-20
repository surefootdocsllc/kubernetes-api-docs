const { getAllResources } = require("..");

async function main() {
  const hostAndPort = process.argv[2] || '';
  const apiResources = await getAllResources({ hostAndPort, secure: false });
  console.log(JSON.stringify(apiResources, null, 2));
}

main();
