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
  const currentURL = location.href;
  document.querySelectorAll("nav a").forEach(link => {
    const linkURL = new URL(link.href, location.origin).href;

    // Handle / vs /index.html
    if (linkURL === currentURL || linkURL + "index.html" === currentURL || linkURL === currentURL + "index.html") {
      link.classList.add("active");

      // Also highlight parent dropdown toggle if inside a dropdown
      const parentDropdown = link.closest(".dropdown");
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector(".nav-link.dropdown-toggle");
        if (toggle) toggle.classList.add("active");
      }
    }
  });
}
