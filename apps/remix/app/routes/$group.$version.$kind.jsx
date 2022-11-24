import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { JsonSchemaViewer } from "@stoplight/json-schema-viewer";
import stoplightElementsStyles from '@stoplight/elements/styles.min.css';

import swagger from '@apidevtools/swagger-parser';
import invariant from "tiny-invariant";

export const links = () => [
  { rel: "stylesheet", href: stoplightElementsStyles }
];

export const loader = async ({ params }) => {
  const { kind, group, version } = params;

  invariant(kind, '');
  invariant(group, '');
  invariant(version, '');

  // Get KGV from external lib
  // So this'll be an await func
  // It should come fully resolved?

  const resolvedRefs = await swagger.dereference(schema);
  return json(resolvedRefs);
};

export default function GroupVersionKindRoute() {
  const obj = useLoaderData();
  return (
    <JsonSchemaViewer
      name="Todos Model"
      schema={obj.components.schemas['io.openshift.operator.network.v1.EgressRouter']}
      expanded={true}
      hideTopBar={false}
      emptyText="No schema defined"
      defaultExpandedDepth={0}
    />
  );
}
