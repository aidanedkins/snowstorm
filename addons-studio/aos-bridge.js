/*
 * Addon's Studio bridge for Snowstorm.
 * Copyright (C) 2026 WarpZone. Part of a modified version of Snowstorm (https://github.com/JannisX11/snowstorm),
 * licensed under the GNU General Public License v3.0 or later, like Snowstorm itself (see LICENSE).
 * Modified by Addon's Studio on 10 November 2026: this file was added, and index.html loads it.
 *
 * It lets the Addon's Studio app (which shows this page in a frame) open a particle in Snowstorm and get it back,
 * with its picture, when the player saves (Ctrl+S, File › Download, or the app's own Save button). Messages only go
 * to, and are only accepted from, the app's own address, and only for this frame's session.
 */
"use strict";
(function () {
  // The app addresses allowed to use this bridge (filled in by the server).
  var ALLOWED = /*ALLOWED_PARENTS*/[];
  var q = new URLSearchParams(location.hash.slice(1));
  var session = q.get("aos") || "";
  var parentOrigin = q.get("o") || "";
  if (!/^[A-Za-z0-9-]{8,64}$/.test(session) || ALLOWED.indexOf(parentOrigin) < 0 || window.parent === window) return;

  function send(type, data) {
    var m = { ns: "aos", v: 1, session: session, type: type };
    if (data) for (var k in data) m[k] = data[k];
    window.parent.postMessage(m, parentOrigin);
  }

  function snapshot() {
    var tex = typeof window.getTextureForParentEffect === "function" ? window.getTextureForParentEffect() : "";
    return {
      particle: JSON.parse(window.generateFileForParentEffect()),
      texture: typeof tex === "string" && tex.indexOf("data:image/png") === 0 ? tex : null,
    };
  }

  function save() {
    try {
      if (typeof window.generateFileForParentEffect !== "function") return send("error", { message: "Snowstorm isn't ready yet." });
      send("saved", snapshot());
    } catch (err) {
      send("error", { message: String((err && err.message) || err) });
    }
  }

  // File › Download saves to Addon's Studio instead of downloading (the menu uses a download link).
  var click = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download && /\.json$/i.test(this.download)) return save();
    return click.call(this);
  };
  window.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      e.stopPropagation();
      save();
    }
  }, true);

  window.addEventListener("message", function (e) {
    if (e.origin !== parentOrigin || e.source !== window.parent) return;
    var m = e.data;
    if (!m || m.ns !== "aos" || m.session !== session) return;
    if (m.type === "load") {
      try {
        window.loadFileFromParentEffect(JSON.stringify(m.particle), typeof m.texture === "string" ? m.texture : undefined);
        send("loaded");
      } catch (err) {
        send("error", { message: String((err && err.message) || err) });
      }
    } else if (m.type === "requestSave") {
      save();
    }
  });

  (function wait() {
    if (typeof window.loadFileFromParentEffect !== "function" || typeof window.generateFileForParentEffect !== "function") return setTimeout(wait, 100);
    // No "you have unsaved changes" prompt when the app closes the frame (the app asks instead).
    window.onbeforeunload = null;
    send("ready");
  })();
})();
