import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Header } from 'semantic-ui-react';
import { JsonSchemaViewer } from "@stoplight/json-schema-viewer";

import fetchOpenApis from "fetch-openapis";

import stoplightElementsStyles from '@stoplight/elements/styles.min.css';

export const links = () => [
  { rel: "stylesheet", href: stoplightElementsStyles }
];

export const loader = async ({ params }) => {
  const { kind, version } = params;
  // An empty group maps to builtin APIs like Pod and Container
  const group = params.group == '_' ? '' : params.group;
  const { getSchema } = fetchOpenApis();

  invariant(kind, '');
  //invariant(group, '');
  invariant(version, '');

  const data = await getSchema({ kind, group, version });
  return json(data);
};

export default function GroupVersionKindRoute() {
  const obj = useLoaderData();
  const { kind, version, group } = useParams();
  const groupVersion = group == '_' ? version : `${group}/${version}`;
  const schemaTitle = `${kind} ${groupVersion}`;

  return (
    <>
    <Header as='h2'>{schemaTitle}</Header>
    <JsonSchemaViewer
      name="Todos Model"
      schema={obj}
      expanded={true}
      hideTopBar={false}
      emptyText="No schema defined"
      defaultExpandedDepth={0}
    />
    </>
  );
}
