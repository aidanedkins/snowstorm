# Addon's Studio changes to Snowstorm

This branch is **Snowstorm** at commit `4e914ceaeb0843259e3ff1c69ac5545e34aef56b` by JannisX11 and contributors,
released under the **GNU General Public License v3.0 or later** (see `LICENSE` in the repository root), plus the files
in this `addons-studio/` folder. The built app committed in `dist/` at that commit reports version **3.3.1** (the
commit itself bumps `package.json` to 3.3.2), so Addon's Studio calls it 3.3.1.

[Addon's Studio](https://add-on-studio.com) hosts a modified copy of that build at
`https://add-on-studio.com/editor/snowstorm/3.3.1/`, so its app can open a particle in Snowstorm and receive it (with
its picture) straight back when the player saves. The hosted copy is the repository's own `index.html`, `dist/`,
`assets/`, `content/` and `examples/` at that commit, with these changes (and no others):

| File | Change |
|---|---|
| `aos-bridge.js` | **Added.** Talks to the Addon's Studio app with `postMessage`: loads the particle it sends and sends it back (with its texture) when the player saves. The server fills in the app's addresses where the file says `/*ALLOWED_PARENTS*/[]`. |
| `index.html` | **One added line** that loads `aos-bridge.js` (marked with a comment). The full file is in this folder. |

This is not the official Snowstorm website, and Addon's Studio is not affiliated with or endorsed by Snowstorm.
Questions: warpzoneaddon@gmail.com
