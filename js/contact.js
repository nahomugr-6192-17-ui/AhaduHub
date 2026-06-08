/* ============================================================
   AhaduHub — Contact Form Logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  emailjs.init({ publicKey: "YOUR_PUBLIC_KEY_HERE" });

  const contactForm = document.querySelector(".ahadu-contact-form");
  const submitBtn = document.querySelector(".submit-audit-btn");

  if (contactForm) {
    // Clear error states as soon as the user starts typing
    const allInputs = contactForm.querySelectorAll(
      ".floating-input, .floating-textarea, .floating-select",
    );
    allInputs.forEach((input) => {
      input.addEventListener("input", function () {
        const group = this.closest(".floating-group");
        if (group.classList.contains("has-error")) {
          group.classList.remove("has-error");
        }
      });
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let formIsValid = true;
      const requiredInputs = contactForm.querySelectorAll("[required]");

      // Check all required fields
      requiredInputs.forEach((input) => {
        const group = input.closest(".floating-group");

        if (!input.value.trim()) {
          group.classList.add("has-error");
          formIsValid = false;
        } else {
          group.classList.remove("has-error");
        }
      });

      // Stop the submission process if any field is empty
      if (!formIsValid) {
        return;
      }

      // --- Original EmailJS Submission Logic Starts Here ---
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.style.pointerEvents = "none";
      submitBtn.style.opacity = "0.8";

      const templateParams = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        organization: document.getElementById("organization").value,
        projectType: document.getElementById("projectType").value,
        message: document.getElementById("message").value,
      };

      const serviceID = "YOUR_SERVICE_ID_HERE";
      const templateID = "YOUR_TEMPLATE_ID_HERE";

      emailjs.send(serviceID, templateID, templateParams).then(
        (response) => {
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
          submitBtn.style.backgroundColor = "#10b981";
          submitBtn.style.borderColor = "#10b981";
          submitBtn.style.opacity = "1";

          contactForm.reset();

          setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.backgroundColor = "";
            submitBtn.style.borderColor = "";
            submitBtn.style.pointerEvents = "auto";
          }, 3500);
        },
        (error) => {
          submitBtn.innerHTML =
            '<i class="fas fa-exclamation-triangle"></i> Failed to send';
          submitBtn.style.backgroundColor = "#ef4444";
          submitBtn.style.borderColor = "#ef4444";
          submitBtn.style.opacity = "1";

          setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.backgroundColor = "";
            submitBtn.style.borderColor = "";
            submitBtn.style.pointerEvents = "auto";
          }, 3500);
        },
      );
    });
  }

  window.addEventListener("load", () => {
    document.getElementById("projectType").selectedIndex = 0;
    contactForm.reset();
  });
});
