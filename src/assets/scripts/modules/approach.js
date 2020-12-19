import 'waypoints/lib/noframework.waypoints';

document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const main = document.getElementsByTagName('main')[0];
  const section = document.getElementById('approach');
  if (!section) {
    return; 
  }

  // gauge animations use some js
  const gauges = Array.from(section.getElementsByClassName('gauge'));
  gauges.forEach((gauge, i) => {
    const span = gauge.querySelector('span');
    const ticks = 80;
    let tick = 1;
    const incrementCallback = () => {
      const increment = () => {
        gauge.style.setProperty('--gauge-hue-rotate', `${tick - ticks}deg`);
        span.textContent = `${100 + (tick - ticks)}`;
        tick++;
        if (tick > ticks) {
          clearInterval(si);
        }
      };
      const si = setInterval(increment, 5);
    };
    gauge.addEventListener('gauge.increment', () => { setTimeout(incrementCallback, 800); });
  });

  // stars animation triggered by js
  const stars = section.querySelector('.stars');
  const convertStars = () => {
    stars.classList.add('converted');
  };
  stars.addEventListener('stars.convert', () => { setTimeout(convertStars, 800); });

  // set up for animation
  const wpApproach = new Waypoint({
    context: main,
    element: section,
    handler: direction => {
      // css-driven animations
      section.classList.add('animated');

      // js-driven animations
      gauges.forEach((gauge, i) => {
        gauge.dispatchEvent(new CustomEvent('gauge.increment'));
      });
      stars.dispatchEvent(new CustomEvent('stars.convert'));

      // destory this instance so changes persist for this page load
      wpApproach.destroy();
    },
    offset: '10vh'
  });
});
