document.addEventListener('DOMContentLoaded', () => {
  const root = document.body.style;
  // console.log(root);
  const main = document.getElementsByTagName('main')[0];
  let mainH = main.scrollHeight;

  // define scroll event
  const scroll = () => {
    // root.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
    // console.log(`${window.pageYOffset}, ${document.body.offsetHeight}, ${window.innerHeight}`);
    root.setProperty('--scroll', main.scrollTop / mainH);
    // console.log(`${main.scrollTop}, ${mainH}`);
  };

  // attach
  main.addEventListener('scroll', scroll, false);

  // initialize
  main.dispatchEvent(new Event('scroll'));
});


// const SELECTORS = {
//   sections: 'section'
// }

// const CLASSES = {
//   transitioning: 'transitioning'
// }

// class Transitions {
//   constructor() {
//     this.sections = document.querySelector(SELECTORS.sections);
//     // this.toggleBtn = this.nav.querySelector(SELECTORS.toggleBtn)
//     // this.focusTrap = createFocusTrap(this.nav)

//     // this.toggleBtn.addEventListener('click', () => this.toggleMenu())

//     this.last = null;
//     this.current = 1;
//   }

//   switchTo(sectionIndex) {
//     // validate
//     if (sectionIndex < 1 || sectionIndex > this.sections.length) {
//       return;
//     }

//     // update pointers and class names
//     //  - earlier slide no longer involved
//     this.sections[this.last].classList.remove(CLASSES.transitioning);
//     //  - transitioning AWAY from this slide
//     this.last = this.current;
//     this.sections[this.last].classList.add(CLASSES.transitioning);
//     //  - transitioning TO from this slide
//     this.current = sectionIndex;
//     this.sections[this.current].classList.add(CLASSES.transitioning);
//   }

//   // toggleMenu(force) {
//   //   this.isOpen = typeof force === 'boolean' ? force : !this.isOpen

//   //   this.nav.classList.toggle(CLASSES.open, this.isOpen)
//   //   this.toggleBtn.setAttribute('aria-expanded', String(this.isOpen))

//   //   if (this.isOpen) {
//   //     this.focusTrap.activate()
//   //   } else {
//   //     this.focusTrap.deactivate()
//   //   }
//   // }
// }

// if (document.querySelector(SELECTORS.sections)) {
//   new Transitions()
// }
