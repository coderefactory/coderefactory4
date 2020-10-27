// feature detection
import './modernizr';

// run a feature check for CSS custom properties, which Modernizr doesn't currently offer
const supportsCustomProperties = window.CSS && CSS.supports('color', 'var(--primary)');
document.querySelector('html').classList.add((supportsCustomProperties ? 'cssvariables' : 'no-cssvariables'));

// polyfills
import './ie-polyfills';
import 'core-js/features/array/from';
import 'core-js/features/array/for-each';
import 'core-js/features/object/assign';
import 'focus-visible';

// internal modules
//  - opening interstitial
import './modules/interstitial';
//  - navigation
import './modules/nav';
import './modules/transitions';
//  - panel-specific
import './modules/stories';
import './modules/about';
import './modules/contact';
