const revealItems = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelector("#year").textContent = new Date().getFullYear();

const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = [...form.querySelectorAll("[required]")];
  const firstInvalid = fields.find((field) => !field.checkValidity());

  fields.forEach((field) => {
    field.setAttribute("aria-invalid", String(!field.checkValidity()));
  });

  if (firstInvalid) {
    status.textContent = "Please complete the required fields before continuing.";
    firstInvalid.focus();
    return;
  }

  status.textContent =
    "Thank you. Form delivery will be connected when the site is published.";
});

form.addEventListener("input", (event) => {
  if (event.target.matches("input, textarea")) {
    event.target.removeAttribute("aria-invalid");
    status.textContent = "";
  }
});
