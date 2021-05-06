import 'url-search-params-polyfill';
import 'child-node-remove-polyfill';

document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const root = document.body.style;
  const layout = document.getElementsByClassName('layout')[0];
  const logoViewport = document.getElementById('header-logo-viewport');
  const navLinks = Array.from(document.getElementsByClassName('nav__link'));

  // class names
  const CLASSES = {
    setup: 'setup-interstitial',
    run: 'run-interstitial'
  };

  // interstitial suppressed for the following conditions:
  //  - in development, unless query string flag is present
  //  - there's a valid hash on page load (just go directly there)
  //  - any page not at the root is requested
  //  - touchscreen devices (messes with mobile performance metrics)
  const searchParams = new URLSearchParams(window.location.search);
  const anchors = navLinks.map(navLink => navLink.getAttribute('href'));
  const showInterstitial =
    (
      (process.env.ELEVENTY_ENV !== 'development') || 
      ((process.env.ELEVENTY_ENV === 'development') && searchParams.has('interstitial'))
    ) && (anchors.indexOf(window.location.hash) === -1) 
      && (!window.location.pathname.match(/^\/[A-z0-9]+/))
      && (document.getElementsByTagName('html')[0].classList.contains('no-touchevents'));

  // console.log(showInterstitial);
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
