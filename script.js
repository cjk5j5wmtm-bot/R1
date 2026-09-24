// ===== Tema claro / oscuro =====
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function getStoredTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* almacenamiento no disponible */
  }
}

const initialTheme =
  getStoredTheme() ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
root.setAttribute("data-theme", initialTheme);

themeToggle.addEventListener("click", () => {
  applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// ===== Menú móvil =====
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

function setMenu(open) {
  navMenu.classList.toggle("open", open);
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}

navToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

// ===== Header con sombra y enlace activo =====
const header = document.getElementById("header");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 10);

  let current = sections[0].id;
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Aparición al hacer scroll y contadores =====
function animateCount(el) {
  const target = Number(el.dataset.count);
  const duration = 1500;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.dataset.count) animateCount(el);
        else el.classList.add("visible");
        observer.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal, [data-count]").forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = el.dataset.count));
}

// ===== Carrusel de testimonios =====
const testimonials = document.querySelectorAll(".testimonial");
const dotsContainer = document.querySelector(".dots");
let currentTestimonial = 0;
let testimonialTimer;

testimonials.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("role", "tab");
  dot.setAttribute("aria-label", `Testimonio ${i + 1}`);
  dot.addEventListener("click", () => {
    showTestimonial(i);
    restartTimer();
  });
  dotsContainer.appendChild(dot);
});

function showTestimonial(index) {
  currentTestimonial = index;
  testimonials.forEach((t, i) => t.classList.toggle("active", i === index));
  dotsContainer.querySelectorAll("button").forEach((d, i) => {
    d.setAttribute("aria-selected", String(i === index));
  });
}

function restartTimer() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => {
    showTestimonial((currentTestimonial + 1) % testimonials.length);
  }, 6000);
}

showTestimonial(0);
restartTimer();

// ===== Formulario de contacto =====
const form = document.getElementById("contactForm");
const success = document.getElementById("formSuccess");

function validateField(input) {
  const field = input.closest(".field");
  const error = field.querySelector(".error");
  let message = "";

  if (!input.value.trim()) {
    message = "Este campo es obligatorio.";
  } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
    message = "Introduce un correo electrónico válido.";
  }

  field.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
  return !message;
}

form.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("input", () => validateField(input));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputs = [...form.querySelectorAll("input, textarea")];
  const valid = inputs.map(validateField).every(Boolean);

  if (!valid) {
    success.hidden = true;
    return;
  }

  // Aquí puedes conectar el formulario a un servicio real (por ejemplo, Formspree o tu backend).
  form.reset();
  success.hidden = false;
  setTimeout(() => (success.hidden = true), 5000);
});

// ===== Año actual en el pie de página =====
document.getElementById("year").textContent = new Date().getFullYear();
