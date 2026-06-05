const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    });
  });
}

function scrollToCurrentHash() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  scrollToTarget(target);
}

function scrollToTarget(target) {
  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    const hash = href.startsWith("/#") ? href.slice(1) : href;
    const target = document.querySelector(hash);
    if (!target || window.location.pathname !== "/") return;

    event.preventDefault();
    window.history.pushState(null, "", hash);
    scrollToTarget(target);
  });
});

window.addEventListener("hashchange", scrollToCurrentHash);
window.addEventListener("load", () => {
  [100, 700, 1400].forEach((delay) => window.setTimeout(scrollToCurrentHash, delay));
});

document.querySelectorAll(".uagb-faq-item").forEach((item) => {
  const button = item.querySelector(".uagb-faq-questions-button");
  const content = item.querySelector(".uagb-faq-content");
  if (!button || !content) return;

  button.setAttribute("role", "button");
  button.setAttribute("tabindex", "0");
  button.setAttribute("aria-expanded", "false");
  content.hidden = true;

  const toggle = () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    content.hidden = isOpen;
    item.classList.toggle("is-open", !isOpen);
  };

  button.addEventListener("click", toggle);
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  });
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", () => {
    const submit = form.querySelector("button[type='submit'], input[type='submit']");
    if (!submit) return;
    if (submit.tagName === "BUTTON") submit.textContent = submit.dataset.altText || "Sending...";
    submit.setAttribute("disabled", "disabled");
  });
});
