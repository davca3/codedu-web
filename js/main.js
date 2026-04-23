/**
 * Codedu Ostrava - Main JavaScript
 * Mobilní menu, smooth scroll, aktivní navigace
 */

(function () {
    'use strict';

    // Mobilní hamburger menu
    var nav = document.querySelector('.site-header nav');
    var header = document.querySelector('.site-header');

    if (nav && header) {
        var toggle = document.createElement('button');
        toggle.className = 'nav-toggle';
        toggle.setAttribute('aria-label', 'Otevřít menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<span></span><span></span><span></span>';
        header.insertBefore(toggle, nav);

        toggle.addEventListener('click', function () {
            var expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            nav.classList.toggle('nav-open');
            toggle.classList.toggle('active');
        });

        // Zavřít menu po kliknutí na odkaz
        var navLinks = nav.querySelectorAll('a');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function () {
                nav.classList.remove('nav-open');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    }

    // Smooth scroll pro kotevní odkazy
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var j = 0; j < anchors.length; j++) {
        anchors[j].addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Animace při scrollu - fade-in efekt
    var observer;
    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        var animatedElements = document.querySelectorAll('.card, .stat, figure, .faq-item');
        animatedElements.forEach(function (el) {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }
})();
