/* Shared behavior. Everything here is progressive: the page works without it. */

/* ---- color theme: system -> light -> dark, remembered ------------------ */
(function () {
  var KEY = "lm-theme";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  var ICONS = { system: "bi-circle-half", light: "bi-sun", dark: "bi-moon-stars" };
  var LABELS = {
    system: "Color theme: following your system setting",
    light: "Color theme: light",
    dark: "Color theme: dark"
  };

  function current() {
    var t = null;
    try { t = localStorage.getItem(KEY); } catch (e) {}
    return t === "light" || t === "dark" ? t : "system";
  }

  function apply(mode) {
    if (mode === "system") {
      root.removeAttribute("data-theme");
      root.setAttribute("data-bs-theme",
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      try { localStorage.removeItem(KEY); } catch (e) {}
    } else {
      root.setAttribute("data-theme", mode);
      root.setAttribute("data-bs-theme", mode);
      try { localStorage.setItem(KEY, mode); } catch (e) {}
    }
    var icon = btn.querySelector("i");
    if (icon) icon.className = "bi " + ICONS[mode];
    btn.setAttribute("aria-label", LABELS[mode]);
    var state = document.getElementById("theme-state");
    if (state) state.textContent = mode;
  }

  apply(current());

  btn.addEventListener("click", function () {
    var order = ["system", "light", "dark"];
    apply(order[(order.indexOf(current()) + 1) % order.length]);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (current() === "system") apply("system");
  });
})();

/* ---- back to top: one button, revealed once it is actually useful ------- */
(function () {
  var btn = document.querySelector(".back-to-top");
  if (!btn) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function update() {
    btn.classList.toggle("is-visible", window.scrollY > window.innerHeight * 1.5);
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    var h = document.querySelector("main h1");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  });
})();

/* ---- "on this page": mark the section you are actually reading --------- */
(function () {
  var links = document.querySelectorAll(".on-this-page a");
  if (!links.length || !("IntersectionObserver" in window)) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  var heads = Object.keys(byId).map(function (id) { return document.getElementById(id); })
                    .filter(Boolean);
  var seen = new Set();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) seen.add(e.target.id); else seen.delete(e.target.id);
    });
    links.forEach(function (a) { a.removeAttribute("aria-current"); });
    var first = heads.find(function (h) { return seen.has(h.id); });
    if (first && byId[first.id]) byId[first.id].setAttribute("aria-current", "true");
  }, { rootMargin: "-80px 0px -70% 0px" });
  heads.forEach(function (h) { io.observe(h); });
})();

/* ---- scrollable code blocks must be reachable by keyboard ---------------
   Only the blocks that actually overflow become tab stops, so a page full of
   short snippets does not fill the tab order. Tables get this server-side,
   where it also survives JavaScript being unavailable. */
(function () {
  const blocks = document.querySelectorAll(".highlight, div.excalifont, .customBlock");
  if (!blocks.length) return;
  const label = function (el) {
    if (!el.classList.contains("highlight")) return "Formula";
    const code = el.querySelector('[class*="language-"]');
    const m = code && code.className.match(/language-([\w+-]+)/);
    return m ? "Code sample, " + m[1] : "Code sample";
  };
  const update = function () {
    let n = 0;
    blocks.forEach(function (el) {
      n += 1;
      if (el.scrollWidth > el.clientWidth + 1) {
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "group");
        el.setAttribute("aria-label", label(el) + " " + n + " (scrollable)");
      } else {
        el.removeAttribute("tabindex");
        el.removeAttribute("role");
        el.removeAttribute("aria-label");
      }
    });
  };
  update();
  // A block only overflows once the handwriting face has swapped in, so the
  // measurement has to be repeated after the fonts settle.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
  window.addEventListener("resize", update, { passive: true });
})();

/* ---- reading progress in the margin ------------------------------------ */
(function () {
  var rail = document.querySelector("[data-progress-rail]");
  var article = rail && rail.closest(".chapter");
  if (!rail || !article) return;

  var fill = rail.querySelector(".progress-rail__fill");
  var heads = [].slice.call(article.querySelectorAll(".chapter__body > h2[id]"));
  if (!heads.length) return;

  // one tick per section, placed at its share of the article's height
  var ticks = heads.map(function (h) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "progress-rail__tick";
    b.innerHTML = '<span class="progress-rail__label"></span>';
    b.querySelector(".progress-rail__label").textContent = h.textContent.replace(/\s+/g, " ").trim();
    b.setAttribute("aria-label", "Jump to " + b.querySelector(".progress-rail__label").textContent);
    b.addEventListener("click", function () {
      h.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
      h.setAttribute("tabindex", "-1");
      h.focus({ preventScroll: true });
    });
    rail.appendChild(b);
    return { el: b, head: h };
  });
  // the rail is a navigation aid, so expose it once it has content
  rail.removeAttribute("aria-hidden");
  rail.setAttribute("role", "group");
  rail.setAttribute("aria-label", "Chapter progress");

  function reduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function place() {
    var h = article.offsetHeight;
    ticks.forEach(function (t) {
      t.el.style.top = ((t.head.offsetTop / h) * 100).toFixed(2) + "%";
    });
  }

  function update() {
    var top = article.offsetTop;
    var read = window.scrollY + window.innerHeight * 0.5 - top;
    var pct = Math.max(0, Math.min(1, read / article.offsetHeight));
    fill.style.blockSize = (pct * 100).toFixed(2) + "%";
    var currentIndex = -1;
    ticks.forEach(function (t, i) {
      var passed = t.head.offsetTop <= read;
      t.el.classList.toggle("is-read", passed);
      if (passed) currentIndex = i;
    });
    ticks.forEach(function (t, i) {
      t.el.classList.toggle("is-current", i === currentIndex);
    });
  }

  function refresh() { place(); update(); }
  refresh();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", refresh, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  // Images and embeds land after first paint and move every heading with them,
  // which is what made the ticks drift out of line with their sections.
  if ("ResizeObserver" in window) new ResizeObserver(refresh).observe(article);
  article.querySelectorAll("img").forEach(function (img) {
    if (!img.complete) img.addEventListener("load", refresh, { once: true });
  });
})();

/* ---- copy buttons report what happened --------------------------------- */
function copyContent(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var status = document.getElementById(id + "-status");
  navigator.clipboard.writeText(el.textContent || el.innerText).then(
    function () { if (status) { status.textContent = "Copied to clipboard"; setTimeout(function () { status.textContent = ""; }, 4000); } },
    function () { if (status) status.textContent = "Could not copy — select the text and copy manually"; }
  );
}
