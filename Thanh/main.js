(function () {
    const track   = document.getElementById('bannerTrack');
    const slides  = track.querySelectorAll('.banner-slide');
    const dots    = document.querySelectorAll('.banner-dot');
    const prevBtn = document.getElementById('bannerPrev');
    const nextBtn = document.getElementById('bannerNext');
    let current = 0;
    let autoTimer;

    function goTo(index, direction) {
        const total = slides.length;
        const next  = (index + total) % total;
        if (next === current) return;

        const fromRight = direction !== 'prev';

        slides[next].style.transition = 'none';
        slides[next].style.transform  = fromRight ? 'translateX(100%)' : 'translateX(-100%)';
        slides[next].style.zIndex     = '2';

        slides[next].getBoundingClientRect(); 

        slides[next].style.transition = 'transform 0.55s cubic-bezier(0.77,0,0.18,1)';
        slides[next].style.transform  = 'translateX(0)';

        slides[current].style.transition = 'transform 0.55s cubic-bezier(0.77,0,0.18,1)';
        slides[current].style.transform  = fromRight ? 'translateX(-100%)' : 'translateX(100%)';
        slides[current].style.zIndex     = '1';

        const overlay = slides[next].querySelector('.banner-overlay');
        overlay.style.transition = 'none';
        overlay.style.opacity    = '0';
        overlay.style.transform  = 'translateY(20px)';
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.45s ease 0.3s, transform 0.45s ease 0.3s';
            overlay.style.opacity    = '1';
            overlay.style.transform  = 'translateY(0)';
        }, 20);

        dots[current].classList.remove('active');
        dots[next].classList.add('active');
        current = next;
    }

    function startAuto() {
        autoTimer = setInterval(() => goTo(current + 1, 'next'), 5000);
    }

    function resetAuto() {
        clearInterval(autoTimer);
        startAuto();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1, 'next'); resetAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1, 'prev'); resetAuto(); });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.index);
            goTo(idx, idx > current ? 'next' : 'prev');
            resetAuto();
        });
    });

    if (track) {
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goTo(current + 1, 'next') : goTo(current - 1, 'prev');
                resetAuto();
            }
        });
    }

    startAuto();

    // ── Logic Phân Trang Deal of the Days ──
    const pageButtons = document.querySelectorAll('.pagination .page-btn');
    const dealHeaderArrows = document.querySelectorAll('.deal-header .arrows span');
    let currentPageIndex = 0; 
    const numPages = 4; 

    function updateActivePage(targetIndex) {
        if (targetIndex < 0 || targetIndex >= numPages) return;
        
        pageButtons.forEach(btn => {
            if (!btn.textContent.includes('>>') && !btn.textContent.includes('<<')) {
                const btnPageNum = parseInt(btn.textContent.trim());
                if (btnPageNum === (targetIndex + 1)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
        currentPageIndex = targetIndex;
    }

    pageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const btnText = btn.textContent.trim();
            if (btnText === '>>') {
                if (currentPageIndex < numPages - 1) {
                    updateActivePage(currentPageIndex + 1);
                }
            } else if (btnText === '<<') {
                if (currentPageIndex > 0) {
                    updateActivePage(currentPageIndex - 1);
                }
            } else {
                const targetPageNum = parseInt(btnText);
                if (!isNaN(targetPageNum)) {
                    updateActivePage(targetPageNum - 1);
                }
            }
        });
    });

    if (dealHeaderArrows.length >= 2) {
        dealHeaderArrows[0].addEventListener('click', () => {
            if (currentPageIndex > 0) {
                updateActivePage(currentPageIndex - 1);
            } else {
                updateActivePage(numPages - 1); 
            }
        });
        dealHeaderArrows[1].addEventListener('click', () => {
            if (currentPageIndex < numPages - 1) {
                updateActivePage(currentPageIndex + 1);
            } else {
                updateActivePage(0); 
            }
        });
    }
})();