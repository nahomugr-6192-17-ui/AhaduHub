/**
 * projects.js
 * Infinite Centered Slider with Touch/Mouse Swiping
 */
(function initProjectsSlider() {
  const swiperWindow = document.getElementById("swiper");
  const projectSlides = document.querySelectorAll(".project-card");
  const prevBtn = document.querySelector(".prev-project-btn");
  const nextBtn = document.querySelector(".next-project-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (!swiperWindow || projectSlides.length === 0) return;

  let currentIndex = 0;

  // --- Core Function: Update Classes and Center the Card ---
  function updateSlider() {
    // 1. Remove active state from all cards
    projectSlides.forEach((card) => card.classList.remove("display"));

    // 2. Add active state to the current target
    projectSlides[currentIndex].classList.add("display");

    // 3. Calculate exact center position for the active card
    const card = projectSlides[currentIndex];

    // Math: Card's left edge - Half of the window width + Half of the card width
    const centerPosition =
      card.offsetLeft - swiperWindow.clientWidth / 2 + card.clientWidth / 2;

    // 4. Smoothly scroll the container to that exact spot
    swiperWindow.scrollTo({
      left: centerPosition,
      behavior: "smooth",
    });
  }

  // --- Button Controls (With Infinite Wrap-Around) ---
  function goNext() {
    // The modulo operator (%) forces it to wrap back to 0 when it reaches the end
    currentIndex = (currentIndex + 1) % projectSlides.length;
    updateSlider();
  }

  function goPrev() {
    // Adding the length before modulo prevents negative numbers, wrapping 0 to the end
    currentIndex =
      (currentIndex - 1 + projectSlides.length) % projectSlides.length;
    updateSlider();
  }

  if (nextBtn) nextBtn.addEventListener("click", goNext);
  if (prevBtn) prevBtn.addEventListener("click", goPrev);

  // --- Mouse Drag & Touch Swipe Controls ---
  let startX = 0;
  let isDragging = false;

  // 1. Touch Events (Mobile)
  swiperWindow.addEventListener(
    "touchstart",
    (e) => {
      startX = e.changedTouches[0].screenX;
      isDragging = true;
    },
    { passive: true },
  );

  swiperWindow.addEventListener(
    "touchend",
    (e) => {
      if (!isDragging) return;
      isDragging = false;
      handleSwipe(startX, e.changedTouches[0].screenX);
    },
    { passive: true },
  );

  // 2. Mouse Events (Desktop)
  swiperWindow.addEventListener("mousedown", (e) => {
    startX = e.pageX;
    isDragging = true;
    swiperWindow.style.cursor = "grabbing"; // Visual feedback
  });

  swiperWindow.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    swiperWindow.style.cursor = "default";
    handleSwipe(startX, e.pageX);
  });

  // Cancel swipe if cursor leaves the slider area
  swiperWindow.addEventListener("mouseleave", () => {
    isDragging = false;
    swiperWindow.style.cursor = "default";
  });

  // 3. Touchpad / Horizontal Mouse Wheel Swiping
  let wheelCooldown = false;

  swiperWindow.addEventListener(
    "wheel",
    (e) => {
      // Only react if the swipe is mostly horizontal (ignores vertical scrolling)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault(); // Prevents the Mac "Swipe to go back a page" browser gesture

        if (wheelCooldown) return; // Ignores extra momentum events from the touchpad

        const wheelThreshold = 50; // Sensitivity (lower = more sensitive)

        if (e.deltaX > wheelThreshold) {
          goNext();
          triggerCooldown();
        } else if (e.deltaX < -wheelThreshold) {
          goPrev();
          triggerCooldown();
        }
      }
    },
    { passive: false },
  ); // Must be false to allow e.preventDefault()

  // Temporarily locks the wheel listener so one swipe = one card
  function triggerCooldown() {
    wheelCooldown = true;
    setTimeout(() => {
      wheelCooldown = false;
    }, 500); // 800ms lock. Adjust this if it feels too fast or too slow!
  }

  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = Array.from(projectCards).indexOf(card);
      if (index !== -1) {
        currentIndex = index;
        updateSlider();
      }
    });
  });

  // 3. Swipe Math
  function handleSwipe(start, end) {
    const swipeThreshold = 50; // Must drag at least 50px to trigger change
    const dragDistance = start - end;

    if (dragDistance > swipeThreshold) {
      goNext(); // Dragged left -> show next
    } else if (dragDistance < -swipeThreshold) {
      goPrev(); // Dragged right -> show prev
    } else {
      // Didn't drag far enough, snap back to current center
      updateSlider();
    }
  }

  function centerCurrentCard() {
    const card = projectSlides[currentIndex];
    const centerPosition =
      card.offsetLeft - swiperWindow.clientWidth / 2 + card.clientWidth / 2;

    swiperWindow.scrollTo({
      left: centerPosition,
      behavior: "smooth",
    });
  }

  // --- Initialization ---
  // Wait a tiny fraction of a second to ensure CSS widths have loaded before centering
  setTimeout(updateSlider, 50);
})();

document.addEventListener("DOMContentLoaded", () => {
  // Select all the project cards
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Step 1: Remove the active '.display' class from all cards
      projectCards.forEach((c) => c.classList.remove("display"));

      // Step 2: Add the '.display' class to the card that was just clicked
      // This immediately triggers your CSS border and scaling transitions
      this.classList.add("display");

      // Step 3: Smoothly scroll the container so this card is dead center
      this.scrollIntoView({
        behavior: "smooth", // Uses smooth scrolling
        inline: "center", // Centers it horizontally inside the swiper
        block: "nearest", // Prevents the page from jumping vertically
      });

    card.addEventListener("click", function(event){
      event.preventDefault();
      const link = this.getAttribute("data-link");
      if (link) {
        window.open(link, "_blank");
      }
    });
  });
});
});