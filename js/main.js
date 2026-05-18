/* ============================================
   ZHENGXIN SHUZHI TECHNOLOGY CO., LTD
   Main JavaScript File
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollEffects();
  initFormHandling();
  initAnimations();
  initMobileMenu();
});

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
  const header = document.querySelector('header');
  let lastScrollPos = 0;

  window.addEventListener('scroll', function() {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollPos = currentScrollPos;
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          const mobileMenu = document.querySelector('nav ul');
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
          }
        }
      }
    });
  });
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('nav ul');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      // Change icon
      const icon = this.querySelector('use') || this.querySelector('svg');
      if (navMenu.classList.contains('active')) {
        // Change to close icon
        if (icon && icon.getAttribute) {
          icon.setAttribute('href', 'images/icons.svg#icon-close');
        }
      } else {
        // Change to menu icon
        if (icon && icon.getAttribute) {
          icon.setAttribute('href', 'images/icons.svg#icon-menu');
        }
      }
    });

    // Close menu when a link is clicked
    document.querySelectorAll('nav a').forEach(link => {
      if (link.getAttribute('href') !== '#') {
        link.addEventListener('click', function() {
          navMenu.classList.remove('active');
        });
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('nav') && !e.target.closest('.mobile-toggle')) {
        navMenu.classList.remove('active');
      }
    });
  }
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

function initScrollEffects() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .card, .feature-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach(element => {
      if (!element.classList.contains('revealed')) {
        observer.observe(element);
      }
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(element => {
      element.classList.add('revealed');
    });
  }
}

// ============================================
// FORM HANDLING
// ============================================

function initFormHandling() {
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Add input validation listeners
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('blur', validateInput);
    input.addEventListener('input', clearError);
  });
}

function validateInput(e) {
  const input = e.target;
  const type = input.type;
  const value = input.value.trim();

  if (value === '') {
    showError(input, 'This field is required');
    return false;
  }

  if (type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showError(input, 'Please enter a valid email');
      return false;
    }
  }

  if (type === 'tel') {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value)) {
      showError(input, 'Please enter a valid phone number');
      return false;
    }
  }

  clearError(e);
  return true;
}

function showError(input, message) {
  const formGroup = input.parentElement;
  if (!formGroup.querySelector('.error-message')) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#d32f2f';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    formGroup.appendChild(errorDiv);
  }
  input.style.borderColor = '#d32f2f';
}

function clearError(e) {
  const input = e.target;
  const formGroup = input.parentElement;
  const errorMessage = formGroup.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
  input.style.borderColor = '';
}

function handleFormSubmit(e) {
  e.preventDefault();

  // Validate all inputs
  const inputs = this.querySelectorAll('input, textarea, select');
  let isValid = true;

  inputs.forEach(input => {
    if (!validateInput({ target: input })) {
      isValid = false;
    }
  });

  if (!isValid) {
    showNotification('Please fix all errors before submitting', 'error');
    return;
  }

  // Here you would typically send the form data to a server
  // For now, we'll just show a success message
  const formData = new FormData(this);
  console.log('Form Data:', Object.fromEntries(formData));

  showNotification('Thank you! We will contact you soon.', 'success');
  this.reset();

  // Optional: Clear any error states
  this.querySelectorAll('input, textarea, select').forEach(input => {
    input.style.borderColor = '';
  });
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 4px;
    z-index: 2000;
    animation: slideInUp 0.5s ease-out;
    font-weight: 600;
    max-width: 300px;
  `;

  if (type === 'success') {
    notification.style.backgroundColor = '#4caf50';
    notification.style.color = 'white';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#f44336';
    notification.style.color = 'white';
  } else {
    notification.style.backgroundColor = '#2196f3';
    notification.style.color = 'white';
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideInUp 0.5s ease-out reverse';
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}

// ============================================
// ANIMATIONS
// ============================================

function initAnimations() {
  // Animate counter numbers
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const increment = target / 100;
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current) + '+';
        setTimeout(updateCounter, 30);
      } else {
        counter.textContent = target + '+';
      }
    };

    // Start animation when element comes into view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          updateCounter();
          observer.unobserve(counter);
        }
      });
      observer.observe(counter);
    }
  });

  // Parallax effect for hero
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.5;
      const elements = hero.querySelectorAll('.hero::before, .hero::after');
      // This is handled by CSS animations
    });
  }

  // Hover effects for cards
  const cards = document.querySelectorAll('.card, .feature-card, .testimonial-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Throttle function
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get URL parameter
function getUrlParameter(name) {
  const url = new URL(window.location);
  return url.searchParams.get(name);
}

// Lazy load images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ============================================
// ANALYTICS
// ============================================

// Track link clicks
function trackLink(url, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      'page_path': url,
      'page_title': label
    });
  }
  console.log('Tracked link:', label, url);
}

// Page view tracking
if (typeof gtag !== 'undefined') {
  gtag('config', 'G-XXXXXXXXXX'); // Replace with actual Google Analytics ID
}

// ============================================
// EXPORT FOR MODULE USAGE
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initNavigation,
    initScrollEffects,
    initFormHandling,
    initAnimations,
    validateInput,
    showNotification,
    throttle,
    debounce
  };
}
