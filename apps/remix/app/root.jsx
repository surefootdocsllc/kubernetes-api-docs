import { useLoaderData } from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { json } from "@remix-run/node";

import fetchOpenApis from "fetch-openapis";

import { Grid, List, Button } from 'semantic-ui-react';

import semanticUiStyles from 'semantic-ui-css/semantic.min.css';
import globalStyles from './styles/global.css';
//import styles from "./styles/tailwind.css";

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

export async function loader() {
  const { getAllResources } = fetchOpenApis();
  const data = await getAllResources();
  return json(data);
}

export default function App() {
  const apis = useLoaderData();
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
