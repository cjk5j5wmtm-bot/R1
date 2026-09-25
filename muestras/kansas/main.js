(function () {
  /* Kansas Grill & Bar — concepto de diseño por R1. Patrón IIFE, GSAP local en lib/. */
  "use strict";

  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  var hasSplit = hasGSAP && typeof window.SplitText !== "undefined";
  if (hasST) gsap.registerPlugin(ScrollTrigger);
  if (hasSplit) gsap.registerPlugin(SplitText);

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  function initSplash() {
    var splash = document.querySelector("[data-splash]");
    if (!splash) return;
    var done = false;
    var hide = function () {
      if (done) return;
      done = true;
      splash.classList.add("is-out");
      document.dispatchEvent(new Event("splash:out"));
    };
    if (document.readyState === "complete") setTimeout(hide, 900);
    else window.addEventListener("load", function () { setTimeout(hide, 700); });
    setTimeout(hide, 4000);
  }

  function initNav() {
    var nav = document.querySelector("[data-nav]");
    var burger = document.querySelector("[data-burger]");
    var menu = document.getElementById("navMenu");
    if (!nav || !burger || !menu) return;
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 20); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    var setOpen = function (open) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      menu.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () { setOpen(burger.getAttribute("aria-expanded") !== "true"); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  function initHeroTitle() {
    var title = document.querySelector("[data-split-lines]");
    if (!title || !hasGSAP) return;
    var lines = title.querySelectorAll(".line");
    lines.forEach(function (l) {
      if (l.querySelector(".line-in")) return;
      var inner = document.createElement("span");
      inner.className = "line-in";
      while (l.firstChild) inner.appendChild(l.firstChild);
      l.appendChild(inner);
      l.style.overflow = "hidden";
      l.style.paddingBottom = "0.06em";
      inner.style.display = "inline-block";
    });
    var inners = title.querySelectorAll(".line-in");
    gsap.set(inners, { yPercent: 110 });
    var play = function () {
      gsap.to(inners, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.12 });
      gsap.from(".hero-eyebrow, .hero-foot, .hero-bar", { opacity: 0, y: 24, duration: 1.2, ease: "expo.out", delay: 0.45, stagger: 0.1 });
    };
    document.addEventListener("splash:out", play, { once: true });
    // Seguridad: si el evento no llega, el título aparece igual
    setTimeout(function () { gsap.set(inners, { yPercent: 0 }); }, 5000);
  }

  function initParallax() {
    if (!hasST) return;
    var media = document.querySelector("[data-parallax]");
    if (media) {
      gsap.to(media, { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }
    document.querySelectorAll(".bar-media img, .visit-media img").forEach(function (img) {
      gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }

  function initClipReveal() {
    if (!hasST) return;
    document.querySelectorAll("[data-clip]").forEach(function (el) {
      gsap.fromTo(el, { clipPath: "inset(12% 12% 12% 12%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: el, start: "top 85%", end: "top 25%", scrub: true }
      });
    });
  }

  function initWords() {
    var el = document.querySelector("[data-words]");
    if (!el || el.querySelector(".w")) return;
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    var spans = el.querySelectorAll(".w");
    if (!hasST) { spans.forEach(function (s) { s.classList.add("on"); }); return; }
    ScrollTrigger.create({
      trigger: el, start: "top 80%", end: "bottom 45%", scrub: true,
      onUpdate: function (self) {
        var n = Math.round(self.progress * spans.length);
        spans.forEach(function (s, i) { s.classList.toggle("on", i < n); });
      }
    });
  }

  function initSignature() {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-sig-list] .sig-item"));
    var img = document.querySelector("[data-sig-img]");
    var caption = document.querySelector("[data-sig-caption]");
    if (!items.length || !img) return;
    var current = 0;
    var activate = function (i) {
      if (i === current) return;
      current = i;
      items.forEach(function (it, j) { it.classList.toggle("is-active", j === i); });
      var src = items[i].getAttribute("data-img");
      var name = items[i].querySelector("h3").textContent;
      var num = items[i].querySelector(".sig-num").textContent;
      img.classList.add("is-swapping");
      setTimeout(function () {
        img.src = src;
        if (caption) caption.textContent = num + " — " + name;
        img.classList.remove("is-swapping");
      }, 280);
    };
    items.forEach(function (it, i) {
      it.addEventListener("mouseover", function () { activate(i); });
      if (hasST && window.matchMedia("(min-width: 1000px)").matches) {
        ScrollTrigger.create({ trigger: it, start: "top 55%", end: "bottom 55%", onEnter: function () { activate(i); }, onEnterBack: function () { activate(i); } });
      }
    });
  }

  function initReveals() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.01, rootMargin: "0px 0px -4% 0px" });
    els.forEach(function (el, i) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", Math.min(sib * 0.08, 0.32) + "s");
      io.observe(el);
    });
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
  }

  function initCounters() {
    if (!("IntersectionObserver" in window)) return;
    var fmt = function (n, d) { return n.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d }); };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, to = parseFloat(el.getAttribute("data-count")), d = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var t0 = performance.now();
        (function tick(now) {
          var p = Math.min((now - t0) / 1800, 1);
          el.textContent = fmt(to * (1 - Math.pow(1 - p, 4)), d);
          if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(to, d);
        })(t0);
      });
    }, { threshold: 0.01 });
    document.querySelectorAll("[data-count]").forEach(function (el) { io.observe(el); });
  }

  function initTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
    var select = function (tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute("aria-controls"));
        if (p) { p.hidden = !on; p.classList.toggle("is-active", on); }
      });
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var n = e.key === "ArrowRight" ? tabs[(i + 1) % tabs.length] : e.key === "ArrowLeft" ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
        if (n) { e.preventDefault(); select(n); n.focus(); }
      });
    });
  }

  function initQuotes() {
    var quotes = document.querySelectorAll("[data-quotes] .quote");
    var dots = document.querySelectorAll("[data-quote-nav] button");
    if (!quotes.length) return;
    var i = 0, timer;
    var show = function (n) {
      i = n;
      quotes.forEach(function (q, j) { q.classList.toggle("is-active", j === n); });
      dots.forEach(function (d, j) { d.setAttribute("aria-selected", String(j === n)); });
    };
    var start = function () { clearInterval(timer); timer = setInterval(function () { show((i + 1) % quotes.length); }, 5000); };
    dots.forEach(function (d, j) { d.addEventListener("click", function () { show(j); start(); }); });
    start();
  }

  function initMagnetic() {
    if (window.matchMedia("(hover: none)").matches) return;
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  function boot() {
    document.documentElement.classList.add("js-ready");
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initHeroTitle, "initHeroTitle");
    safe(initParallax, "initParallax");
    safe(initClipReveal, "initClipReveal");
    safe(initWords, "initWords");
    safe(initSignature, "initSignature");
    safe(initReveals, "initReveals");
    safe(initCounters, "initCounters");
    safe(initTabs, "initTabs");
    safe(initQuotes, "initQuotes");
    safe(initMagnetic, "initMagnetic");
    if (hasST) window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
