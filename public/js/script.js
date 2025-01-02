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

  document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scrolldown
    let anchorlinks = document.querySelectorAll('a[href^="#"]');
    
    for (let item of anchorlinks) {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            let hashval = item.getAttribute('href');
            let target = document.querySelector(hashval);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            history.pushState(null, null, hashval);
        });
    }
});


