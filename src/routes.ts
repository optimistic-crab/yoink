import { type Route, serveDir } from "@std/http";
import home from "./endpoints/home.ts";
import fetchr from "./endpoints/fetchr.ts";
import _static from "./endpoints/static.ts";

export const routes: Route[] = [
  {
    pattern: new URLPattern({ pathname: "/" }),
    handler: home.handleRequest,
  },
  {
    pattern: new URLPattern({ pathname: "/static/*" }),
    handler: _static.handleRequest,
  },
  {
    pattern: new URLPattern({ pathname: "/fetchr/:src/*" }),
    handler: fetchr.handleRequest,
  },
];
