import createFocusTrap from 'focus-trap'

const SELECTORS = {
  nav: '.js-nav',
  toggleBtn: '.js-nav-toggle'
}

const CLASSES = {
  open: 'is-open'
}



document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const navLinks = Array.from(document.getElementsByClassName('nav__link'));
  const logo = document.querySelector('.header__logo');
  const main = document.getElementsByTagName('main')[0];

  // set flags
  let selectedIndex = -1; // CR logo (#home)

  // define behaviors
  const navigate = toIndex => {
    // update flags
    const oldIndex = selectedIndex;
    selectedIndex = toIndex;

    // update facing for each link
    navLinks.forEach((nl, j) => {
      let faceLeft;
      if (j == selectedIndex) {
        faceLeft = selectedIndex > oldIndex;
      } else {
        faceLeft = j > selectedIndex;
      }
      nl.setAttribute('data-face-left', faceLeft);

      // unset, then set (see notes about restarting css animations), the class that governs animations
      let current = null;
      // deselect old (if not Home)
      if (j == oldIndex) {
        current = false;
      }
      // select new
      else if (j == selectedIndex) {
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

  // attach behaviors to nav links
  navLinks.forEach((navLink, i) => {
    const index = navLinks.indexOf(navLink);
    navLink.addEventListener('click', e => {
      if (index == selectedIndex) {
        return false;
      }
      navigate(index);
    });
  });

  // attach behavior to logo
  logo.addEventListener('click', e => {
    e.preventDefault();
    const index = -1;
    if (index == selectedIndex) {
      return false;
    }
    navigate(index);
    history.pushState(null, document.title, window.location.href.split('#')[0]);
    main.scrollTo({ top: 0 });
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





class Navigation {
  constructor() {
    this.isOpen = false

    this.nav = document.querySelector(SELECTORS.nav)
    this.toggleBtn = this.nav.querySelector(SELECTORS.toggleBtn)
    this.focusTrap = createFocusTrap(this.nav)

    this.toggleBtn.addEventListener('click', () => this.toggleMenu())
  }

  toggleMenu(force) {
    this.isOpen = typeof force === 'boolean' ? force : !this.isOpen

    this.nav.classList.toggle(CLASSES.open, this.isOpen)
    this.toggleBtn.setAttribute('aria-expanded', String(this.isOpen))

    if (this.isOpen) {
      this.focusTrap.activate()
    } else {
      this.focusTrap.deactivate()
    }
  }
}

if (document.querySelector(SELECTORS.nav)) {
  new Navigation()
}
