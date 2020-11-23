import { gsap } from 'gsap';
// import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
// import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// gsap.registerPlugin(MorphSVGPlugin, MotionPathPlugin);

document.addEventListener('DOMContentLoaded', () => {
  // const root = document.body.style;
  // // console.log(root);
  // const main = document.getElementsByTagName('main')[0];
  // let mainH = main.scrollHeight;

  const box = document.getElementById('gear-box');
  const gear1 = document.querySelector('.gear1');
  const gear2 = document.querySelector('.gear2');
  const gear3 = document.querySelector('.gear3');

  // // define scroll event
  // const scroll = () => {
  //   // root.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
  //   // console.log(`${window.pageYOffset}, ${document.body.offsetHeight}, ${window.innerHeight}`);
  //   root.setProperty('--scroll', main.scrollTop / mainH);
  //   // console.log(`${main.scrollTop}, ${mainH}`);
  // };

  // // attach
  // main.addEventListener('scroll', scroll, false);

  // // initialize
  // main.dispatchEvent(new CustomEvent('scroll'));

  // gsap.set(box, {perspective: '100vmin'});
  return;

  gsap.to(gear2, {
    translateZ: 0,
    // opacity: 1,
    duration: 0.75
  });

  gsap.to(gear3, {
    translateZ: 0,
    // opacity: 1,
    duration: 0.75,
    delay: 0.25
  });

  setTimeout(() => box.setAttribute('data-moving', true), 1250);

});
