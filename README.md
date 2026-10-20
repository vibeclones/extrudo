# extrudo (Vibeclones mirror)

Hosted browser builds of older versions of [Extrudo](https://github.com/zoltanf/extrudo), parametric CAD for 3D printing, by [Zoltan Fekete](https://github.com/zoltanf). The code is his; this repo only builds and hosts it. The project's own web app is at https://app.extrudo.org, and it serves only the newest version.

- Latest: `/extrudo/latest/`
- A specific version: `/extrudo/v<version>/`, for example `/extrudo/v0.8.1/`
- Version list: `/extrudo/versions.json`

Extrudo's releases carry only desktop installers, so each version is built from its release tag with the project's own stable web build (`pnpm --filter @extrudo/web build`), the same way the author's deploy workflow does. It uses relative paths, so it works from a subfolder. No source changes are made. A scheduled workflow builds new tags.

Upstream is licensed GPL-3.0-or-later. Every version folder includes the license and a `SOURCE.txt` naming the exact upstream tag it was built from.
