/* ============================================================
   10,000 HOURS — THEME ENGINE (design.md §25)
   auto → light → dark → auto, persisted as `tenk.theme`.
   The inline boot script paints the first frame; this file owns
   the control, the shortcut, live system changes, and motion.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "tenk.theme";
  var PREFS = ["auto", "light", "dark"];
  var root = document.documentElement;
  var isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");
  var mql = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var mqlReduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

  var live = null;
  var switching = false;
  var fallbackTimer = 0;
  var announceTimer = 0;

  /* ----------------------------------------------------------
     state
     ---------------------------------------------------------- */
  function validPref(value) {
    return value === "light" || value === "dark" || value === "auto" ? value : null;
  }

  function readStored() {
    try {
      return validPref(localStorage.getItem(KEY)) || "auto";
    } catch (err) {
      return "auto";
    }
  }

  function readForced() {
    try {
      return validPref(new URLSearchParams(location.search).get("theme"));
    } catch (err) {
      return null;
    }
  }

  function systemTheme() {
    return mql && mql.matches ? "dark" : "light";
  }

  function resolve(pref) {
    return pref === "auto" ? systemTheme() : pref;
  }

  var forced = readForced();
  var pref = forced || readStored();
  var current = resolve(pref);

  /* ----------------------------------------------------------
     painting
     ---------------------------------------------------------- */
  function nextPref(p) {
    return PREFS[(PREFS.indexOf(p) + 1) % PREFS.length];
  }

  function syncControls() {
    var controls = document.querySelectorAll(".theme-btn,.theme-fab");
    for (var i = 0; i < controls.length; i++) {
      var btn = controls[i];
      if (btn.dataset.pref !== pref) btn.dataset.pref = pref;
      var label = "Theme: " + pref + (pref === "auto" ? ", " + current : "") +
        ". Activate for " + nextPref(pref) + ".";
      if (btn.getAttribute("aria-label") !== label) btn.setAttribute("aria-label", label);
      if (btn.getAttribute("aria-keyshortcuts") !== "Meta+Shift+L Control+Shift+L") {
        btn.setAttribute("aria-keyshortcuts", "Meta+Shift+L Control+Shift+L");
      }
      var tip = btn.querySelector(".theme-tip");
      var text = "theme · " + pref;
      if (tip && tip.textContent !== text) tip.textContent = text;
    }
  }

  function applyVisual(p) {
    pref = p;
    current = resolve(p);
    root.dataset.theme = current;
    root.dataset.themePref = p;
    try { root.style.colorScheme = current; } catch (err) { /* older engines */ }
    var meta = document.getElementById("themeColor");
    if (meta) meta.setAttribute("content", current === "dark" ? "#0b0b0c" : "#ffffff");
    syncControls();
  }

  function persist(p) {
    try { localStorage.setItem(KEY, p); } catch (err) { /* private mode / file:// */ }
  }

  function clearForced() {
    if (!forced) return;
    forced = null;
    try {
      var url = new URL(location.href);
      url.searchParams.delete("theme");
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (err) { /* keep the URL as it is */ }
  }

  function srRegion() {
    if (!live) {
      live = document.createElement("div");
      live.className = "tenk-sr";
      live.setAttribute("role", "status");
      live.setAttribute("aria-live", "polite");
      document.body.appendChild(live);
    }
    return live;
  }

  function announce(message) {
    var el = srRegion();
    clearTimeout(announceTimer);
    el.textContent = "";
    announceTimer = setTimeout(function () { el.textContent = message; }, 40);
  }

  /* ----------------------------------------------------------
     transition
     ---------------------------------------------------------- */
  function reduced() {
    return !!(mqlReduce && mqlReduce.matches);
  }

  function setRevealOrigin(origin) {
    var w = window.innerWidth || document.documentElement.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight;
    var x = origin && typeof origin.x === "number" ? origin.x : w / 2;
    var y = origin && typeof origin.y === "number" ? origin.y : h / 2;
    var r = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 24;
    root.style.setProperty("--tenk-x", x + "px");
    root.style.setProperty("--tenk-y", y + "px");
    root.style.setProperty("--tenk-r", r + "px");
  }

  function settleFallback() {
    clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(function () {
      root.classList.remove("tenk-switching");
    }, 420);
  }

  function changeTo(next, opts) {
    opts = opts || {};
    var nextTheme = resolve(next);
    var themeChanged = nextTheme !== current;

    clearForced();
    persist(next);

    if (!themeChanged) {
      applyVisual(next);
      if (opts.announce) announce("Theme: " + next + ".");
      return;
    }

    if (reduced() || switching) {
      applyVisual(next);
      if (opts.announce) announce("Theme: " + next + (next === "auto" ? ", " + nextTheme : "") + ".");
      return;
    }

    if (typeof document.startViewTransition === "function") {
      setRevealOrigin(opts.origin || null);
      switching = true;
      root.classList.add("tenk-vt");
      var settle = function () {
        switching = false;
        root.classList.remove("tenk-vt");
      };
      var transition;
      try {
        transition = document.startViewTransition(function () { applyVisual(next); });
      } catch (err) {
        settle();
        applyVisual(next);
      }
      if (transition) {
        if (transition.finished && transition.finished.then) transition.finished.then(settle, settle);
        else setTimeout(settle, 540);
      } else {
        settle();
      }
    } else {
      root.classList.add("tenk-switching");
      applyVisual(next);
      settleFallback();
    }

    if (opts.announce) announce("Theme: " + next + (next === "auto" ? ", " + nextTheme : "") + ".");
  }

  function cycle(origin, opts) {
    opts = opts || {};
    changeTo(nextPref(pref), { origin: origin || null, announce: opts.announce !== false });
  }

  /* ----------------------------------------------------------
     controls
     ---------------------------------------------------------- */
  var ICON_AUTO =
    '<circle cx="12" cy="12" r="7.2"/>' +
    '<path d="M12 4.8a7.2 7.2 0 0 1 0 14.4z" fill="currentColor" stroke="none"/>';
  var ICON_LIGHT =
    '<circle cx="12" cy="12" r="3.6"/>' +
    '<path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1' +
    'M5.5 5.5l1.5 1.5M17 17l1.5 1.5M18.5 5.5L17 7M7 17l-1.5 1.5"/>';
  var ICON_DARK =
    '<path d="M20.4 14.4A8.6 8.6 0 0 1 9.6 3.6a8.6 8.6 0 1 0 10.8 10.8z"/>';

  function glyph(kind) {
    return '<svg class="theme-ico theme-ico--' + kind + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' +
      (kind === "auto" ? ICON_AUTO : kind === "light" ? ICON_LIGHT : ICON_DARK) +
      "</svg>";
  }

  function makeControl(kind) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = kind === "fab" ? "theme-fab" : "theme-btn";
    btn.innerHTML = glyph("auto") + glyph("light") + glyph("dark") +
      '<span class="theme-tip" aria-hidden="true">theme</span>';
    btn.dataset.pref = pref;
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var r = btn.getBoundingClientRect();
      cycle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    });
    return btn;
  }

  function mountHeaderControl() {
    var legend = document.querySelector(".v1 .legend");
    if (!legend) return;
    if (!legend.querySelector(".theme-btn")) legend.appendChild(makeControl("btn"));
    syncControls();
  }

  function mountCheatSheet() {
    var list = document.querySelector("#keysDialog .keys-group:last-child .keys-list");
    if (!list || list.querySelector("[data-theme-key]")) return;
    var row = document.createElement("div");
    row.className = "keys-row";
    row.setAttribute("data-theme-key", "");
    row.innerHTML =
      '<span class="keys-keys"><kbd class="kbd kbd-theme">' +
      (isMac ? "⌘⇧L" : "Ctrl+Shift+L") +
      '</kbd></span><span class="keys-label">cycle theme</span>';
    list.appendChild(row);
  }

  function mountGalleryControl() {
    if (!document.getElementById("gallery")) return;
    if (document.querySelector(".theme-fab")) return;
    document.body.appendChild(makeControl("fab"));
    syncControls();
  }

  function mountAll() {
    mountHeaderControl();
    mountCheatSheet();
    mountGalleryControl();
  }

  /* ----------------------------------------------------------
     live sources
     ---------------------------------------------------------- */
  function onSystemChange() {
    if (pref !== "auto") return;         /* an explicit choice wins */
    if (resolve("auto") === current) return;
    changeTo("auto", { announce: false });
  }

  if (mql) {
    if (mql.addEventListener) mql.addEventListener("change", onSystemChange);
    else if (mql.addListener) mql.addListener(onSystemChange);
  }

  window.addEventListener("storage", function (event) {
    if (event.key !== KEY) return;
    var next = validPref(event.newValue) || "auto";
    forced = null;
    if (resolve(next) !== current) changeTo(next, { announce: false });
    else applyVisual(next);
  });

  /* Cmd+Shift+L / Ctrl+Shift+L — capture phase, so it also works
     with a surface open, and no text input can swallow it. */
  window.addEventListener("keydown", function (event) {
    if (event.altKey) return;
    if (!event.shiftKey) return;
    if ((event.key || "").toLowerCase() !== "l") return;
    var modifier = isMac ? event.metaKey : event.ctrlKey;
    if (!modifier) return;
    event.preventDefault();
    event.stopPropagation();
    cycle(null);
  }, true);

  /* ----------------------------------------------------------
     mount
     ---------------------------------------------------------- */
  applyVisual(pref);
  mountAll();

  var app = document.getElementById("app");
  if (app && window.MutationObserver) {
    new MutationObserver(function () { mountAll(); })
      .observe(app, { childList: true, subtree: true });
  }

  window.TenkTheme = {
    get: function () { return { pref: pref, theme: current }; },
    set: function (next) {
      if (!validPref(next)) return;
      changeTo(next, { announce: true });
    },
    cycle: function () { cycle(null); },
    refresh: function () { applyVisual(forced || readStored()); }
  };
})();
