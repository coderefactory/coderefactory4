import Hammer from 'hammerjs';
import hotkeys from 'hotkeys-js';
import lozad from 'lozad';

document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const body = document.body;
  const storyLayout = document.querySelector('.stories__layout');
  if (!storyLayout) {
    return; 
  }
  const stories = Array.from(storyLayout.getElementsByClassName('block--story'));
  const carousels = Array.from(storyLayout.getElementsByClassName('story-content__slides'));

  // define variables
  const classModalOpen = 'modal-open';

  // set flags
  let previewingPanel;
  let isPanelOpen = false;
  let pausePreviews = false;

  // define behaviors
  const previewStory = panel => {
    if (isPanelOpen || (previewingPanel === panel) || pausePreviews) {
      return;
    }
    previewingPanel = panel;
    storyLayout.setAttribute('data-preview', panel);
  };

  const clearPreviewStory = () => {
    if (isPanelOpen) {
      return;
    }
    // storyLayout.removeAttribute('data-preview');
    storyLayout.setAttribute('data-preview', 0);
  };

  const previewPrevious = () => {
    if (isPanelOpen || previewingPanel <= 0) {
      return;
    }
    stories[previewingPanel].dispatchEvent(new CustomEvent('mouseleave'));
    previewingPanel = previewingPanel - 1;
    stories[previewingPanel].dispatchEvent(new CustomEvent('mouseover'));
  };

  const previewNext = () => {
    if (isPanelOpen || previewingPanel >= stories.length - 1) {
      return;
    }
    stories[previewingPanel].dispatchEvent(new CustomEvent('mouseleave'));
    previewingPanel = previewingPanel + 1;
    stories[previewingPanel].dispatchEvent(new CustomEvent('mouseover'));
  };

  const openStory = (e, panelIndex, observer) => {
    isPanelOpen = true;
    storyLayout.setAttribute('data-open', panelIndex);
    body.classList.add(classModalOpen);

    // lazyload images
    observer.observe();
  };

  const closeStory = (e, carouselIndex) => {
    storyLayout.removeAttribute('data-open');
    carousels[carouselIndex].dispatchEvent(new CustomEvent('stories.reset'));
    isPanelOpen = false;
    body.classList.remove(classModalOpen);

    // Sometimes when the user clicks the close button, their cursor will be hovered 
    //  over another panel, which triggers a preview of that panel somewhat unexpectedly.
    // Keep the panel they just closed in "preview" state for a second, 
    //  so they aren't disoriented.
    // see https://coderefactory.atlassian.net/browse/CR-5
    pausePreviews = true;
    const _st = setTimeout(() => {
      pausePreviews = false;
      clearTimeout(_st);
    }, 1000);
  };

  const fixFocusScroll = el => {
    // fix bug where a focused button causes flexbox animation issues with previewing other stories
    const fix = e => e.target.blur();
    el.addEventListener('click', fix);
    el.addEventListener('contextmenu', fix);
  };

  // attach behaviors
  stories.forEach((story, i) => {
    // preview on hover
    // story.addEventListener('mouseleave', e => clearPreviewStory());
    storyLayout.addEventListener('mouseleave', e => previewStory(0));
    story.addEventListener('mouseover', e => previewStory(i));

    // set up lazyloading for this panel
    const storyImages = carousels[i].querySelectorAll('img');
    const observer = lozad(storyImages);

    // open
    const btnOpenStory = story.getElementsByClassName('open-story')[0];
    fixFocusScroll(btnOpenStory);
    btnOpenStory.addEventListener('click', e => openStory(e, i, observer));

    // close
    const btnCloseStory = story.getElementsByClassName('close-story')[0];
    fixFocusScroll(btnCloseStory);
    btnCloseStory.addEventListener('click', e => closeStory(e, i));
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
    };

    const gotoNext = () => {
      goto(activeSlide + 1);
    };

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
      progressIndicator.innerText = `slide ${slide + 1}`;
    }

    const reset = () => {
      carousel.scrollTop = 0;
      goto(0);
    };

    fixFocusScroll(btnPrev);
    fixFocusScroll(btnNext);

    // attach behaviors
    btnPrev.addEventListener('click', gotoPrev);
    btnNext.addEventListener('click', gotoNext);
    carousel.addEventListener('stories.reset', reset);

    // init
    goto(activeSlide);
  });

  // default preview to first story if nothing else has been previewed/opened
  stories[0].dispatchEvent(new CustomEvent('mouseover'));

  // add gesture handling
  if (document.querySelector('html').classList.contains('touchevents')) {
    const gestures = new Hammer(storyLayout);
    gestures.on('swipeleft', e => {
      previewNext();
    }).on('swiperight', e => {
      previewPrevious();
    });
  }

  // add keystroke handling so user can navigate with keyboard instead of mouse/touch
  hotkeys('left', (e, handler) => {
    e.preventDefault(); // Prevent the default refresh event under WINDOWS system
    previewPrevious();
  });

  hotkeys('right', (e, handler) => {
    e.preventDefault(); // Prevent the default refresh event under WINDOWS system
    previewNext();
  });

  // ESC closes a story
  hotkeys('esc', (e, handler) => {
    e.preventDefault(); // Prevent the default refresh event under WINDOWS system
    body.dispatchEvent(new CustomEvent('stories.reset'));
  });

  // reset the stories if the user has scrolled away
  // define a custom event here and attach to the body, 
  // so the nav module can reference it
  body.addEventListener('stories.reset', () => {
    carousels.forEach((carousel, i) => {
      carousel.dispatchEvent(new CustomEvent('stories.reset'));
    });
    storyLayout.removeAttribute('data-open');
    isPanelOpen = false;
    body.classList.remove(classModalOpen);
  });
});
