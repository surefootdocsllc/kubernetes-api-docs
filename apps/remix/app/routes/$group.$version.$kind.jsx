import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Header } from 'semantic-ui-react';
import { JsonSchemaViewer } from "@stoplight/json-schema-viewer";

import { getSchema } from '../apis/index.server';

import stoplightElementsStyles from '@stoplight/elements/styles.min.css';

export const links = () => [
  { rel: "stylesheet", href: stoplightElementsStyles }
];

export const loader = async ({ params }) => {
  const { kind, version } = params;
  // An empty group maps to builtin APIs like Pod and Container
  const group = params.group == '_' ? '' : (params.group ?? '');

  invariant(kind, '');
  invariant((typeof group == 'string'), '');
  invariant(version, '');

  return json(await getSchema({ kind, group, version }));
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
