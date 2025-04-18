const carousel = document.querySelector('.carousel');
const cards = document.querySelectorAll('.course-card');
const totalCards = cards.length;
const visibleCards = 3;
let currentIndex = 0;
const scrollSpeed = 0.5; // Adjust speed for smoothness

// Clone first few cards and append to the end for seamless looping
for (let i = 0; i < visibleCards; i++) {
    const clone = cards[i].cloneNode(true);
    carousel.appendChild(clone);
}

// Function to move the carousel continuously
function moveCarousel() {
    currentIndex++;

    // Reset to the start seamlessly when reaching the duplicated section
    if (currentIndex > totalCards) {
        carousel.style.transition = "none"; // Remove transition for instant reset
        currentIndex = 0;
        carousel.style.transform = `translateX(0)`;
        setTimeout(() => {
            carousel.style.transition = "transform 0.5s linear"; // Restore smooth scrolling
        }, 50);
    }

    carousel.style.transform = `translateX(-${currentIndex * (100 / visibleCards)}%)`;
}

// Start continuous movement
setInterval(moveCarousel, 2000); // Adjust speed by changing the interval time


    document.getElementById('paymentMethod').addEventListener('change', function () {
        const paymentMethod = this.value;
        if (paymentMethod === 'credit-card') {
            document.getElementById('creditCardFields').style.display = 'block';
            document.getElementById('paypalFields').style.display = 'none';
        } else if (paymentMethod === 'paypal') {
            document.getElementById('creditCardFields').style.display = 'none';
            document.getElementById('paypalFields').style.display = 'block';
        } else {
            document.getElementById('creditCardFields').style.display = 'none';
            document.getElementById('paypalFields').style.display = 'none';
        }
    });


