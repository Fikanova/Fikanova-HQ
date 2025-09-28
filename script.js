// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
	navMenu.classList.toggle('active');
	const icon = mobileToggle.querySelector('i');
	if (navMenu.classList.contains('active')) {
		icon.classList.remove('fa-bars');
		icon.classList.add('fa-times');
	} else {
		icon.classList.remove('fa-times');
		icon.classList.add('fa-bars');
	}
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
	link.addEventListener('click', () => {
		navMenu.classList.remove('active');
		const icon = mobileToggle.querySelector('i');
		icon.classList.remove('fa-times');
		icon.classList.add('fa-bars');
	});
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute('href'));
		if (target) {
			const headerOffset = 80;
			const elementPosition = target.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}
	});
});

// Animated counters
const counters = document.querySelectorAll('.stat-number');
let animated = false;

const animateCounters = () => {
	counters.forEach(counter => {
		const target = parseInt(counter.getAttribute('data-target'));
		const duration = 2000;
		const increment = target / (duration / 16);
		let current = 0;

		const updateCounter = () => {
			current += increment;
			if (current < target) {
				counter.textContent = Math.floor(current) + '+';
				requestAnimationFrame(updateCounter);
			} else {
				counter.textContent = target + (target < 2025 ? '+' : '');
			}
		};
		updateCounter();
	});
};

// Trigger counter animation on scroll
const statsSection = document.querySelector('.stats');
const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting && !animated) {
			animateCounters();
			animated = true;
		}
	});
}, { threshold: 0.5 });

observer.observe(statsSection);

// Portfolio tabs
function showTab(tabName) {
	document.querySelectorAll('.tab-content').forEach(content => {
		content.classList.remove('active');
	});
	document.querySelectorAll('.tab-btn').forEach(btn => {
		btn.classList.remove('active');
	});
	document.getElementById(tabName).classList.add('active');
	event.target.classList.add('active');
}

// Accordion functionality
function toggleAccordion(header) {
	const item = header.parentElement;
	const isActive = item.classList.contains('active');
	// Close all accordion items
	document.querySelectorAll('.accordion-item').forEach(accordionItem => {
		accordionItem.classList.remove('active');
	});
	// Open clicked item if it wasn't active
	if (!isActive) {
		item.classList.add('active');
	}
}

// Newsletter form validation
const emailInput = document.getElementById('emailInput');
const form = document.getElementById('newsletterForm');
const formMessage = document.getElementById('formMessage');

emailInput.addEventListener('input', () => {
	const email = emailInput.value;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (email === '') {
		emailInput.classList.remove('valid', 'invalid');
	} else if (emailRegex.test(email)) {
		emailInput.classList.remove('invalid');
		emailInput.classList.add('valid');
	} else {
		emailInput.classList.remove('valid');
		emailInput.classList.add('invalid');
	}
});

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const email = emailInput.value;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (emailRegex.test(email)) {
		formMessage.textContent = '✓ Thank you for subscribing!';
		formMessage.className = 'form-message success';
		emailInput.value = '';
		emailInput.classList.remove('valid');
	} else {
		formMessage.textContent = '✗ Please enter a valid email address';
		formMessage.className = 'form-message error';
	}
});
