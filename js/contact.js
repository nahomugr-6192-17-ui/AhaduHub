/* ============================================================
   AhaduHub — Contact Form Logic
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector(".ahadu-contact-form");
  const submitBtn = document.querySelector(".submit-audit-btn");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      // Prevent the default page reload
      e.preventDefault();

      // Gather the form data (ready to be sent to a backend like Node.js or a service like EmailJS)
      const formData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        organization: document.getElementById("organization").value,
        projectType: document.getElementById("projectType").value,
        message: document.getElementById("message").value,
      };

      // 1. UI Feedback: Change button to a loading state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.style.pointerEvents = "none"; // Prevent double-clicking
      submitBtn.style.opacity = "0.8";

      // 2. Simulate a network request (Replace this setTimeout with your actual fetch/API call later)
      setTimeout(() => {
        
        // 3. Success State: Update button visually
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
        submitBtn.style.backgroundColor = "#10b981"; // Emerald green for success
        submitBtn.style.borderColor = "#10b981";
        submitBtn.style.opacity = "1";

        // 4. Reset the form inputs
        contactForm.reset();

        // 5. Revert the button back to its original state after 3.5 seconds
        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.backgroundColor = ""; // Clears inline style to revert to CSS file
          submitBtn.style.borderColor = "";
          submitBtn.style.pointerEvents = "auto";
        }, 3500);

      }, 1500); // Simulated 1.5-second processing delay
    });
  }
});