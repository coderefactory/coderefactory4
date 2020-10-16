import createFocusTrap from 'focus-trap';
import 'waypoints/lib/noframework.waypoints';
import hotkeys from 'hotkeys-js';

// scroll-behavior polyfill
// load only if certain features not supported
import smoothscroll from 'smoothscroll-polyfill';

const SELECTORS = {
  nav: '.js-nav',
  toggleBtn: '.js-nav-toggle'
}

const CLASSES = {
  open: 'is-open',
  unrevealed: 'unrevealed'
}

document.addEventListener('DOMContentLoaded', () => {
  const needsScrollPolyfill = !('scrollBehavior' in document.documentElement.style);
  smoothscroll.polyfill();

  // get elements
  const nav = document.querySelector(SELECTORS.nav);
  const navLinks = Array.from(document.getElementsByClassName('nav__link'));
  const logo = document.querySelector('.header__logo');
  const toggleBtn = document.querySelector(SELECTORS.toggleBtn);
  const main = document.getElementsByTagName('main')[0];
  const layout = document.getElementsByClassName('layout')[0];
  const sections = Array.from(document.getElementsByTagName('section'));

  // set flags
  let selectedIndex = 0; // CR logo (#home)
  let isOpen = false;
  const isScrollSnapCapable = document.querySelector('html.scrollsnappoints');
  const isIndexPage = !window.location.pathname.replace('/', '');

  // focus trap
  const focusTrap = createFocusTrap(nav, {
    returnFocusOnDeactivate: false
  });

  // define behaviors

  //  - hamburger menu
  const toggleMenu = force => {
    isOpen = typeof force === 'boolean' ? force : !isOpen;

    if (isOpen) {
      focusTrap.activate();
    } else {
      focusTrap.deactivate();
    }

    nav.classList.toggle(CLASSES.open, isOpen);
    // console.log(`force ${String(force)}, isOpen ${isOpen}, nav.classList ${nav.classList}`);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  };

  //  - scroll triggering
  const moveTo = panelIndex => {
    main.scrollTo({ behavior: 'smooth', left: 0, top: sections[panelIndex].offsetTop });
  };

  const navigatePrevious = () => {
    if (selectedIndex <= 0) {
      return;
    }
    const i = selectedIndex - 1;
    navigate(i);
    moveTo(i);
  };

  const navigateNext = () => {
    if (selectedIndex >= sections.length - 1) {
      return;
    }
    const i = selectedIndex + 1;
    navigate(i);
    moveTo(i);
  };

  //  - handle section changes
  const navigate = toIndex => {
    if (toIndex === selectedIndex) {
      return;
    }

    // housekeeping: reset Stories view
    if (toIndex !== 1) {
      document.body.dispatchEvent(new Event('stories.reset'));
    }

    // update flags
    const oldIndex = selectedIndex;
    selectedIndex = toIndex;

    // update facing for each link
    navLinks.forEach((nl, j) => {
      let faceLeft;
      if (j === selectedIndex) {
        faceLeft = selectedIndex > oldIndex;
      } else {
        faceLeft = j > selectedIndex;
      }
      nl.setAttribute('data-face-left', faceLeft);

      // unset, then set (see notes about restarting css animations), the class that governs animations
      let current = null;
      // deselect old (if not Home)
      if (j === oldIndex) {
        current = false;
      }
      // select new
      else if (j === selectedIndex) {
        current = true;
      }

      // restarting css animations kinda sux. see:
      //  https://medium.com/better-programming/how-to-restart-a-css-animation-with-javascript-and-what-is-the-dom-reflow-a86e8b6df00f
      // and:
      //  https://codepen.io/chriscoyier/pen/EyRroJ
      nl.setAttribute('aria-current', null);
      void nl.offsetWidth;
      nl.setAttribute('aria-current', current);
    });
  };

  //  - update page title when section changes
  const updateTitle = navLink => {
    const tokens = ['Code Refactory'];
    if (navLink) {
      tokens.push(navLink.text.trim());
    }
    document.title = tokens.join(' | ');
  };

  // attach behaviors

  //  - hamburger menu
  toggleBtn.addEventListener('click', () => toggleMenu());

  //  - nav links
  //     if not on the index page, hrefs are adjusted in the markup
  //     else, add behaviors
  navLinks.forEach((navLink, i) => {
    if (isIndexPage) {
      const index = navLinks.indexOf(navLink);
      navLink.addEventListener('click', e => {
        // console.log(`index ${index}, selectedIndex ${selectedIndex}`);
        if (index === selectedIndex) {
          return false;
        }
        if (needsScrollPolyfill) {
          e.preventDefault();
        }
        toggleMenu(false);
        navigate(index);
        if (needsScrollPolyfill) {
          moveTo(index);
        }
        updateTitle(navLink);
      });
    }
  });

  //  - logo
  //     if not on the index page, go there - this is just a regular link
  //     else, add behaviors
  if (isIndexPage) {
    logo.addEventListener('click', e => {
      e.preventDefault();
      const index = 0;
      if (index === selectedIndex) {
        return false;
      }
      navigate(index);
      moveTo(index);
      updateTitle(null);
      history.pushState(null, document.title, window.location.href.split('#')[0]);
    });
  }

  // if not on the index page, the rest of this doesn't matter
  if (!isIndexPage) {
    return;
  }

  //  - waypoints
  //    update nav as user scrolls through sections, 
  //    but don't push to history
  //    if the user is blowing past sections, don't bother animating
  sections.forEach((section, i) => {
    // set up reveals
    const revealables = section.querySelectorAll('[data-revealable]');
    if (revealables.length > 0) {
      revealables.forEach((revealable, j) => {
        revealable.style.transitionDelay = `${j * 0.15}s`;
      });
      section.classList.add(CLASSES.unrevealed);
    }

    // set variables
    const delay = 100;
    const offset = isScrollSnapCapable ? '10px' : '10vh'; // bigger scroll target for browsers where scroll-snap doesn't scroll perfectly to the panel
    let stDown, stUp;

    // set up waypoints
    //  - first one for when a section is just about completely in view
    const wp1 = new Waypoint({
      context: main,
      element: section,
      handler: direction => {
        // console.log(`${section.id} (${i}), wp1 ${direction}`);
        if (direction === 'down') {
          stDown = setTimeout(() => { navigate(i); }, delay);
        } else {
          if (stUp) {
            clearTimeout(stUp);
            stUp = undefined;
          }
        }
      },
      offset: offset
    });

    //  - next one for when a section is moving out of view
    const wp2 = new Waypoint({
      context: main,
      element: section,
      handler: direction => {
        // console.log(`${section.id} (${i}), wp2 ${direction}`);
        if (direction === 'down') {
          if (stDown) {
            clearTimeout(stDown);
            stDown = undefined;
          }
        } else {
          stUp = setTimeout(() => { navigate(i); }, delay);
        }
      },
      offset: `-${offset}`
    });

    //  - third one for reveals
    //    delay for home page if interstitial is present
    const revealDelay = i === 0
      ? (layout.classList.contains('setup-interstitial') ? 2000 : 200)
      : 1;
    const wp3 = new Waypoint({
      context: main,
      element: section,
      handler: direction => {
        setTimeout(() => section.classList.remove(CLASSES.unrevealed), revealDelay);
      },
      offset: offset
    });
  });

  //  - on load, default to Home, unless a valid hash is present
  const anchors = navLinks.map(navLink => navLink.getAttribute('href'));
  const linkMatch = anchors.indexOf(window.location.hash);
  if (linkMatch > -1) {
    navLinks[linkMatch].click();
  } else {
    logo.click();
  }

  //  - add keystroke handling so user can scroll with keyboard instead of mouse/touch
  hotkeys('up', (e, handler) => {
    e.preventDefault(); // Prevent the default refresh event under WINDOWS system
    navigatePrevious();
  });

  hotkeys('down', (e, handler) => {
    e.preventDefault(); // Prevent the default refresh event under WINDOWS system
    navigateNext();
  });
});

