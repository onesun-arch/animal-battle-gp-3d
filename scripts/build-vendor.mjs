import { build } from "esbuild";

const common = {
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  minify: true,
};

await Promise.all([
  build({
    ...common,
    stdin: {
      contents: 'import * as THREE from "three"; globalThis.THREE = THREE;',
      resolveDir: process.cwd(),
      sourcefile: "three-entry.js",
      loader: "js",
    },
    outfile: "public/assets/vendor/three.bundle.js",
  }),
  build({
    ...common,
    stdin: {
      contents:
        'import { joinRoom } from "trystero"; globalThis.Trystero = { joinRoom };',
      resolveDir: process.cwd(),
      sourcefile: "trystero-entry.js",
      loader: "js",
    },
    outfile: "public/assets/vendor/trystero.bundle.js",
  }),
]);
