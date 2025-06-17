const form = document.querySelector("form");
const modal = document.getElementById("success-modal");
const closeModal = document.getElementById("close-modal");
const toggleTheme = document.getElementById("toggle-theme");

const fields = ["name", "email", "position", "message"];

window.addEventListener("DOMContentLoaded", () => {
  // Restore theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  // Restore form data
  fields.forEach(id => {
    const saved = localStorage.getItem(id);
    if (saved) document.getElementById(id).value = saved;
  });

  const savedAvailability = localStorage.getItem("availability");
  if (savedAvailability) {
    document.querySelector(`input[name="availability"][value="${savedAvailability}"]`).checked = true;
  }
});

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Real-time validation and persistence
form.addEventListener("input", (e) => {
  validateForm(false);
  if (fields.includes(e.target.id)) {
    localStorage.setItem(e.target.id, e.target.value);
  }
  if (e.target.name === "availability") {
    localStorage.setItem("availability", e.target.value);
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const isValid = validateForm(true);

  if (isValid) {
    simulateAjaxSubmit().then(() => {
      modal.classList.remove("hidden");
      form.reset();
      clearStorage();
    });
  }
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

function validateForm(showErrors = true) {
  let isValid = true;
  clearErrors();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const position = document.getElementById("position");
  const message = document.getElementById("message");
  const availability = document.querySelector('input[name="availability"]:checked');

  if (!name.value.trim()) {
    if (showErrors) showError("error-name", "Full name is required.");
    isValid = false;
  }

  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailPattern.test(email.value.trim())) {
    if (showErrors) showError("error-email", "Enter a valid email.");
    isValid = false;
  }

  if (!position.value) {
    if (showErrors) showError("error-position", "Please select a position.");
    isValid = false;
  }

  if (!availability) {
    if (showErrors) alert("Please select your availability.");
    isValid = false;
  }

  if (message.value.trim().length < 10) {
    if (showErrors) showError("error-message", "Message must be at least 10 characters.");
    isValid = false;
  }

  return isValid;
}

function showError(id, msg) {
  document.getElementById(id).textContent = msg;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(el => el.textContent = "");
}

function clearStorage() {
  fields.forEach(id => localStorage.removeItem(id));
  localStorage.removeItem("availability");
}

function simulateAjaxSubmit() {
  return new Promise(resolve => setTimeout(resolve, 800));
}