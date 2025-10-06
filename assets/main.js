window.addEventListener("DOMContentLoaded", () => {
  loadComponent("navbar", "/components/navbar.html").then(() => {
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add("active");
      }
    });
  });
  loadComponent("footer", "/components/footer.html");
});

async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (element) {
    try {
      // Always resolve from the site root
      const base = window.location.origin;
      const response = await fetch(`${base}${file}`);
      if (!response.ok) throw new Error(`Failed to fetch ${file}`);
      const html = await response.text();
      element.innerHTML = html;
    } catch (err) {
      console.error(err);
    }
  }
}

