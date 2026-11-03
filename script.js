// Mounesh M R — portfolio interactions (plain JavaScript)
(function () {
  // ---- Scroll reveal animations ----
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.setAttribute("data-visible", "true");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.setAttribute("data-visible", "true"); });
  }

  // ---- Navbar: glass background on scroll ----
  var header = document.querySelector("header");
  var menuBtn = document.querySelector('button[aria-label="Open menu"]');
  var panel = header ? header.querySelector("div.lg\\:hidden") : null;
  var menuOpen = false;
  function paintHeader() {
    if (!header) return;
    var solid = window.scrollY > 12 || menuOpen;
    header.classList.toggle("glass", solid);
    header.classList.toggle("border-border", solid);
    header.classList.toggle("border-transparent", !solid);
  }
  window.addEventListener("scroll", paintHeader, { passive: true });
  paintHeader();

  // ---- Mobile menu toggle ----
  if (menuBtn && panel) {
    menuBtn.addEventListener("click", function () {
      menuOpen = !menuOpen;
      panel.classList.toggle("max-h-0", !menuOpen);
      panel.classList.toggle("max-h-[480px]", menuOpen);
      menuBtn.setAttribute("aria-expanded", String(menuOpen));
      menuBtn.setAttribute("aria-label", menuOpen ? "Close menu" : "Open menu");
      paintHeader();
    });
  }

  // ---- Back to top ----
  document.querySelectorAll("footer button").forEach(function (b) {
    b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  });

  // ---- Footer year ----
  document.querySelectorAll("footer p").forEach(function (p) {
    p.innerHTML = p.innerHTML.replace(/©\s*\d{4}/, "© " + new Date().getFullYear());
  });

  // ---- Contact form (opens the visitor's email app) ----
  var CONTACT_EMAIL = "mouneshmr197@gmail.com"; // TODO: replace with your real email
  var form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = {
        name: form.querySelector("#name"),
        email: form.querySelector("#email"),
        message: form.querySelector("#message"),
      };
      var v = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        message: fields.message.value.trim(),
      };
      var errors = {};
      if (!v.name) errors.name = "Please enter your name";
      else if (v.name.length > 100) errors.name = "Name is too long";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Please enter a valid email";
      if (!v.message) errors.message = "Please write a message";
      else if (v.message.length > 1000) errors.message = "Message is too long";

      Object.keys(fields).forEach(function (k) {
        var old = fields[k].parentNode.querySelector(".field-error");
        if (old) old.remove();
        if (errors[k]) {
          var p = document.createElement("p");
          p.className = "field-error mt-1.5 text-xs text-destructive";
          p.textContent = errors[k];
          fields[k].insertAdjacentElement("afterend", p);
        }
      });
      if (Object.keys(errors).length) return;

      var subject = encodeURIComponent("Portfolio message from " + v.name);
      var body = encodeURIComponent(v.message + "\n\n— " + v.name + " (" + v.email + ")");
      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;

      var btnRow = form.querySelector('button[type="submit"]').parentNode;
      if (!btnRow.querySelector(".sent-note")) {
        var note = document.createElement("p");
        note.className = "sent-note inline-flex items-center gap-2 text-sm text-success";
        note.textContent = "✓ Your email app has opened with your message.";
        btnRow.appendChild(note);
      }
      form.reset();
    });
  }
})();
