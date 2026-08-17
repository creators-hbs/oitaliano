(function () {
  const site = {
    whatsappNumber: "5511992938108",
    whatsappMessage: "Ola! Gostaria de conversar sobre consultoria imobiliaria e financeira com a O Italiano.",
    financialSimulationUrl: "",
  };

  const header = document.querySelector("[data-site-header]");
  const nav = document.querySelector("[data-nav-links]");
  const toggle = document.querySelector("[data-menu-toggle]");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  }

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    header?.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      header?.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    const customMessage = link.getAttribute("data-message") || site.whatsappMessage;
    link.setAttribute("href", `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(customMessage)}`);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });

  document.querySelectorAll("[data-simulation-link]").forEach((link) => {
    if (site.financialSimulationUrl) {
      link.setAttribute("href", site.financialSimulationUrl);
      link.removeAttribute("aria-disabled");
    } else {
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", "URL da simulacao financeira pendente de configuracao");
      link.addEventListener("click", (event) => event.preventDefault());
    }
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    reveals.forEach((node) => observer.observe(node));
  } else {
    reveals.forEach((node) => node.classList.add("is-visible"));
  }

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const status = form.querySelector("[data-form-status]");
    const fields = Array.from(form.querySelectorAll("input, textarea, select"));

    function setError(field, message) {
      const error = form.querySelector(`[data-error-for="${field.id}"]`);
      if (error) error.textContent = message || "";
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validateField(field) {
      let message = "";
      const value = field.value.trim();

      if (field.required && !value) {
        message = "Preencha este campo.";
      } else if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        message = "Informe um e-mail valido.";
      } else if (field.type === "tel" && value && value.replace(/\D/g, "").length < 10) {
        message = "Informe um telefone com DDD.";
      }

      setError(field, message);
      return !message;
    }

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const valid = fields.map(validateField).every(Boolean);

      if (!valid) {
        if (status) status.textContent = "Revise os campos destacados antes de continuar.";
        const firstInvalid = fields.find((field) => field.getAttribute("aria-invalid") === "true");
        firstInvalid?.focus();
        return;
      }

      const data = new FormData(form);
      const message = [
        "Ola! Gostaria de conversar com a O Italiano.",
        `Nome: ${data.get("nome")}`,
        `Telefone: ${data.get("telefone")}`,
        `E-mail: ${data.get("email")}`,
        `Assunto: ${data.get("assunto")}`,
        `Mensagem: ${data.get("mensagem")}`,
      ].join("\n");

      if (status) status.textContent = "Dados validados. Abrindo o WhatsApp para envio seguro da mensagem.";
      setTimeout(() => {
        window.open(`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
      }, 350);
    });
  }

  const blogSearch = document.querySelector("#busca-blog");
  const postCards = Array.from(document.querySelectorAll("[data-post-card]"));
  if (blogSearch && postCards.length) {
    blogSearch.addEventListener("input", () => {
      const term = blogSearch.value.trim().toLowerCase();
      postCards.forEach((card) => {
        const match = card.textContent.toLowerCase().includes(term);
        card.style.display = match ? "" : "none";
      });
    });
  }
})();
