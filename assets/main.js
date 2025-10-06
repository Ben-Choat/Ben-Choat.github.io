window.addEventListener("DOMContentLoaded", () => {
  loadHTML("navbar", "/components/navbar.html", highlightActiveLink);
  loadHTML("footer", "/components/footer.html");
});

function loadHTML(id, file, callback) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
      if (callback) callback();
    })
    .catch(err => console.error(`Error loading ${file}:`, err));
}

function highlightActiveLink() {
  const currentPath = window.location.pathname; // e.g., /cv/ or /HydroML2024/
  
  document.querySelectorAll("nav a").forEach(link => {
    const linkPath = new URL(link.href, location.origin).pathname;

    // mark active if current path starts with link path
    if (currentPath === linkPath || currentPath.startsWith(linkPath)) {
      link.classList.add("active");

      // also mark parent dropdown toggle if inside dropdown
      const parentDropdown = link.closest(".dropdown");
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector(".nav-link.dropdown-toggle");
        if (toggle) toggle.classList.add("active");
      }
    }
  });
}

