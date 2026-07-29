import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://animal-gp.test/", {
      headers: {
        accept: "text/html",
        host: "animal-gp.test",
        "x-forwarded-host": "animal-gp.test",
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the multiplayer game shell and social metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>애니멀 배틀 GP<\/title>/);
  assert.match(html, /src="\/game\.html"/);
  assert.match(html, /https:\/\/animal-gp\.test\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview/);
});

test("ships the WebGL game and local textures", async () => {
  const game = await readFile(new URL("../public/game.html", import.meta.url), "utf8");
  assert.match(game, /new THREE\.WebGLRenderer/);
  assert.match(game, /powerPreference:"high-performance"/);
  assert.match(game, /new THREE\.PerspectiveCamera\(58/);
  assert.match(game, /function showStartingGrid/);
  assert.match(game, /6마리 모두 1,800m 정글 원랩/);
  assert.match(game, /kart=new THREE\.Group/);
  assert.match(game, /targetRotations/);
  assert.match(game, /new THREE\.CatmullRomCurve3/);
  assert.match(game, /function ribbonGeometry/);
  assert.match(game, /GL\.trackCurve\.getPointAt/);
  assert.match(game, /duration:22000/);
  assert.match(game, /LAP 0 \/ 1/);
  assert.match(game, /v\*1800/);
  assert.match(game, /boostMaterial/);
  assert.match(game, /exhaustMaterial/);
  assert.match(game, /classList\.toggle\("racing"/);
  assert.match(game, /grass-tile\.jpg/);
  assert.match(game, /dirt-tile\.jpg/);
  assert.match(game, /amazon-race-arena\.png/);
  assert.match(game, /photoreal-characters-v2\/rabbit\.png/);
  assert.match(game, /new THREE\.MeshPhysicalMaterial/);
  assert.match(game, /scene\.environment=jungle/);
  assert.match(game, /McLaren P1/);
  assert.match(game, /Lamborghini Aventador/);
  assert.match(game, /Ferrari LaFerrari/);
  assert.match(game, /Bugatti Chiron/);
  assert.match(game, /Nissan GT-R R35/);
  assert.match(game, /Rolls-Royce Phantom/);
  assert.match(game, /const racerName=/);
  assert.match(game, /alphaTest:\.025/);
  assert.match(game, /joinRoom/);
  assert.match(game, /shareRoom/);
  assert.match(game, /https:\/\/onesun-arch\.github\.io\/animal-battle-gp-3d\//);
  assert.match(game, /id="allin"/);
  assert.match(game, /id="loan"/);
  assert.match(game, /p\.coins<=0/);
  assert.match(game, /최종 순위 발표/);
  assert.match(game, /긴급대출은 최대 2회/);
  assert.doesNotMatch(game, /esm\.sh\/trystero/);
  assert.doesNotMatch(game, /<script type="module">/);
  assert.match(game, /three\.bundle\.js/);
  assert.match(game, /trystero\.bundle\.js/);
  await Promise.all([
    access(new URL("../public/assets/vendor/three.bundle.js", import.meta.url)),
    access(new URL("../public/assets/vendor/trystero.bundle.js", import.meta.url)),
    access(new URL("../public/assets/textures/grass-tile.jpg", import.meta.url)),
    access(new URL("../public/assets/textures/dirt-tile.jpg", import.meta.url)),
    access(new URL("../public/assets/amazon-race-arena.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);
});
