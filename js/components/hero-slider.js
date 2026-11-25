
/* =========================================================
   KIAN GOLD — HERO SLIDER
========================================================= */

export function initHeroSlider() {

  const slider = document.querySelector('#hero-slider');

  if (!slider) return;

  const slides = [...slider.querySelectorAll('.hero-slide')];
  const dots = [...slider.querySelectorAll('.hero-dots button')];

  const prev = slider.querySelector('.hero-prev');
  const next = slider.querySelector('.hero-next');

  if (slides.length < 2) return;

  let current = slides.findIndex(slide =>
    slide.classList.contains('active')
  );

  if (current < 0) current = 0;

  let timer = null;

  const interval = 5000;

  function showSlide(index) {

    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {

      slide.classList.toggle('active', i === current);

    });

    dots.forEach((dot, i) => {

      dot.classList.toggle('active', i === current);

      dot.setAttribute(
        'aria-current',
        i === current ? 'true' : 'false'
      );

    });

  }

  function stopAutoplay() {

    if (timer !== null) {

      clearInterval(timer);

      timer = null;

    }

  }

  function startAutoplay() {

    stopAutoplay();

    if (window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches) return;

    timer = setInterval(() => {

      showSlide(current + 1);

    }, interval);

  }

  function restartAutoplay() {

    stopAutoplay();

    startAutoplay();

  }

  next?.addEventListener('click', () => {

    showSlide(current + 1);

    restartAutoplay();

  });

  prev?.addEventListener('click', () => {

    showSlide(current - 1);

    restartAutoplay();

  });

  dots.forEach((dot, index) => {

    dot.addEventListener('click', () => {

      showSlide(index);

      restartAutoplay();

    });

  });

  slider.addEventListener('mouseenter', stopAutoplay);

  slider.addEventListener('mouseleave', startAutoplay);

  slider.addEventListener('focusin', stopAutoplay);

  slider.addEventListener('focusout', event => {

    if (!slider.contains(event.relatedTarget)) {

      startAutoplay();

    }

  });

  document.addEventListener('visibilitychange', () => {

    if (document.hidden) {

      stopAutoplay();

    } else {

      startAutoplay();

    }

  });

  showSlide(current);

  startAutoplay();

}
