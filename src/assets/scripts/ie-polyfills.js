// polyfill for Event constructor
// source: https://stackoverflow.com/a/26596324
(function () {
  if ( typeof window.CustomEvent === "function" ) return false; //If not IE

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

// polyfill for :focus-within
// source: https://gist.github.com/aFarkas/a7e0d85450f323d5e164
(function(window, document){
  'use strict';
  var slice = [].slice;
  var removeClass = function(elem){
    elem.classList.remove('focus-within');
  };
  var update = (function(){
    var running, last;
    var action = function(){
      var element = document.activeElement;
      running = false;
      if(last !== element){
        last = element;
        slice.call(document.getElementsByClassName('focus-within')).forEach(removeClass);
        while(element && element.classList){
          element.classList.add('focus-within');
          element = element.parentNode;
        }
      }
    };
    return function(){
      if(!running){
        requestAnimationFrame(action);
        running = true;
      }
    };
  })();
  document.addEventListener('focus', update, true);
  document.addEventListener('blur', update, true);
  update();
})(window, document);