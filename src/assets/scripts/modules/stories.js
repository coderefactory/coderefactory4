document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const storyLayout = document.querySelector('.stories__layout');
  const stories = Array.from(storyLayout.getElementsByClassName('block--story'));
  const carousels = Array.from(storyLayout.getElementsByClassName('story-content__slides'));

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

  carousels.forEach((carousel, i) => {
    // get elements
    const slides = Array.from(carousel.getElementsByTagName('li'));
    const progressIndicator = carousel.querySelector('.progress-indicator span');
    const btnPrev = carousel.querySelector('.prev-slide');
    const btnNext = carousel.querySelector('.next-slide');

    // set variables
    const coefficient = 1/slides.length;
    const activeClass = 'active';

    // set flags
    let activeSlide = 0;

    // define behaviors
    const gotoPrev = () => {
      goto(activeSlide - 1);
    }

    const gotoNext = () => {
      goto(activeSlide + 1);
    }

    const goto = slide => {
      // validate
      if ((slide < 0) || slide >= slides.length) {
        return false;
      }

      // previous button
      if (slide === 0) {
        btnPrev.setAttribute('disabled', 'disabled');
      } else {
        btnPrev.removeAttribute('disabled');
      }

      // next button
      if (slide === slides.length - 1) {
        btnNext.setAttribute('disabled', 'disabled');
      } else {
        btnNext.removeAttribute('disabled');
      }

      // slide transition
      slides[activeSlide].classList.remove(activeClass);
      activeSlide = slide;
      slides[activeSlide].classList.add(activeClass);

      // progress indicator transition
      progressIndicator.style.width = `${(slide + 1) * coefficient * 100}%`;
    }

    // attach behaviors
    btnPrev.addEventListener('click', gotoPrev);
    btnNext.addEventListener('click', gotoNext);

    // init
    goto(activeSlide);
  });

  // default preview to first story if nothing else has been previewed/opened
  stories[0].dispatchEvent(new Event('mouseover'));

});
