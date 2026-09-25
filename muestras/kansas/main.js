(function () {
  /* Kansas Grill & Bar — concepto de diseño (R1). Sin módulos ni librerías externas. */
  "use strict";


  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  function initSplash() {
    var splash = document.querySelector("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") setTimeout(hide, 500);
    else window.addEventListener("load", function () { setTimeout(hide, 350); });
    setTimeout(hide, 4000);
  }

  function initNav() {
    var nav = document.querySelector("[data-nav]");
    var burger = document.querySelector("[data-burger]");
    var links = document.getElementById("navLinks");
    if (!nav || !burger || !links) return;

    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 10); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var setOpen = function (open) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      links.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function initReveals() {
    var els = document.querySelectorAll(".reveal");
    var stagger = function (el) {
      var siblings = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [];
      var i = Array.prototype.indexOf.call(siblings, el);
      if (i > 0 && !el.style.getPropertyValue("--d")) el.style.setProperty("--d", Math.min(i * 0.08, 0.4) + "s");
    };
    els.forEach(stagger);

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });

    // Red de seguridad: a los 6 s se muestra todo lo que ya esté en pantalla
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
  }

  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    var format = function (n, decimals) {
      return n.toLocaleString("es-AR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    };
    var run = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var start = performance.now();
      var duration = 1600;
      var tick = function (now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 4);
        el.textContent = format(target * eased, decimals);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = format(target, decimals);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.01 });
    els.forEach(function (el) { io.observe(el); });
  }

  function initTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;
    var select = function (tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) {
          panel.hidden = !on;
          panel.classList.toggle("is-active", on);
        }
      });
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (next) { e.preventDefault(); select(next); next.focus(); }
      });
    });
  }

  function initTilt() {
    if (window.matchMedia("(hover: none)").matches) return;
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
        card.style.transform = "perspective(800px) rotateX(" + ((0.5 - y) * 7).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 7).toFixed(2) + "deg)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  function boot() {
    document.documentElement.classList.add("js-ready");
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initReveals, "initReveals");
    safe(initCounters, "initCounters");
    safe(initTabs, "initTabs");
    safe(initTilt, "initTilt");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
