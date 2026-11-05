// BrightWorld navigation, product modal and contact form interactions
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const headerRow = document.querySelector(".header > .row");

  // Add an accessible mobile menu toggle without changing every HTML page.
  if (navbar && headerRow && !document.querySelector(".menu-toggle")) {
    const toggle = document.createElement("button");
    toggle.className = "menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Toggle navigation");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "&#9776;";
    headerRow.appendChild(toggle);
    toggle.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.innerHTML = isOpen ? "&times;" : "&#9776;";
    });
    navbar.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      navbar.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = "&#9776;";
    }));
  }

  // Modal support (some pages use data-target cards).
  const targets = document.querySelectorAll("[data-target]");
  if (targets.length) {
    let overlay = document.querySelector(".modal-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      document.body.appendChild(overlay);
    }
    const closeModals = () => {
      document.querySelectorAll(".modal.active").forEach(modal => modal.classList.remove("active"));
      overlay.classList.remove("active");
    };
    targets.forEach(item => item.addEventListener("click", event => {
      // Keep normal brand/external links working.
      if (event.target.closest("a")) return;
      const selector = item.getAttribute("data-target");
      const modal = selector ? document.querySelector(selector) : null;
      if (!modal) return;
      modal.classList.add("active");
      overlay.classList.add("active");
    }));
    overlay.addEventListener("click", closeModals);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeModals();
    });
  }
});

function validate() {
  const name = document.getElementById("name")?.value.trim() || "";
  const phone = document.getElementById("phone")?.value.trim() || "";
  const email = document.getElementById("email")?.value.trim() || "";
  const feedback = document.getElementById("feedback")?.value.trim() || "";
  if (!name || !phone || !email || !feedback) {
    alert("Please complete all fields before submitting.");
    return false;
  }
  const emailValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  if (!emailValid) {
    alert("Please enter a valid email address.");
    return false;
  }
  alert("Form submitted successfully! Thank you for contacting us.");
  return true;
}
