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
const submitButton = form.querySelector('button[type="submit"]');
let isSubmitting = false;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isSubmitting) {
    return;
  }

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

  isSubmitting = true;
  submitButton.disabled = true;
  form.setAttribute("aria-busy", "true");
  status.textContent = "Sending your message…";

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Form submission failed with status ${response.status}`);
    }

    form.reset();
    fields.forEach((field) => field.removeAttribute("aria-invalid"));
    status.textContent = "Thank you. Your message has been sent.";
  } catch (error) {
    console.error(error);
    status.textContent =
      "Your message could not be sent. Please try again in a moment.";
  } finally {
    isSubmitting = false;
    submitButton.disabled = false;
    form.removeAttribute("aria-busy");
  }
});

form.addEventListener("input", (event) => {
  if (event.target.matches("input, textarea")) {
    event.target.removeAttribute("aria-invalid");
    if (!isSubmitting) {
      status.textContent = "";
    }
  }
});
