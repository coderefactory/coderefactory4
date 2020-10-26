import hotkeys from 'hotkeys-js';

document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const body = document.body;
  const layout = document.querySelector('.about__layout');
  const staffMembers = Array.from(layout.getElementsByClassName('block--staff'));
  if (!layout) {
    return; 
  }
  const btnCloseBio = layout.querySelector('.close-story');

  // define behaviors for viewing bios (at certain smaller sizes)
  const openBio = e => {
    layout.setAttribute('data-open', true);
    const bio = e.currentTarget;
    const _st = setTimeout(() => {
      bio.classList.add('active');
    }, 200);
  };

  const closeBio = e => {
    layout.removeAttribute('data-open');
    staffMembers.forEach((staff, i) => {
      staff.classList.remove('active');
    });
  };

  // attach behaviors for viewing bios
  staffMembers.forEach((staff, i) => {
    staff.addEventListener('click', openBio);
  });
  btnCloseBio.addEventListener('click', closeBio);

  // ESC closes a bio
  hotkeys('esc', (e, handler) => {
    e.preventDefault(); // Prevent the default refresh event under WINDOWS system
    body.dispatchEvent(new Event('about.reset'));
  });

  // reset the stories if the user has scrolled away
  // define a custom event here and attach to the body, 
  // so the nav module can reference it
  body.addEventListener('about.reset', closeBio);
});
