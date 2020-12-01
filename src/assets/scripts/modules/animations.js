import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(CustomEase);
gsap.registerPlugin(MorphSVGPlugin);

// gears
const initGearsAnimation = () => {
  // define elements
  const gearBox = document.getElementById('gear-box');
  const gear1 = document.querySelector('.gear1');
  const gear2 = document.querySelector('.gear2');
  const gear3 = document.querySelector('.gear3');

  // build animation
  gsap.to(gear2, {
    translateZ: 0,
    ease: 'power4.out',
    duration: 0.75,
    delay: 0.25
  });

  gsap.to(gear3, {
    translateZ: 0,
    ease: 'power4.out',
    duration: 0.75,
    delay: 0.5
  });

  setTimeout(() => gearBox.setAttribute('data-moving', true), 1250);
};

// chat bubbles -> jigsaw pieces
const initJigsawAnimation = () => {
  // define elements
  const jigsawBox = document.getElementById('jigsaw-box');
  const pieces = jigsawBox.getElementsByClassName('icon-chat-bubble');

  // define variables
  const spinAnimationOpts = {
    duration: 0.75,
    ease: CustomEase.create('custom', 'M0,0 C0.005,0.018 0.02,-0.088 0.18,-0.088 0.201,-0.088 0.289,-0.09 0.304,-0.09 0.543,-0.09 0.347,0.867 0.736,0.976 0.822,1 0.818,1.001 1,1'),
    transformOrigin: 'center'
  };

  const morphAnimationOpts = {
    duration: 0.25,
    delay: 0.4,
    ease: 'elastic.out(1, 0.6)',
    transformOrigin: 'center',
    paused: true
  };

  // define helpers
  const partitionPaths = paths => {
    return Array.from(paths).reduce(
      (result, path) => {
        result[path.classList.contains('morph-from') ? 0 : 1].push(path);
        return result;
      },
      [[], []]
    );
  };

  const getFillColor = path => path.getAttribute('fill');

  const getTranslation = index => {
    const a = 38;
    const b = 62;
    const operands = [
      [-a, b],
      [-b, -a],
      [a, -b],
      [b, a]
    ];
    return { x: operands[index][0], y: operands[index][1] };
  };

  // build morph animations
  for (const [i, piece] of Array.from(pieces).entries()) {
    const paths = piece.getElementsByTagName('path');
    const [[fromSvg], [toSvg]] = partitionPaths(paths);

    let tween = gsap.to(fromSvg, {
      morphSVG: toSvg,
      fill: getFillColor(toSvg),
      rotation: i * 90,
      ...getTranslation(i),
      ...morphAnimationOpts
    });

    piece.addEventListener('tween.start', () => tween.play());
  }

  // choreograph full animation
  const spin = gsap.to(jigsawBox, {
    rotation: 360,
    ...spinAnimationOpts
  });
  Array.from(pieces).forEach((piece, i) => {
    piece.dispatchEvent(new CustomEvent('tween.start'));
  });
};

// monitor
const initMonitorAnimation = () => {
};

// init onload
document.addEventListener('DOMContentLoaded', () => {
  initGearsAnimation();
  initJigsawAnimation();
  // initMonitorAnimation();
});
