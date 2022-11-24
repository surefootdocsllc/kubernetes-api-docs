import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import stoplightElementsStyles from '@stoplight/elements/styles.min.css';
//import styles from "./styles/tailwind.css";

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

import semanticUiStyles from 'semantic-ui-css/semantic.min.css';
import globalStyles from './styles/global.css';

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

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links = () => [
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: semanticUiStyles }
];
export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{__html: script}} />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
