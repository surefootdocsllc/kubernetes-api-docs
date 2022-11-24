import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { JsonSchemaViewer } from "@stoplight/json-schema-viewer";
import stoplightElementsStyles from '@stoplight/elements/styles.min.css';

import invariant from "tiny-invariant";

import fetchOpenApis from "fetch-openapis";

export const links = () => [
  { rel: "stylesheet", href: stoplightElementsStyles }
];

export const loader = async ({ params }) => {
  const { kind, version } = params;
  // An empty group maps to builtin APIs like Pod and Container
  const group = params.group == '-' ? '' : params.group;
  const { getSchema } = fetchOpenApis();

  invariant(kind, '');
  invariant(group, '');
  invariant(version, '');

  const data = await getSchema({ kind, group, version });
  return json(data);
};

export default function GroupVersionKindRoute() {
  const obj = useLoaderData();
  return (
    <JsonSchemaViewer
      name="Todos Model"
      schema={obj}
      expanded={true}
      hideTopBar={false}
      emptyText="No schema defined"
      defaultExpandedDepth={0}
    />
  );
}
