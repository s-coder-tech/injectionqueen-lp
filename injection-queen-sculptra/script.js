
// Initialize Lucide icons
lucide.createIcons();

// Mobile Menu Functionality
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        
        // Toggle menu visibility
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            // Trigger animation after removing hidden
            requestAnimationFrame(() => {
                mobileMenu.classList.add('animate-active');
            });
        } else {
            mobileMenu.classList.remove('animate-active');
            // Wait for animation to finish before hiding (optional, but for now just hide immediately to be safe/simple or match expected behavior)
            mobileMenu.classList.add('hidden');
        }
        
        // Toggle header background for mobile menu
        const header = document.querySelector('header');
        header.classList.toggle('mobile-open');
        
        // Update aria attribute
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle icons
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('button, a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('animate-active');
            mobileMenu.classList.add('hidden');
            const header = document.querySelector('header');
            header.classList.remove('mobile-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });
}

// Smooth Scroll Function
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 80; // Height of fixed header
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// Accordion Functionality
const accordionTriggers = document.querySelectorAll('.accordion-trigger');

accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const content = trigger.nextElementSibling;
        const icon = trigger.querySelector('.accordion-chevron');
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        // Close other accordion items
        accordionTriggers.forEach(otherTrigger => {
            if (otherTrigger !== trigger) {
                otherTrigger.setAttribute('aria-expanded', 'false');
                otherTrigger.nextElementSibling.style.maxHeight = null;
                otherTrigger.nextElementSibling.classList.remove('open');
                const otherIcon = otherTrigger.querySelector('.accordion-chevron');
                if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
            }
        });

        // Toggle current accordion item
        trigger.setAttribute('aria-expanded', !isExpanded);
        content.classList.toggle('open');
        
        if (content.classList.contains('open')) {
            content.style.maxHeight = content.scrollHeight + "px";
            if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
            content.style.maxHeight = null;
            if (icon) icon.style.transform = 'rotate(0deg)';
        }
    });
});

// Scroll Animations (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-active');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-fade-up').forEach(el => {
    observer.observe(el);
});

// Add scroll listener for header background
const header = document.querySelector('header');

function updateNavbar() {
    if (window.scrollY > 50) {
        header.classList.remove('transparent-nav');
        header.classList.add('scrolled-nav');
    } else {
        header.classList.add('transparent-nav');
        header.classList.remove('scrolled-nav');
    }
}

// Initial check
updateNavbar();

window.addEventListener('scroll', updateNavbar);

// Number Counting Animation
const counterObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 6000; // 6 seconds (Tripled to slow down animation)
            const step = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
            observer.unobserve(counter);
        }
    });
}, counterObserverOptions);

document.querySelectorAll('.counter').forEach(counter => {
    counterObserver.observe(counter);
});

// Scroll to Top Functionality
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Smooth scroll to top
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Map Implementation
const mapElement = document.getElementById('map');
if (mapElement) {
    // Coordinates for Pieter Calandlaan 1193, 1069 SE Amsterdam
    const lat = 52.3511;
    const lng = 4.7964;
    
    const map = L.map('map', {
        scrollWheelZoom: false // Disable scroll zoom initially
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom Icon
    var customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const marker = L.marker([lat, lng], {icon: customIcon}).addTo(map);
    
    // Custom popup content
    const popupContent = `
        <div style="text-align: center; font-family: inherit;">
            <strong style="color: #4e8b71; font-size: 1.1em; display: block; margin-bottom: 4px;">Injection Queen</strong>
            <span style="font-size: 0.9em; color: #666; display: block; margin-bottom: 8px;">
                Pieter Calandlaan 1193<br>1069 SE Amsterdam
            </span>
            <a href="https://maps.app.goo.gl/zoQA5F2JLQjiPK6n8" target="_blank" 
               style="color: #4e8b71; text-decoration: underline; font-weight: 500; font-size: 0.9em; display: inline-flex; align-items: center; gap: 4px;">
                Routebeschrijving
            </a>
        </div>
    `;

    marker.bindPopup(popupContent).openPopup();

    // Enable scroll zoom on click/focus
    map.on('click', function() {
        map.scrollWheelZoom.enable();
    });
    
    map.on('mouseout', function() {
        map.scrollWheelZoom.disable();
    });

    // Force invalidation to ensure proper rendering
    setTimeout(() => { map.invalidateSize(); }, 100);
}
