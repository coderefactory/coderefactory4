import 'url-search-params-polyfill';

document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const root = document.body.style;
  const layout = document.getElementsByClassName('layout')[0];
  const logoViewport = document.getElementById('header-logo-viewport');

  // class names
  const CLASSES = {
    setup: 'setup-interstitial',
    run: 'run-interstitial'
  };

  // interstitial suppressed in development unless query string flag is present
  const searchParams = new URLSearchParams(window.location.search);
  const showInterstitial = (process.env.ELEVENTY_ENV !== 'development') || ((process.env.ELEVENTY_ENV === 'development') && searchParams.has('interstitial'));

  if (showInterstitial) {
    layout.classList.add(CLASSES.setup);
  }
  // if not set up for interstitial, return out
  else if (!layout.classList.contains(CLASSES.setup)) {
    return;
  }

  // set optimal size for fully dilated logo viewport
  const vmax = Math.max(window.innerHeight, window.innerWidth);
  root.setProperty('--viewport-scale-end', vmax * 1.414 / logoViewport.clientWidth);

  // start interstitial animation after brief delay
  const st = window.setTimeout(() => {
    // clean up UI after animation
    logoViewport.addEventListener('transitionend', () => {
      logoViewport.remove();
      layout.classList.remove(CLASSES.setup, CLASSES.run);
    });

    // start animation
    layout.classList.add(CLASSES.run);
    window.clearTimeout(st);
  }, 1000);
});
