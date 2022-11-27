import { List } from 'semantic-ui-react';

export default function ApiList({ apis, emptyList }) {
  emptyList = emptyList ?? <div>None</div>;

  const Li = ({ api: { kind, group, version } }) => {
    group = !!group ? group : '_';
    const href = `/${group}/${version}/${kind}`;
    const groupVersion = group == '_' ? version : `${group}/${version}`;
    return (
      <List.Item>
        <List.Content>
          <List.Header as="a" href={href}>
            {kind}
          </List.Header>
          <List.Description>
            {groupVersion}
          </List.Description>
        </List.Content>
      </List.Item>
    );
  };

  return apis.length <= 0 ? emptyList : (
    <List>
      {
        apis.map(api => <Li key={api.kind+''+api.group+''+api.version} api={api}/>)
      }
    </List>
  );
}
