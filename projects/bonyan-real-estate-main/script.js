document.addEventListener("DOMContentLoaded", function () {
  // Form submission handling with improved validation
  const developerForm = document.getElementById("developerForm");
  if (developerForm) {
    developerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (validateForm()) {
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML =
          '<span class="spinner-border spinner-border-sm me-2"></span>جاري الإرسال...';

        try {
          // Get form data
          const formData = {
            companyName: document.getElementById("companyName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            companyType: document.getElementById("companyType").value,
            projectsCount: document.getElementById("projectsCount").value,
            message: document.getElementById("message").value,
          };

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));

          showSuccessMessage();
          this.reset();
        } catch (error) {
          showErrorMessage(
            "حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى."
          );
        } finally {
          // Reset button state
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }
      }
    });
  }

  // Improved form validation
  function validateForm() {
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const companyName = document.getElementById("companyName");
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      showFieldError(email, "الرجاء إدخال بريد إلكتروني صحيح");
      isValid = false;
    } else {
      clearFieldError(email);
    }

    // Phone validation
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone.value)) {
      showFieldError(phone, "الرجاء إدخال رقم هاتف صحيح");
      isValid = false;
    } else {
      clearFieldError(phone);
    }

    // Company name validation
    if (companyName.value.trim().length < 3) {
      showFieldError(companyName, "الرجاء إدخال اسم الشركة بشكل صحيح");
      isValid = false;
    } else {
      clearFieldError(companyName);
    }

    return isValid;
  }

  // Show field error
  function showFieldError(field, message) {
    field.classList.add("is-invalid");
    const errorDiv = field.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains("invalid-feedback")) {
      errorDiv.textContent = message;
    } else {
      const div = document.createElement("div");
      div.className = "invalid-feedback";
      div.textContent = message;
      field.parentNode.insertBefore(div, field.nextSibling);
    }
  }

  // Clear field error
  function clearFieldError(field) {
    field.classList.remove("is-invalid");
    const errorDiv = field.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains("invalid-feedback")) {
      errorDiv.remove();
    }
  }

  // Show success message with animation
  function showSuccessMessage() {
    const form = document.getElementById("developerForm");
    const successMessage = document.createElement("div");
    successMessage.className =
      "alert alert-success mt-3 animate__animated animate__fadeIn";
    successMessage.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            شكراً لتسجيلك! سنتواصل معك قريباً.
        `;

    form.appendChild(successMessage);

    // Remove success message after 5 seconds with fade out animation
    setTimeout(() => {
      successMessage.classList.add("animate__fadeOut");
      setTimeout(() => successMessage.remove(), 500);
    }, 5000);
  }

  // Show error message
  function showErrorMessage(message) {
    const form = document.getElementById("developerForm");
    const errorMessage = document.createElement("div");
    errorMessage.className =
      "alert alert-danger mt-3 animate__animated animate__fadeIn";
    errorMessage.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            ${message}
        `;

    form.appendChild(errorMessage);

    setTimeout(() => {
      errorMessage.classList.add("animate__fadeOut");
      setTimeout(() => errorMessage.remove(), 500);
    }, 5000);
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 80; // Adjust based on your navbar height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        // Show bottom nav during scroll
        const bottomNav = document.querySelector(".bottom-nav");
        if (bottomNav) {
          bottomNav.style.transform = "translateY(0)";
        }

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Update active navigation link on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const bottomNavLinks = document.querySelectorAll(".bottom-nav-item");

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 100; // Offset for better detection

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        // Update top navigation
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });

        // Update bottom navigation
        bottomNavLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("load", updateActiveLink);

  // Bottom Navigation Auto Hide/Show on Scroll (Mobile Only)
  let lastScrollTopBottom = 0;
  const bottomNav = document.querySelector(".bottom-nav");

  if (bottomNav) {
    window.addEventListener("scroll", function () {
      // Only apply auto-hide behavior on mobile devices
      if (window.innerWidth <= 991) {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTopBottom && scrollTop > 100) {
          // Scrolling down - hide bottom nav
          bottomNav.style.transform = "translateY(100%)";
        } else {
          // Scrolling up - show bottom nav
          bottomNav.style.transform = "translateY(0)";
        }

        lastScrollTopBottom = scrollTop <= 0 ? 0 : scrollTop;
      } else {
        // On desktop, bottom nav is hidden via CSS, ensure no transform
        bottomNav.style.transform = "translateY(0)";
      }
    });
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate__animated", "animate__fadeInUp");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  document
    .querySelectorAll(".feature-card, .benefit-card, .accordion-item")
    .forEach((el) => {
      observer.observe(el);
    });

  // Add hover effect to FAQ items
  document.querySelectorAll(".accordion-button").forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(-5px)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
    });
  });

  // Enhanced Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", function () {
    const currentScrollY = window.scrollY;

    // Add scrolled class for styling
    if (currentScrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Desktop navbar is always visible, no hide/show behavior needed
    // The navbar will only be visible on desktop due to CSS classes

    lastScrollY = currentScrollY;
  });

  // Enhanced navbar interactions
  const navLinksEnhanced = document.querySelectorAll(".nav-link");

  navLinksEnhanced.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.02)";
    });

    link.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "translateY(0) scale(1)";
      }
    });
  });

  // Desktop navbar links - no collapse behavior needed since it's always expanded

  // Counter Animation
  function animateCounter(element) {
    const target = parseInt(element.getAttribute("data-count"));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  // Intersection Observer for counters
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".stat-number").forEach((counter) => {
    counterObserver.observe(counter);
  });

  // Enhanced FAQ Accordion for Mobile
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", (e) => {
      e.preventDefault();
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains("active");
      const faqAnswer = faqItem.querySelector(".faq-answer");

      // Close all FAQ items with smooth animation
      document.querySelectorAll(".faq-item").forEach((item) => {
        if (item !== faqItem) {
          item.classList.remove("active");
          const answer = item.querySelector(".faq-answer");
          if (answer) {
            answer.style.maxHeight = "0px";
          }
        }
      });

      // Toggle current item with enhanced mobile experience
      if (!isActive) {
        faqItem.classList.add("active");

        // Smooth height animation
        if (faqAnswer) {
          faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
        }

        // Scroll to FAQ item on mobile for better UX
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            const headerOffset = window.innerWidth <= 991 ? 20 : 80;
            const elementPosition = faqItem.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }, 150);
        }
      } else {
        faqItem.classList.remove("active");
        if (faqAnswer) {
          faqAnswer.style.maxHeight = "0px";
        }
      }
    });

    // Enhanced touch feedback for mobile
    if ("ontouchstart" in window) {
      question.addEventListener("touchstart", function () {
        this.style.transform = "scale(0.98)";
      });

      question.addEventListener("touchend", function () {
        this.style.transform = "scale(1)";
      });
    }
  });

  // FAQ Mobile Optimization
  function optimizeFAQForMobile() {
    if (window.innerWidth <= 768) {
      const faqItems = document.querySelectorAll(".faq-item");

      faqItems.forEach((item, index) => {
        // Add staggered animation delay
        item.style.animationDelay = `${index * 0.1}s`;

        // Optimize touch targets
        const question = item.querySelector(".faq-question");
        if (question) {
          question.style.minHeight = "60px";
          question.style.display = "flex";
          question.style.alignItems = "center";
        }
      });
    }
  }

  // Run on load and resize
  optimizeFAQForMobile();
  window.addEventListener("resize", optimizeFAQForMobile);

  // Testimonials Animation
  const testimonialCards = document.querySelectorAll(".testimonial-card");

  const animateTestimonial = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  };

  const testimonialObserver = new IntersectionObserver(animateTestimonial, {
    threshold: 0.1,
    rootMargin: "0px",
  });

  testimonialCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = `all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) ${
      index * 0.2
    }s`;
    testimonialObserver.observe(card);
  });

  // Testimonial Quote Animation
  const quoteIcons = document.querySelectorAll(".quote-icon");
  quoteIcons.forEach((icon) => {
    icon.addEventListener("mouseover", () => {
      icon.style.transform = "rotate(360deg) scale(1.2)";
      icon.style.opacity = "0.3";
      icon.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
    });

    icon.addEventListener("mouseout", () => {
      icon.style.transform = "rotate(0) scale(1)";
      icon.style.opacity = "0.1";
      icon.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
    });
  });

  // Testimonial Rating Animation
  const ratings = document.querySelectorAll(".rating i");
  ratings.forEach((star, index) => {
    star.addEventListener("mouseover", () => {
      star.style.transform = "scale(1.5)";
      star.style.color = "#ffd700";
      star.style.textShadow = "0 0 15px rgba(255, 215, 0, 0.5)";

      // Animate previous stars
      for (let i = 0; i < index; i++) {
        ratings[i].style.transform = "scale(1.3)";
        ratings[i].style.color = "#ffd700";
      }
    });

    star.addEventListener("mouseout", () => {
      star.style.transform = "scale(1)";
      star.style.color = "#ffc107";
      star.style.textShadow = "0 0 5px rgba(255, 193, 7, 0.3)";

      // Reset previous stars
      for (let i = 0; i < index; i++) {
        ratings[i].style.transform = "scale(1)";
        ratings[i].style.color = "#ffc107";
      }
    });
  });

  // Testimonial Card Hover Effects
  testimonialCards.forEach((card) => {
    const authorImage = card.querySelector(".author-image");
    const authorInfo = card.querySelector(".author-info");
    const testimonialText = card.querySelector(".testimonial-text");

    card.addEventListener("mouseover", () => {
      authorImage.style.transform = "scale(1.1) rotate(5deg)";
      authorInfo.style.transform = "translateX(5px)";
      testimonialText.style.transform = "translateX(5px)";
    });

    card.addEventListener("mouseout", () => {
      authorImage.style.transform = "scale(1) rotate(0)";
      authorInfo.style.transform = "translateX(0)";
      testimonialText.style.transform = "translateX(0)";
    });
  });
});

// Form Submission Handler
const registrationForm = document.getElementById("developerRegistrationForm");

registrationForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Show loading state
  const submitButton = this.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
  submitButton.disabled = true;

  // Collect form data
  const formData = new FormData(this);

  // Send form data
  fetch(this.action, {
    method: "POST",
    body: formData,
    // *** قم بإزالة 'mode: no-cors' من هنا ***
    // mode: 'no-cors'
  })
    .then((response) => {
      // تأكد من أن الاستجابة صالحة قبل محاولة قراءتها كـ JSON
      // إذا كان Apps Script يعيد JSON، فسيعمل هذا.
      // في حالة no-cors، لن تتمكن من الوصول إلى Response.json()
      if (response.ok) {
        // تأكد من أن حالة الاستجابة 2xx
        return response.json();
      } else {
        // التعامل مع الأخطاء التي تأتي من Apps Script (مثلاً إذا كان هناك خطأ في الكود)
        throw new Error(
          "فشل إرسال البيانات إلى Google Apps Script: " + response.statusText
        );
      }
    })
    .then((data) => {
      // في حالة Apps Script الذي قدمته سابقاً، سيعيد { "result": "success" }
      if (data.result === "success") {
        // Show enhanced success message
        Swal.fire({
          title: "🎉 تم التسجيل بنجاح!",
          html: `
            <div style="text-align: center; padding: 20px;">
              <div style="font-size: 1.2rem; color: #28a745; margin-bottom: 15px;">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: #28a745; margin-bottom: 15px;"></i>
              </div>
              <p style="font-size: 1.1rem; color: #333; margin-bottom: 10px;">
                شكراً لتسجيلك معنا في منصة بنيان!
              </p>
              <p style="font-size: 1rem; color: #666;">
                سنتواصل معك قريباً عبر البريد الإلكتروني أو الهاتف
              </p>
            </div>
          `,
          icon: "success",
          confirmButtonText: "ممتاز",
          confirmButtonColor: "#28a745",
          background: "#ffffff",
          color: "#333",
          showClass: {
            popup: "animate__animated animate__fadeInUp animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutDown animate__faster",
          },
          customClass: {
            popup: "success-popup",
            title: "success-title",
            confirmButton: "success-button",
          },
        });

        // Reset form with animation
        setTimeout(() => {
          this.reset();
        }, 500);

        // Show additional success feedback
        const submitButton = this.querySelector('button[type="submit"]');
        const formElement = this;

        // Animate form success state
        formElement.style.transition = "all 0.5s ease";
        formElement.style.transform = "scale(1.02)";
        formElement.style.boxShadow = "0 10px 30px rgba(40, 167, 69, 0.2)";
        formElement.style.borderColor = "#28a745";

        // Update button with success state
        submitButton.innerHTML =
          '<i class="fas fa-check"></i> تم الإرسال بنجاح';
        submitButton.classList.add("btn-success-feedback");

        // Add success class to all form inputs
        const inputs = formElement.querySelectorAll(".form-control");
        inputs.forEach((input) => {
          input.classList.add("form-success-state");
        });

        // Add success message to form
        const successMessage = document.createElement("div");
        successMessage.className =
          "alert alert-success mt-3 animate__animated animate__fadeInUp";
        successMessage.innerHTML = `
          <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-3" style="font-size: 1.5rem; color: #28a745;"></i>
            <div>
              <strong>تم إرسال بياناتك بنجاح!</strong><br>
              <small>سنتواصل معك قريباً عبر البريد الإلكتروني أو الهاتف</small>
            </div>
          </div>
        `;
        formElement.appendChild(successMessage);

        // Reset everything after 4 seconds
        setTimeout(() => {
          submitButton.innerHTML = "سجل الآن";
          submitButton.classList.remove("btn-success-feedback");
          formElement.style.transform = "";
          formElement.style.boxShadow = "";
          formElement.style.borderColor = "";

          inputs.forEach((input) => {
            input.classList.remove("form-success-state");
          });

          // Remove success message
          if (successMessage && successMessage.parentNode) {
            successMessage.classList.add("animate__fadeOutDown");
            setTimeout(() => {
              successMessage.remove();
            }, 500);
          }
        }, 4000);
      } else {
        // في حالة أن Apps Script أرجع شيئًا آخر غير success
        Swal.fire({
          title: "حدث خطأ!",
          text: "عذراً، حدث خطأ في استجابة الخادم. يرجى المحاولة مرة أخرى.",
          icon: "error",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#dc3545",
        });
        console.error("Apps Script response not success:", data);
      }
    })
    .catch((error) => {
      // Show error message
      Swal.fire({
        title: "حدث خطأ!",
        text: "عذراً، حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#dc3545",
      });
      console.error("Error:", error);
    })
    .finally(() => {
      // Reset button state
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    });
});
//     // Form Submission Handler
//     const registrationForm = document.getElementById('developerRegistrationForm');

//     registrationForm.addEventListener('submit', function(e) {
//         e.preventDefault();

//         // Show loading state
//         const submitButton = this.querySelector('button[type="submit"]');
//         const originalButtonText = submitButton.innerHTML;
//         submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
//         submitButton.disabled = true;

//         // Collect form data
//         const formData = new FormData(this);

//         // Send form data
//         fetch(this.action, {
//             method: 'POST',
//             body: formData,
//             mode: 'no-cors'
//         })
//         .then(() => {
//             // Show success message
//             Swal.fire({
//                 title: 'تم التسجيل بنجاح!',
//                 text: 'شكراً لتسجيلك معنا. سنتواصل معك قريباً.',
//                 icon: 'success',
//                 confirmButtonText: 'حسناً',
//                 confirmButtonColor: '#28a745'
//             });

//             // Reset form
//             this.reset();
//         })
//         .catch(error => {
//             // Show error message
//             Swal.fire({
//                 title: 'حدث خطأ!',
//                 text: 'عذراً، حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.',
//                 icon: 'error',
//                 confirmButtonText: 'حسناً',
//                 confirmButtonColor: '#dc3545'
//             });
//             console.error('Error:', error);
//         })
//         .finally(() => {
//             // Reset button state
//             submitButton.innerHTML = originalButtonText;
//             submitButton.disabled = false;
//         });
//     });
// });
