/**
 * Codedu Ostrava - Gallery Lightbox
 * Bootstrap Modal lightbox s jQuery
 */

(function () {
    'use strict';

    var images = [];
    var currentIndex = 0;

    function init() {
        var modalEl = document.getElementById('galleryModal');
        if (!modalEl) return;

        var modalImage = document.getElementById('modalImage');
        var modalCaption = document.getElementById('modalCaption');
        var modalPrev = document.getElementById('modalPrev');
        var modalNext = document.getElementById('modalNext');
        var bsModal = new bootstrap.Modal(modalEl);

        function showImage(index) {
            currentIndex = (index + images.length) % images.length;
            modalImage.src = images[currentIndex].src;
            modalImage.alt = images[currentIndex].alt;
            modalCaption.textContent = images[currentIndex].caption;
        }

        $('.gallery figure').each(function (i) {
            var $fig = $(this);
            var $img = $fig.find('img');
            var $cap = $fig.find('figcaption');
            if ($img.length) {
                images.push({
                    src: $img.attr('src'),
                    alt: $img.attr('alt') || '',
                    caption: $cap.length ? $cap.text() : ''
                });
                $fig.css('cursor', 'pointer').on('click', function () {
                    showImage(i);
                    bsModal.show();
                });
            }
        });

        $(modalPrev).on('click', function () { showImage(currentIndex - 1); });
        $(modalNext).on('click', function () { showImage(currentIndex + 1); });

        $(document).on('keydown', function (e) {
            if (!$(modalEl).hasClass('show')) return;
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
