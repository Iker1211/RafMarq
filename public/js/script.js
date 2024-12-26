// public/js/services.js
document.addEventListener('DOMContentLoaded', function() {
    const serviceToggles = document.querySelectorAll('.service-toggle');
  
    serviceToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    });
  });