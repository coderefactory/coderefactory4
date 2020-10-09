// feature detection
import './modernizr';

// run a feature check for CSS custom properties that Modernizr doesn't have
const supportsCustomProperties = window.CSS && CSS.supports('color', 'var(--primary)');
document.querySelector('html').classList.add((supportsCustomProperties ? 'cssvariables' : 'no-cssvariables'));

// focus visible polyfill
import 'focus-visible';

// internal modules
import './modules/nav';
import './modules/transitions';
import './modules/interstitial';
import './modules/stories';
import './modules/contact';
