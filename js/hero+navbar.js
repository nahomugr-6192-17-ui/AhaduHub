/**
 * AhaduHub — Navbar JavaScript
 * Handles: scroll state, mobile menu toggle, active link tracking
 */

(function () {
  "use strict";

  /* ── Element references ──────────────────────────────────────── */
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  /* ── Scroll threshold (px before navbar "floats") ───────────── */
  const SCROLL_THRESHOLD = 60;

  /* ──────────────────────────────────────────────────────────────
     1. SCROLL — shrink navbar into floating pill
  ─────────────────────────────────────────────────────────────── */
  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }

  function updateScrollState() {
    if (lastScrollY > SCROLL_THRESHOLD) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    ticking = false;
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Apply immediately in case page is loaded mid-scroll
  updateScrollState();

  /* ──────────────────────────────────────────────────────────────
     2. MOBILE MENU — slide-down toggle
  ─────────────────────────────────────────────────────────────── */
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = ""; // allow scroll behind menu
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  function toggleMenu() {
    menuOpen ? closeMenu() : openMenu();
  }

  hamburger.addEventListener("click", toggleMenu);

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  // Close menu on outside click / Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuOpen) closeMenu();
  });

  document.addEventListener("click", function (e) {
    if (menuOpen && !navbar.contains(e.target)) closeMenu();
  });

  /* ──────────────────────────────────────────────────────────────
     3. ACTIVE LINK — Intersection Observer per section
  ─────────────────────────────────────────────────────────────── */
  const sections = document.querySelectorAll(
    "#home, #about, #projects, #team, #packages, #contact",
  );

  if (sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -55% 0px", // activate when section is near centre
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveLink(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  function setActiveLink(sectionId) {
    // Desktop links
    navLinks.forEach(function (link) {
      if (link.dataset.link === sectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Mobile links
    mobileLinks.forEach(function (link) {
      if (link.dataset.mobileLink === sectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Manual click also sets active immediately (before scroll settles)
  function handleLinkClick(links) {
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        const id = this.dataset.link || this.dataset.mobileLink;
        if (id) setActiveLink(id);
      });
    });
  }

  handleLinkClick(navLinks);
  handleLinkClick(mobileLinks);
})();
