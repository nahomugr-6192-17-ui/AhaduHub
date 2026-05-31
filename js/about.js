let currentIndex = 0;
const textSlides = document.querySelectorAll('.text-item');
const imageSlides = document.querySelectorAll('.image-group');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // 1. Clear current classes
    textSlides.forEach(s => s.classList.remove('active'));
    imageSlides.forEach(img => img.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    // 2. Set new index
    if (index >= textSlides.length) currentIndex = 0;
    else if (index < 0) currentIndex = textSlides.length - 1;
    else currentIndex = index;

    // 3. Activate new slide
    textSlides[currentIndex].classList.add('active');
    imageSlides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
}

// Manual control from dots
function jumpToSlide(n) {
    clearInterval(slideTimer);
    showSlide(n);
    startTimer();
}

// Auto-play logic
let slideTimer;
function startTimer() {
    slideTimer = setInterval(() => {
        showSlide(currentIndex + 1);
    }, 18000);
}

// Init
startTimer();


