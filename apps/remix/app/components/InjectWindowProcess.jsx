// For /@stoplight/mosaic/core.esm.js
const script = `
if(document) {
  window.process = {
    env: {
      TEST_SSR: false,
      NODE_ENV: 'production'
    }
  };
}
`;

export default () => {
  return (
    <>
      <script dangerouslySetInnerHTML={{__html: script}} />
    </>
  );
};
