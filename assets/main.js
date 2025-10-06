// assets/main.js
(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      await loadAndInitComponent('navbar', 'components/navbar.html');
      await loadAndInitComponent('footer', 'components/footer.html');
    } catch (e) {
      console.error(e);
    }
  });

  async function loadAndInitComponent(id, defaultRelativePath) {
    const el = document.getElementById(id);
    if (!el) return;
    const candidates = buildCandidates(defaultRelativePath);
    const html = await fetchFirst(candidates);
    if (html == null) {
      console.error('Could not load component', id, candidates);
      return;
    }
    el.innerHTML = html;

    if (id === 'navbar') {
      reinitBootstrap();
      wireDropdownLinks();
      applyActiveLink();
    }
  }

  // Build a list of candidate paths to try (absolute root, relative, ../, ../../ etc.)
  function buildCandidates(relativePath) {
    const cand = [];
    // prefer origin+path for http(s) (deployed)
    if (location.protocol.startsWith('http')) {
      cand.push(location.origin + '/' + relativePath.replace(/^\//, ''));
    }
    // absolute root path (works on GH pages)
    cand.push('/' + relativePath.replace(/^\//,''));
    // relative to current doc
    cand.push(relativePath);
    // try parents up to 4 levels
    for (let i = 1; i <= 4; i++) {
      cand.push('../'.repeat(i) + relativePath);
    }
    return [...new Set(cand)]; // dedupe
  }

  // Try each path until one fetches OK
  async function fetchFirst(paths) {
    for (const p of paths) {
      try {
        const res = await fetch(p);
        if (res && res.ok) {
          return await res.text();
        }
      } catch (err) {
        // ignore and try next
      }
    }
    return null;
  }

  // Re-initialize bootstrap widgets for dynamically inserted markup
  function reinitBootstrap() {
    if (typeof bootstrap === 'undefined') return;
    // dropdowns
    document.querySelectorAll('.dropdown-toggle').forEach(el => {
      if (!bootstrap.Dropdown.getInstance(el)) {
        new bootstrap.Dropdown(el, { autoClose: true });
      }
    });
    // collapses (mobile hamburger)
    document.querySelectorAll('.navbar-toggler').forEach(toggler => {
      const target = toggler.getAttribute('data-bs-target') || toggler.getAttribute('data-target');
      if (!target) return;
      const collapseEl = document.querySelector(target);
      if (collapseEl && !bootstrap.Collapse.getInstance(collapseEl)) {
        new bootstrap.Collapse(collapseEl, { toggle: false });
      }
    });
  }

  // Make dropdown-menu links actually navigate (and avoid interfering with toggles)
  function wireDropdownLinks() {
    // Remove old listeners by replacing nodes (safe guard for multiple loads)
    document.querySelectorAll('.dropdown-menu a').forEach(a => {
      const newA = a.cloneNode(true);
      a.parentNode.replaceChild(newA, a);
    });

    document.querySelectorAll('.dropdown-menu a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('javascript:')) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Resolve to an absolute URL where possible
        let dest;
        try {
          dest = new URL(href, window.location.href).href;
        } catch (err) {
          // fallback for odd environments
          if (href.startsWith('/') && location.protocol.startsWith('http')) {
            dest = location.origin + href;
          } else {
            dest = href;
          }
        }

        // If you're testing with file:// locally and href is absolute-root (/...), try a best-effort relative path
        if (location.protocol === 'file:' && href.startsWith('/')) {
          const depth = (location.pathname.match(/\//g) || []).length - 1;
          const rel = '../'.repeat(Math.max(0, depth - 1)) + href.replace(/^\//, '');
          window.location.href = rel;
          return;
        }

        window.location.href = dest;
      });
    });
  }

  // Normalize pathnames so comparisons are stable: "/" | "/cv" | "/map"
  function normalizePath(p) {
    if (!p) p = '/';
    try {
      p = new URL(p, window.location.href).pathname;
    } catch (err) {
      // leave as-is
    }
    p = p.replace(/\/index\.html$/, '/');
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    if (!p.startsWith('/')) p = '/' + p;
    return p;
  }

  // Apply a single "active" marker to the exact matching nav link and mark parent dropdown toggles
  function applyActiveLink() {
    document.querySelectorAll('nav a.active').forEach(a => a.classList.remove('active'));
    const current = normalizePath(window.location.pathname);

    document.querySelectorAll('nav a[href]').forEach(link => {
      const href = link.getAttribute('href');
      const linkPath = normalizePath(href);
      if (linkPath === current) {
        link.classList.add('active');
        const navItem = link.closest('.nav-item');
        if (navItem) navItem.classList.add('active');

        const dropdownAncestor = link.closest('.dropdown-menu');
        if (dropdownAncestor) {
          const parentDropdown = dropdownAncestor.closest('.nav-item.dropdown');
          if (parentDropdown) {
            const toggle = parentDropdown.querySelector('.dropdown-toggle');
            if (toggle) toggle.classList.add('active');
            parentDropdown.classList.add('active');
          }
        }
      }
    });
  }

})();
