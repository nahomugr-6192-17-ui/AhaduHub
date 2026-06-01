/**
 * Ahadu.js
 * Main Hero Slider with Touch Swipe & Clickable Dots
 */
(function initMainSlider() {
    // 1. Selectors
    const textSlides = document.querySelectorAll('.text-item');
    const imageSlides = document.querySelectorAll('.image-group');
    const dots = document.querySelectorAll('.dot');
    
    // Select the container where swipes should be detected. 
    // If you have a specific hero section class (like '.hero-section'), replace 'body' with it.
    const touchArea = document.querySelector('body'); 

    // 2. Variables
    let currentIndex = 0;
    let slideTimer;
    let touchStartX = 0;
    let touchEndX = 0;

    // 3. Core Slide Logic
    function showSlide(index) {
        if (textSlides.length === 0) return;

        // Clear current classes
        textSlides.forEach(s => s.classList.remove('active'));
        imageSlides.forEach(img => img.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        // Handle Looping
        if (index >= textSlides.length) currentIndex = 0;
        else if (index < 0) currentIndex = textSlides.length - 1;
        else currentIndex = index;

        // Activate new slide
        textSlides[currentIndex].classList.add('active');
        if (imageSlides[currentIndex]) imageSlides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    // 4. Timer Logic
    function startTimer() {
        if (slideTimer) clearInterval(slideTimer);
        slideTimer = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 18000);
    }

    function jumpToSlide(index) {
        clearInterval(slideTimer);
        showSlide(index);
        startTimer();
    }

    // 5. Event Listeners: Clickable Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            jumpToSlide(index);
        });
    });

    // 6. Event Listeners: Touch Swipe Logic
    touchArea.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    touchArea.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance (in pixels) to be considered a swipe

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swiped Left -> Go to Next Slide
            jumpToSlide(currentIndex + 1);
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swiped Right -> Go to Previous Slide
            jumpToSlide(currentIndex - 1);
        }
    }

    // 7. Initialize
    showSlide(0);
    startTimer();
})();

/**
 * Tech Stack Marquee Logic
 * Infinite auto-scroll + Native touch swiping / mouse dragging
 */
(function initMarquee() {
    const marquee = document.querySelector('.marquee');
    const marqueeContent = document.querySelector('.marquee-content');

    if (!marquee || !marqueeContent) return;

    // 1. THE CIRCULAR LINKED LIST FIX: 
    // Capture the exact width of your clean, single set of tech items.
    const singleSetWidth = marqueeContent.scrollWidth;

    // Clone the items twice to ensure a seamless buffer line ahead.
    // This guarantees there is always content visible ahead, even on huge monitors.
    const originalItems = Array.from(marqueeContent.children);
    originalItems.forEach(item => marqueeContent.appendChild(item.cloneNode(true)));
    originalItems.forEach(item => marqueeContent.appendChild(item.cloneNode(true)));

    let isTouching = false;
    let isDragging = false;
    let autoScrollSpeed = 0.6; // Pixels per frame
    
    let startX;
    let scrollLeft;

    // 2. Continuous Circular Loop
    function autoScroll() {
        if (!isTouching && !isDragging) {
            marquee.scrollLeft += autoScrollSpeed;

            // The moment we have scrolled past exactly ONE full set of items,
            // silently snap back to 0. Because the items ahead are exact duplicates,
            // the layout looks 100% identical and the user sees no jump!
            if (marquee.scrollLeft >= singleSetWidth) {
                marquee.scrollLeft = 0;
            }
        }
        requestAnimationFrame(autoScroll);
    }

    // 3. Touch Controls (Pauses loop for smooth swiping)
    marquee.addEventListener('touchstart', () => { isTouching = true; }, { passive: true });
    marquee.addEventListener('touchend', () => { 
        isTouching = false; 
        // Sync index if user swiped past the loop threshold
        if (marquee.scrollLeft >= singleSetWidth) {
            marquee.scrollLeft -= singleSetWidth;
        }
    });
    
    // 4. Desktop Mouse Drag Controls
    marquee.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - marquee.offsetLeft;
        scrollLeft = marquee.scrollLeft;
    });
    
    marquee.addEventListener('mouseleave', () => { isDragging = false; });
    marquee.addEventListener('mouseup', () => { isDragging = false; });
    
    marquee.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - marquee.offsetLeft;
        const dragDistance = (x - startX) * 2;
        marquee.scrollLeft = scrollLeft - dragDistance;

        // Loop checks during active drag layout
        if (marquee.scrollLeft >= singleSetWidth) {
            marquee.scrollLeft -= singleSetWidth;
            startX = e.pageX - marquee.offsetLeft;
            scrollLeft = marquee.scrollLeft;
        } else if (marquee.scrollLeft <= 0) {
            marquee.scrollLeft += singleSetWidth;
            startX = e.pageX - marquee.offsetLeft;
            scrollLeft = marquee.scrollLeft;
        }
    });

    // Run the loop
    autoScroll();
})();