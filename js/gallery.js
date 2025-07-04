/* ==========================================
   GALLERY SPECIFIC JAVASCRIPT
   ========================================== */

// Gallery Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    initGalleryFilter();
    initGalleryGrid();
    initStatsAnimation();
});

function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    // Animate in
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    // Hide after animation
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initGalleryGrid() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.style.transition = 'all 0.3s ease';
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
}

function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateNumber(element) {
    const finalNumber = element.textContent.replace(/[^0-9]/g, '');
    const suffix = element.textContent.replace(/[0-9]/g, '');
    let currentNumber = 0;
    const increment = finalNumber / 50;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
            currentNumber = finalNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentNumber) + suffix;
    }, 40);
}

// Enhanced Gallery Lightbox
function enhancedGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    let galleryArray = [];
    
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('h4')?.textContent || 'Gallery Image';
        const description = item.querySelector('p')?.textContent || '';
        
        galleryArray.push({
            src: img.src,
            alt: img.alt,
            title: title,
            description: description
        });
        
        item.addEventListener('click', function() {
            currentIndex = index;
            showEnhancedLightbox(galleryArray, currentIndex);
        });
    });
}

function showEnhancedLightbox(gallery, index) {
    const lightbox = document.createElement('div');
    lightbox.className = 'enhanced-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">
                <i class="fas fa-times"></i>
            </button>
            <button class="lightbox-prev" aria-label="Previous image">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="lightbox-next" aria-label="Next image">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="lightbox-image-container">
                <img src="${gallery[index].src}" alt="${gallery[index].alt}" class="lightbox-image">
                <div class="lightbox-info">
                    <h3>${gallery[index].title}</h3>
                    <p>${gallery[index].description}</p>
                </div>
            </div>
            <div class="lightbox-counter">
                <span>${index + 1} / ${gallery.length}</span>
            </div>
        </div>
    `;
    
    // Styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
    
    // Navigation
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const img = lightbox.querySelector('.lightbox-image');
    const title = lightbox.querySelector('.lightbox-info h3');
    const description = lightbox.querySelector('.lightbox-info p');
    const counter = lightbox.querySelector('.lightbox-counter span');
    
    function updateLightbox(newIndex) {
        index = newIndex;
        img.src = gallery[index].src;
        img.alt = gallery[index].alt;
        title.textContent = gallery[index].title;
        description.textContent = gallery[index].description;
        counter.textContent = `${index + 1} / ${gallery.length}`;
    }
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => {
        const newIndex = index > 0 ? index - 1 : gallery.length - 1;
        updateLightbox(newIndex);
    });
    nextBtn.addEventListener('click', () => {
        const newIndex = index < gallery.length - 1 ? index + 1 : 0;
        updateLightbox(newIndex);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
    
    function handleKeydown(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    }
    
    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeydown);
        }, 300);
    }
}

// Initialize enhanced lightbox
document.addEventListener('DOMContentLoaded', enhancedGalleryLightbox);

// Gallery loading animation
function initGalleryLoading() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize gallery loading
document.addEventListener('DOMContentLoaded', initGalleryLoading); 