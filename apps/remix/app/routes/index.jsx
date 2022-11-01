import { JsonSchemaViewer } from "@stoplight/json-schema-viewer";
import blah from '@stoplight/elements/styles.min.css';

const schema = require('../network-operator.json');

export const links = () => {
  return [
    { rel: "stylesheet", href: blah }
  ];
};

export default function Index() {
  return (
    <JsonSchemaViewer
      name="Todos Model"
      schema={schema.components.schemas['io.openshift.operator.network.v1.EgressRouter']}
      expanded={true}
      hideTopBar={false}
      emptyText="No schema defined"
      defaultExpandedDepth={0}
    />
  );
}
