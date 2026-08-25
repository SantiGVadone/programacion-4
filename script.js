document.addEventListener('DOMContentLoaded', () => {
    // Progress bar on scroll
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = (window.pageYOffset / scrollTotal) * 100;
            progressBar.style.width = scrollProgress + '%';
        });
    }

    // Season card scroll-based activation
    const seasonCards = document.querySelectorAll('.season-card');
    const seasonIndicators = document.querySelectorAll('.season-indicator');
    const navBtnsPrev = document.querySelectorAll('.season-nav-btn.prev');
    const navBtnsNext = document.querySelectorAll('.season-nav-btn.next');

    // Activate season by index
    const activateSeason = (index) => {
        // Wrap around
        if (index < 0) index = seasonCards.length - 1;
        if (index >= seasonCards.length) index = 0;

        // Remove active from all
        seasonCards.forEach((card, i) => {
            card.classList.remove('active');
            card.classList.remove('prev', 'next');
            
            if (i === index) {
                card.classList.add('active');
            } else if (i === index - 1 || (index === 0 && i === seasonCards.length - 1)) {
                card.classList.add('prev');
            } else if (i === index + 1 || (index === seasonCards.length - 1 && i === 0)) {
                card.classList.add('next');
            }
        });

        // Update indicators
        seasonIndicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
    };

    // Click indicators
    seasonIndicators.forEach((ind, i) => {
        ind.addEventListener('click', () => activateSeason(i));
    });

    // Nav buttons
    navBtnsNext.forEach(btn => {
        btn.addEventListener('click', () => {
            // Find current active
            let currentIndex = 0;
            seasonCards.forEach((card, i) => {
                if (card.classList.contains('active')) currentIndex = i;
            });
            activateSeason(currentIndex + 1);
        });
    });

    navBtnsPrev.forEach(btn => {
        btn.addEventListener('click', () => {
            let currentIndex = 0;
            seasonCards.forEach((card, i) => {
                if (card.classList.contains('active')) currentIndex = i;
            });
            activateSeason(currentIndex - 1);
        });
    });

    // Scroll-based activation
    const seasonObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                activateSeason(index);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    seasonCards.forEach(card => seasonObserver.observe(card));

    // Character card scroll-based activation
    const charCards = document.querySelectorAll('.char-card');
    const charIndicators = document.querySelectorAll('.char-indicator');
    const charNavBtnsPrev = document.querySelectorAll('.char-nav-btn.prev');
    const charNavBtnsNext = document.querySelectorAll('.char-nav-btn.next');

    const activateChar = (index) => {
        if (index < 0) index = charCards.length - 1;
        if (index >= charCards.length) index = 0;

        charCards.forEach((card, i) => {
            card.classList.remove('active');
            card.classList.remove('prev', 'next');
            
            if (i === index) {
                card.classList.add('active');
            } else if (i === index - 1 || (index === 0 && i === charCards.length - 1)) {
                card.classList.add('prev');
            } else if (i === index + 1 || (index === charCards.length - 1 && i === 0)) {
                card.classList.add('next');
            }
        });

        charIndicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
    };

    charIndicators.forEach((ind, i) => {
        ind.addEventListener('click', () => activateChar(i));
    });

    charNavBtnsNext.forEach(btn => {
        btn.addEventListener('click', () => {
            let currentIndex = 0;
            charCards.forEach((card, i) => {
                if (card.classList.contains('active')) currentIndex = i;
            });
            activateChar(currentIndex + 1);
        });
    });

    charNavBtnsPrev.forEach(btn => {
        btn.addEventListener('click', () => {
            let currentIndex = 0;
            charCards.forEach((card, i) => {
                if (card.classList.contains('active')) currentIndex = i;
            });
            activateChar(currentIndex - 1);
        });
    });

    const charObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                activateChar(index);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    charCards.forEach(card => charObserver.observe(card));

    // Header background on scroll
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});