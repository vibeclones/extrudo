// Extrudo's service worker (ADR-0037). Built into dist/sw.js by
// pwa/precache-plugin.ts, which fills in VERSION and the file lists.
//
// It precaches the whole app at install (the two WASM files included), so a
// repeat visit, offline or not, never waits for the network, and answers every
// request from that cache. Hashed files (assets/…) are fetched once and kept
// across versions; the few files with fixed names are fetched again at every
// install. An update installs and then waits (ADR-0054: the page shows "A new
// version is ready" and sends SKIP_WAITING when the person agrees, so it never
// swaps under an open design); on activation it keeps the previous version's
// files too, so a tab that is still running the old bundle finds its lazy
// chunks. The new version's index.html shows on the next navigation.
//
// OpenSCAD's WASM (ADR-0071 §4) is not precached: it is 11 MB few designs need.
// The first fetch of it goes to the network and is kept in a cache of its own,
// so every later `.scad` import works offline; an update keeps it while the
// build's hashed name is the same, and drops any other.

/* global self, caches */
const VERSION = 'f4f6cee95b43';
const HASHED = [
  "./assets/ConstraintGlyphs-BDBUJkhC.js",
  "./assets/DimensionLabels-BXSSKZHt.js",
  "./assets/SelectionOverlay-ejH8hjBU.js",
  "./assets/SketchOverlay-CCioaWGl.js",
  "./assets/Viewport-B4VSPomR.js",
  "./assets/ViewportBoundary-BnSNINhY.js",
  "./assets/__vite-browser-external-B28Y8g8N.js",
  "./assets/__vite-browser-external-BbTE95wW.js",
  "./assets/allerta-stencil-regular-Bvk_IB_e.ttf",
  "./assets/b2-storage-box-C9X46_p4.extrudo",
  "./assets/b4-box-with-lid-BumlVO2-.extrudo",
  "./assets/b5-pcb-enclosure-NUM2VZbs.extrudo",
  "./assets/box-with-lid-BSpxwCWK.png",
  "./assets/browser-BOLRVpe0.js",
  "./assets/browser-CpLQIcIP.js",
  "./assets/browser-Dh8fpmVb.js",
  "./assets/browser-worker-CFopr6Z3.js",
  "./assets/build-CEqO6Ph7.js",
  "./assets/camera-PHK5ll-J.js",
  "./assets/construct-YsXOpNjv.js",
  "./assets/design-system-CztnoFjO.js",
  "./assets/dimensionLayout-DQN2X_u4.js",
  "./assets/drafts-L1d5ES_u.js",
  "./assets/emscripten-module-NWak2PoB.wasm",
  "./assets/emscripten-module.browser-BNtHjbWS.js",
  "./assets/extrudo_occt_single-C2MViHjn.js",
  "./assets/extrudo_occt_single-Dz5dbIEh.wasm",
  "./assets/ffi-DBVe9U3D.js",
  "./assets/fredoka-semibold-BHgPcdW0.ttf",
  "./assets/grid-Ct-iWAyb.js",
  "./assets/host-BM9PpJiF.js",
  "./assets/ids-Whmpdo9Z.js",
  "./assets/index-BIPIo-74.css",
  "./assets/index-C5CcjXB4.js",
  "./assets/inference-C0Fulh9d.js",
  "./assets/instrument-sans-latin-400-normal-DRC__1Mx.woff2",
  "./assets/instrument-sans-latin-500-normal-Dk9ku72i.woff2",
  "./assets/instrument-sans-latin-600-normal-B7fBEWYG.woff2",
  "./assets/instrument-sans-latin-ext-400-normal-Q_nF8v4l.woff2",
  "./assets/instrument-sans-latin-ext-500-normal-CTEe1bJa.woff2",
  "./assets/instrument-sans-latin-ext-600-normal-BsaQcF38.woff2",
  "./assets/inter-bold-B3C12c2Y.ttf",
  "./assets/inter-regular-C2t5dCaG.ttf",
  "./assets/jetbrains-mono-cyrillic-400-normal-BEIGL1Tu.woff2",
  "./assets/jetbrains-mono-cyrillic-500-normal-DmUKJPL_.woff2",
  "./assets/jetbrains-mono-greek-400-normal-C190GLew.woff2",
  "./assets/jetbrains-mono-greek-500-normal-JpySY46c.woff2",
  "./assets/jetbrains-mono-latin-400-normal-V6pRDFza.woff2",
  "./assets/jetbrains-mono-latin-500-normal-BWZEU5yA.woff2",
  "./assets/jetbrains-mono-latin-ext-400-normal-Bc8Ftmh3.woff2",
  "./assets/jetbrains-mono-latin-ext-500-normal-Cut-4mMH.woff2",
  "./assets/jetbrains-mono-regular-B_rd5E3W.ttf",
  "./assets/jsx-runtime-NZYk81nU.js",
  "./assets/kernelWorker-8ylmJKxM.js",
  "./assets/keymap-BOavQjX5.js",
  "./assets/manifold-BE4c7gO-.wasm",
  "./assets/manifold-_q_SI9fW.js",
  "./assets/module-6F3E5H7Y-CMv1sDzF.js",
  "./assets/noto-serif-regular-D7tLHo0h.ttf",
  "./assets/openscad-BXV8doDw.js",
  "./assets/pcb-enclosure-CdRBqDY3.png",
  "./assets/pick-BTY83aRv.js",
  "./assets/planegcs-Me-TLacO.wasm",
  "./assets/plugin-file-Ce0NEFuF.js",
  "./assets/pointer-BwmWUR4d.js",
  "./assets/preload-helper-uBIymjUX.js",
  "./assets/profiles-BE1t1I1O.js",
  "./assets/profiles-DQoOIpNQ.js",
  "./assets/react-Cvdyeg_0.js",
  "./assets/react-u54ufNxj.js",
  "./assets/renderMeter-DRRln1HT.js",
  "./assets/rolldown-runtime-CbXtAM7H.js",
  "./assets/rolldown-runtime-hePW80VL.js",
  "./assets/rotate-ccw-CpwN2UFD.js",
  "./assets/scriptEditor-Bp9M1pZI.js",
  "./assets/src-BmAo3QHE.js",
  "./assets/src-MJo_H_nE.js",
  "./assets/src-StYnCT_u.js",
  "./assets/storage-box-CQhvepWS.png",
  "./assets/text-BkrbqPiy.js",
  "./assets/text-Br4RCZ7o.js",
  "./assets/text-CIEEMgz6.js",
  "./assets/text-DEnNvVKY.js",
  "./assets/useRecompute-tvKb_bGm.js",
  "./assets/wall-bracket-KwGmewws.png",
  "./assets/worker-CryUf0MK.js"
];
const FIXED = [
  "./favicon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./index.html",
  "./manifest.webmanifest"
];
// Files cached on first use instead of at install: this build's OpenSCAD WASM.
const RUNTIME = ["./assets/openscad-BrZABtxO.wasm"];

const CACHE = 'extrudo-precache';
const RUNTIME_CACHE = 'extrudo-openscad';
const IS_RUNTIME = /\/assets\/openscad-[^/]+\.wasm$/;
const INDEX = './index.html';
// The URLs the previous version precached: this version keeps them one more round.
const PREVIOUS = './.previous-precache';

const url = (path) => new URL(path, self.location.href).href;

// A host may answer a path through a redirect: Cloudflare Pages sends
// `/index.html` to `/` with a 308. The response fetch() returns then says
// `redirected`, and a browser refuses such a response for a navigation
// (ERR_FAILED on every visit after the first). Store and serve a plain copy.
const plain = async (response) =>
  response.redirected
    ? new Response(await response.blob(), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    : response;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const have = new Set((await cache.keys()).map((request) => request.url));
      // 'reload' skips the HTTP cache: precached files must be this build's.
      const add = async (path) => {
        const response = await fetch(new Request(url(path), { cache: 'reload' }));
        if (!response.ok) throw new Error(`${path}: ${response.status}`);
        await cache.put(url(path), await plain(response));
      };
      await Promise.all([
        ...HASHED.filter((path) => !have.has(url(path))).map(add),
        ...FIXED.map(add),
      ]);
      // No skipWaiting() here: a first install activates by itself (nothing to wait
      // for), an update waits for the page's SKIP_WAITING message.
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const previous = await cache
        .match(url(PREVIOUS))
        .then((response) => (response ? response.json() : []))
        .catch(() => []);
      const current = [...HASHED, ...FIXED].map(url);
      const keep = new Set([...current, ...previous, url(PREVIOUS)]);
      for (const request of await cache.keys()) {
        if (!keep.has(request.url)) await cache.delete(request);
      }
      await cache.put(
        url(PREVIOUS),
        new Response(JSON.stringify(current), { headers: { 'x-extrudo-version': VERSION } }),
      );
      // The runtime cache keeps only what this build would fetch.
      const runtime = await caches.open(RUNTIME_CACHE);
      const wanted = new Set(RUNTIME.map(url));
      for (const request of await runtime.keys()) {
        if (!wanted.has(request.url)) await runtime.delete(request);
      }
      // Caches of other names (an earlier scheme) are never ours to keep.
      for (const name of await caches.keys()) {
        if (name !== CACHE && name !== RUNTIME_CACHE) await caches.delete(name);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const target = new URL(request.url);
  if (target.origin !== self.location.origin) return;
  // The tools' demo clips (P3-12) aren't precached and are range-requested by
  // <video>: the browser fetches them itself.
  if (/\/demos\/[^/]+$/.test(target.pathname)) return;
  // OpenSCAD's WASM: from its own cache, else fetched once and kept (ADR-0071 §4).
  if (IS_RUNTIME.test(target.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        const hit = await cache.match(request.url, { ignoreVary: true });
        if (hit) return hit;
        const response = await fetch(request);
        if (response.ok && !response.redirected) await cache.put(request.url, response.clone());
        return response;
      })(),
    );
    return;
  }
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      // Every navigation is the one page: routes are hash routes.
      // ignoreVary: a host's `Vary: Origin` would otherwise miss module scripts,
      // whose requests carry an Origin header the precache's requests lack.
      const hit = await cache.match(request.mode === 'navigate' ? url(INDEX) : request.url, {
        ignoreVary: true,
      });
      return hit ? plain(hit) : fetch(request);
    })(),
  );
});
