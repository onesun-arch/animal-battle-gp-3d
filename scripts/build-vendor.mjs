import { build } from "esbuild";

await build({
  stdin: {
    contents: 'export { joinRoom } from "trystero";',
    resolveDir: process.cwd(),
    sourcefile: "trystero-entry.js",
    loader: "js",
  },
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2022"],
  minify: true,
  outfile: "public/assets/vendor/trystero.bundle.js",
});
