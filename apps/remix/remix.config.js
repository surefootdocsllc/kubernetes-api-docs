/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [
    "character-entities",
    "decode-named-character-reference",
    "longest-streak",
    "mdast-util-to-markdown",
    "mdast-util-to-string",
    "micromark-util-character",
    "micromark-util-decode-numeric-character-reference",
    "micromark-util-decode-string",
    "micromark-util-symbol",
    "micromark-util-types",
    "unist-util-is",
    "unist-util-visit",
    "unist-util-visit-parents",
    "zwitch"
  ],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
