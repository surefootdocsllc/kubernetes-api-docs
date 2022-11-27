import fetchOpenApis from "fetch-openapis";

// Handle environment variables

export async function getResources() {
  const { getAllResources } = fetchOpenApis();
  const data = await getAllResources().then(unsorted => unsorted.sort((a, b) => a.kind.localeCompare(b.kind)));
  return data;
}
