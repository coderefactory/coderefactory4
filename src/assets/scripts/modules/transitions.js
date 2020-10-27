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
  main.dispatchEvent(new CustomEvent('scroll'));
});
