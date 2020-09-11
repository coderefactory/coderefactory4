import 'url-search-params-polyfill';

document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const root = document.body.style;
  const layout = document.getElementsByClassName('layout')[0];
  const logoViewport = document.getElementById('header-logo-viewport');

  // FIXME: TEST ONLY: interstitial optional with query string flag
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('interstitial')) {
    layout.classList.add('setup-interstitial');
  }

  // if not set up for interstitial, return out
  else if (!layout.classList.contains('setup-interstitial')) {
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
      layout.classList.remove('setup-interstitial', 'run-interstitial');
    });

    // start animation
    layout.classList.add('run-interstitial');
    window.clearTimeout(st);
  }, 1000);
});
