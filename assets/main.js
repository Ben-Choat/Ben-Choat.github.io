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
  document.querySelectorAll("nav a").forEach(link => {
    if (link.href === location.href) link.classList.add("active");
  });
}
