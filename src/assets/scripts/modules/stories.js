document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const storyLayout = document.querySelector('.stories__layout');
  const stories = Array.from(storyLayout.getElementsByClassName('block--story'));

  // set flags
  let isPanelOpen = false;

  // define behaviors
  const previewStory = panel => {
    if (isPanelOpen) {
      return;
    }
    storyLayout.setAttribute('data-preview', panel);
  };

  const clearPreviewStory = () => {
    if (isPanelOpen) {
      return;
    }
    storyLayout.removeAttribute('data-preview');
  };

  const openStory = (e, panel) => {
    e.target.blur();
    isPanelOpen = true;
    storyLayout.setAttribute('data-open', panel);
  };

  const closeStory = (e, panel) => {
    e.target.blur();
    storyLayout.removeAttribute('data-open');
    isPanelOpen = false;
  };

  // attach behaviors
  stories.forEach((story, i) => {
    // preview on hover
    story.addEventListener('mouseover', e => previewStory(i + 1));
    story.addEventListener('mouseout', e => clearPreviewStory());
    storyLayout.addEventListener('mouseout', e => previewStory(1));

    // open
    story.getElementsByClassName('open-story')[0].addEventListener('click', e => openStory(e, (i + 1)));

    // close
    story.getElementsByClassName('close-story')[0].addEventListener('click', e => closeStory(e, (i + 1)));
  });

  // default preview to first story if nothing else has been previewed/opened
  stories[0].dispatchEvent(new Event('mouseover'));






  // const root = document.body.style;
  // // console.log(root);
  // const main = document.getElementsByTagName('main')[0];
  // let mainH = main.scrollHeight;

  // // define scroll event
  // const scroll = () => {
  //   // root.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
  //   // console.log(`${window.pageYOffset}, ${document.body.offsetHeight}, ${window.innerHeight}`);
  //   root.setProperty('--scroll', main.scrollTop / mainH);
  //   // console.log(`${main.scrollTop}, ${main.scrollHeight}`);
  // };

  // // attach
  // main.addEventListener('scroll', scroll, false);

  // // initialize
  // main.dispatchEvent(new Event('scroll'));
});
