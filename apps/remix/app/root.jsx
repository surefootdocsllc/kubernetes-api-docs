import { useState } from "react";
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
import { Grid, Header } from 'semantic-ui-react';

import InjectWindowProcess from "./components/InjectWindowProcess";
import ApiList from "./components/ApiList";

import { getResources } from './apis/index.server';

import semanticUiStyles from 'semantic-ui-css/semantic.min.css';
import globalStyles from './styles/global.css';

export const meta = () => ({
  charset: "utf-8",
  title: "Kubernetes API Schema Viewer",
  viewport: "width=device-width,initial-scale=1",
});

export const links = () => [
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: semanticUiStyles }
];

export async function loader() {
  return json(await getResources());
}

export default function App() {
  const [ apis, setApis ] = useState(useLoaderData());

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <InjectWindowProcess />
      </head>
      <body>
        <Grid>
          <Grid.Column width={3}>
            <Header as='h1' dividing>
            Cluster APIs
            </Header>
            <ApiList apis={apis} />
          </Grid.Column>
          <Grid.Column width={13}>
            <Header as='h1' dividing>
            Schema viewer
            </Header>
            <Outlet />
          </Grid.Column>
        </Grid>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
