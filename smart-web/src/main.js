import environment from './environment';
import {PLATFORM} from 'aurelia-pal';
import 'babel-polyfill';
//import * as Bluebird from 'bluebird';
import authConfig from './authConfig';

// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
//Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }
  aurelia.use.globalResources(PLATFORM.moduleName('aurelia-authentication/authFilterValueConverter'));
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-api'), configure => {
    configure
      .registerEndpoint('auth', 'http://localhost:5000')
      .registerEndpoint('protected-api', 'http://localhost:5001')
      .registerEndpoint('public-api', 'http://myapi.org/public-api');
  });
  /* configure aurelia-authentication */
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-authentication'), baseConfig => {
    baseConfig.configure(authConfig);
  });

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
