const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-links");

function setActive(id) {
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
}, { rootMargin: "-30% 0px -55% 0px", threshold: 0.01 });

sections.forEach(section => observer.observe(section));

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

menuToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

const filters = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");

filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(btn => btn.classList.remove("active"));
    filter.classList.add("active");

    const selected = filter.dataset.filter;
    projectCards.forEach(card => {
      const match = selected === "all" || card.dataset.category === selected;
      card.classList.toggle("hidden", !match);
    });
  });
});


const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = document.getElementById("contactSubmit");
    const formStatus = document.getElementById("formStatus");

    submitButton.disabled = true;
    submitButton.innerHTML = "Sending...";

    formStatus.textContent = "Please wait...";
    formStatus.className = "form-status";

    try {
      // Get all form values
      const formData = new FormData(contactForm);

      // Convert FormData to JSON
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: json
        }
      );

      const result = await response.json();

      console.log("Web3Forms response:", result);

      if (response.status === 200 && result.success) {

        formStatus.textContent =
          "Message sent successfully! I'll get back to you soon.";

        formStatus.classList.add("success");

        contactForm.reset();

      } else {

        formStatus.textContent =
          result.message || "Unable to send your message.";

        formStatus.classList.add("error");

        console.error("Web3Forms error:", result);
      }

    } catch (error) {

      console.error("Contact form error:", error);

      formStatus.textContent =
        "Something went wrong. Please try again.";

      formStatus.classList.add("error");

    } finally {

      submitButton.disabled = false;

      submitButton.innerHTML =
        'Send Message <span>→</span>';
    }
  });
}




document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const status = document.querySelector(".form-status");
  status.textContent = "Thanks! Your message is ready to be connected to a backend/email service.";
  event.target.reset();
});

// document.getElementById("resumeLink").addEventListener("click", (event) => {
//   event.preventDefault();
//   alert("Add your resume PDF as assets/Manoj-Kumar-Resume.pdf and update this link in index.html.");
// });

// Close mobile menu when clicking outside.
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
