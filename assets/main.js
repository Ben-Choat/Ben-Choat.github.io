window.addEventListener("DOMContentLoaded", () => {
  // Detect whether running locally or on GitHub Pages
  const rootPath = window.location.origin.includes("github.io") ? "" : "..";

  // Load navbar
  loadComponent("navbar", `${rootPath}/components/navbar.html`).then(() => {
    // --- Reinitialize Bootstrap dropdowns ---
    if (typeof bootstrap !== "undefined") {
      document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
        new bootstrap.Dropdown(toggle, { autoClose: true });
      });

      // --- Reinitialize mobile collapse (hamburger) menu ---
      document.querySelectorAll(".navbar-toggler").forEach(toggler => {
        toggler.addEventListener("click", () => {
          const targetId = toggler.getAttribute("data-bs-target");
          const collapseEl = document.querySelector(targetId);
          if (collapseEl) {
            new bootstrap.Collapse(collapseEl, { toggle: true });
          }
        });
      });
    }

    // --- Ensure dropdown links remain clickable ---
    document.querySelectorAll(".dropdown-menu a").forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("/")) {
          e.preventDefault(); // prevent Bootstrap from blocking navigation
          window.location.href = href; // manually navigate
        }
      });
    });

    // --- Highlight active link ---
    const currentPath = window.location.pathname
      .replace(/index\.html$/, "")
      .replace(/\/$/, "");
    document.querySelectorAll("nav a").forEach(link => {
      const linkPath = new URL(link.href).pathname
        .replace(/index\.html$/, "")
        .replace(/\/$/, "");
      if (currentPath === linkPath) {
        link.classList.add("active");
      }
    });
  });

  // Load footer
  loadComponent("footer", `${rootPath}/components/footer.html`);
});


// --- Helper: dynamically load components from /components/ folder ---
async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (!element) return;
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Failed to fetch ${file}`);
    const html = await response.text();
    element.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}
