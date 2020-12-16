import 'waypoints/lib/noframework.waypoints';

document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const main = document.getElementsByTagName('main')[0];
  const section = document.getElementById('approach');
  if (!section) {
    return; 
  }

  // set up for animation
  const wpApproach = new Waypoint({
    context: main,
    element: section,
    handler: direction => {
      section.classList.add('animated');
      wpApproach.destroy();
    },
    offset: '10vh'
  });
});
