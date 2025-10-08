window.addEventListener("DOMContentLoaded", () => {
  // Try relative component paths first so this works when the site is served under
  // a subpath or previewed from file://. If that fails, fall back to absolute root path.
  loadHTML("navbar", "/components/navbar.html", highlightActiveLink);
  loadHTML("footer", "/components/footer.html");
});

function loadHTML(id, file, callback) {
  // Try the provided path, and if it 404s, try with a leading slash.
  fetch(file)
    .then(res => {
      if (!res.ok) {
        // try fallback to root path
        return fetch('/' + file.replace(/^\/+/, ''));
      }
      return res;
    })
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
      if (callback) callback();
    })
    .catch(err => console.error(`Error loading ${file}:`, err));
}

function highlightActiveLink() {
  // Normalize pathnames so that "/" and "/index.html" match the Home link.
  const normalize = (p) => {
    if (!p) return '/';
    // remove trailing slash except for root
    if (p !== '/' && p.endsWith('/')) p = p.replace(/\/+$/, '');
    // treat root as /index.html for comparison
    if (p === '/') return '/index.html';
    return p;
  };

  const currentPath = normalize(window.location.pathname);

  document.querySelectorAll("nav a").forEach(link => {
    const rawHref = link.getAttribute('href') || '';
    // skip anchor-only links ("#..."), empty hrefs, or javascript: handlers
    if (rawHref.startsWith('#') || rawHref.trim() === '' || rawHref.trim().toLowerCase().startsWith('javascript:')) {
      return;
    }

    const linkPathRaw = new URL(link.href, location.origin).pathname;
    const linkPath = normalize(linkPathRaw);

    // mark active if current path equals or starts with link path
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

