import createFocusTrap from 'focus-trap';
import 'waypoints/lib/noframework.waypoints';

const SELECTORS = {
  nav: '.js-nav',
  toggleBtn: '.js-nav-toggle'
}

const CLASSES = {
  open: 'is-open'
}

// class Navigation {
//   constructor() {
//     this.isOpen = false;

//     this.nav = document.querySelector(SELECTORS.nav);
//     this.toggleBtn = this.nav.querySelector(SELECTORS.toggleBtn);
//     this.focusTrap = createFocusTrap(this.nav);

//     this.toggleBtn.addEventListener('click', () => this.toggleMenu());
//   }

//   toggleMenu(force) {
//     this.isOpen = typeof force === 'boolean' ? force : !this.isOpen;
//     debugger;
//     this.nav.classList.toggle(CLASSES.open, this.isOpen);
//     this.toggleBtn.setAttribute('aria-expanded', String(this.isOpen));

//     if (this.isOpen) {
//       this.focusTrap.activate();
//     } else {
//       this.focusTrap.deactivate();
//       // this.nav.classList.toggle(CLASSES.open, this.isOpen);
//     }
//   }
// }

// if (document.querySelector(SELECTORS.nav)) {
//   new Navigation();
// }




document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const nav = document.querySelector(SELECTORS.nav);
  const navLinks = Array.from(document.getElementsByClassName('nav__link'));
  const logo = document.querySelector('.header__logo');
  const toggleBtn = document.querySelector(SELECTORS.toggleBtn);
  const main = document.getElementsByTagName('main')[0];
  const sections = Array.from(document.getElementsByTagName('section'));

  // set flags
  let selectedIndex = 0; // CR logo (#home)
  let isOpen = false;

  // focus trap
  const focusTrap = createFocusTrap(nav, {
    returnFocusOnDeactivate: false
  });

  // define behaviors
  const toggleMenu = force => {
    isOpen = typeof force === 'boolean' ? force : !isOpen;

    if (isOpen) {
      focusTrap.activate();
    } else {
      focusTrap.deactivate();
    }

    nav.classList.toggle(CLASSES.open, isOpen);
    console.log(`force ${String(force)}, isOpen ${isOpen}, nav.classList ${nav.classList}`);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  }

  const navigate = toIndex => {
    if (toIndex === selectedIndex) {
      return;
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
  }

  const updateTitle = navLink => {
    const tokens = ['Code Refactory'];
    if (navLink) {
      tokens.push(navLink.text.trim());
    }
    document.title = tokens.join(' | ');
  }

  // attach behavior to hamburger menu
  toggleBtn.addEventListener('click', () => toggleMenu());

  // attach behaviors to nav links
  navLinks.forEach((navLink, i) => {
    const index = navLinks.indexOf(navLink);
    navLink.addEventListener('click', e => {
      console.log(`index ${index}, selectedIndex ${selectedIndex}`);
      if (index === selectedIndex) {
        return false;
      }
      toggleMenu(false);
      navigate(index);
      updateTitle(navLink);
    });
  });

  // attach behavior to logo
  logo.addEventListener('click', e => {
    e.preventDefault();
    const index = 0;
    if (index === selectedIndex) {
      return false;
    }
    navigate(index);
    updateTitle(null);
    history.pushState(null, document.title, window.location.href.split('#')[0]);
    main.scrollTo({ top: 0 });
  });

  // waypoints: update nav as user scrolls through sections, 
  // but don't push to history
  // if the user is blowing past sections, don't bother animating
  sections.forEach((section, i) => {
    const delay = 200;
    const offset = 10;
    let stDown, stUp;

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
      offset: -offset
    });
  });

  // on load, default to Home, unless a valid hash is present
  const anchors = navLinks.map(navLink => navLink.getAttribute('href'));
  const linkMatch = anchors.indexOf(window.location.hash);
  if (linkMatch > -1) {
    navLinks[linkMatch].click();
  } else {
    logo.click();
  }
});

