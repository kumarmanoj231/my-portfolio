"use strict";


/* =========================================================
   ELEMENTS
========================================================= */

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-links");

const filters = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");

const contactForm = document.getElementById("contactForm");
const contactSubmit = document.getElementById("contactSubmit");
const formStatus = document.getElementById("formStatus");


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function closeMenu() {
  if (!navMenu || !menuToggle) {
    return;
  }

  navMenu.classList.remove("open");

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  menuToggle.setAttribute(
    "aria-label",
    "Open navigation"
  );
}


function toggleMenu() {
  if (!navMenu || !menuToggle) {
    return;
  }

  const isOpen = navMenu.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  menuToggle.setAttribute(
    "aria-label",
    isOpen
      ? "Close navigation"
      : "Open navigation"
  );
}


if (menuToggle) {
  menuToggle.addEventListener(
    "click",
    toggleMenu
  );
}


/* Close menu after navigation */

navLinks.forEach(link => {

  link.addEventListener(
    "click",
    closeMenu
  );

});


/* Close menu when clicking outside */

document.addEventListener(
  "click",
  event => {

    if (
      navMenu &&
      navMenu.classList.contains("open") &&
      !event.target.closest(".site-header")
    ) {
      closeMenu();
    }

  }
);


/* Close menu with Escape */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {
      closeMenu();
    }

  }
);


/* Close menu when resizing to desktop */

window.addEventListener(
  "resize",
  () => {

    if (window.innerWidth > 900) {
      closeMenu();
    }

  },
  { passive: true }
);


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function setActiveSection(id) {

  navLinks.forEach(link => {

    const isActive =
      link.getAttribute("href") === `#${id}`;

    link.classList.toggle(
      "active",
      isActive
    );

  });

}


/*
  IntersectionObserver is more efficient than
  listening to scroll on every frame.
*/

if (
  "IntersectionObserver" in window &&
  sections.length
) {

  const sectionObserver =
    new IntersectionObserver(
      entries => {

        const visibleSections =
          entries
            .filter(entry => entry.isIntersecting)
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio
            );

        if (visibleSections.length) {

          setActiveSection(
            visibleSections[0].target.id
          );

        }

      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0.01, 0.1, 0.25]
      }
    );


  sections.forEach(section => {
    sectionObserver.observe(section);
  });

}


/* =========================================================
   PROJECT FILTER
========================================================= */

function filterProjects(category) {

  projectCards.forEach(card => {

    const cardCategory =
      card.dataset.category;

    const shouldShow =
      category === "all" ||
      cardCategory === category;

    card.classList.toggle(
      "hidden",
      !shouldShow
    );

  });

}


filters.forEach(filter => {

  filter.addEventListener(
    "click",
    () => {

      const selected =
        filter.dataset.filter;

      filters.forEach(button => {

        const isSelected =
          button === filter;

        button.classList.toggle(
          "active",
          isSelected
        );

        button.setAttribute(
          "aria-selected",
          String(isSelected)
        );

      });

      filterProjects(selected);

    }
  );

});


/* =========================================================
   CONTACT FORM — WEB3FORMS
========================================================= */

if (contactForm) {

  contactForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      /* Native browser validation */

      if (!contactForm.checkValidity()) {

        contactForm.reportValidity();

        return;
      }


      /* Honeypot */

      const honeypot =
        contactForm.elements.botcheck;

      if (
        honeypot &&
        honeypot.checked
      ) {
        return;
      }


      /* Loading state */

      if (contactSubmit) {

        contactSubmit.disabled = true;

        contactSubmit.innerHTML =
          `
            Sending
            <span aria-hidden="true">...</span>
          `;

      }


      if (formStatus) {

        formStatus.textContent =
          "Sending your message...";

        formStatus.className =
          "form-status";

      }


      try {

        const formData =
          new FormData(contactForm);


        const response =
          await fetch(
            "https://api.web3forms.com/submit",
            {
              method: "POST",

              headers: {
                Accept:
                  "application/json"
              },

              body: formData
            }
          );


        const result =
          await response.json();


        if (
          response.ok &&
          result.success
        ) {

          if (formStatus) {

            formStatus.textContent =
              "Message sent successfully! I'll get back to you soon.";

            formStatus.className =
              "form-status success";

          }

          contactForm.reset();

        } else {

          throw new Error(
            result.message ||
            "Unable to send your message."
          );

        }

      } catch (error) {

        console.error(
          "Web3Forms error:",
          error
        );


        if (formStatus) {

          formStatus.textContent =
            error.message ||
            "Something went wrong. Please try again.";

          formStatus.className =
            "form-status error";

        }

      } finally {

        if (contactSubmit) {

          contactSubmit.disabled = false;

          contactSubmit.innerHTML =
            `
              Send Message
              <span aria-hidden="true">→</span>
            `;

        }

      }

    }
  );

}


/* =========================================================
   IMAGE FALLBACK
========================================================= */

document
  .querySelectorAll("img")
  .forEach(image => {

    image.addEventListener(
      "error",
      () => {

        image.classList.add(
          "image-error"
        );

      },
      { once: true }
    );

  });


/* =========================================================
   INITIAL STATE
========================================================= */

setActiveSection("home");