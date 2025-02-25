const { devices } = require('@playwright/test');

module.exports = {
  // read tests from the 'tests/e2e' folder only
  testDir: 'tests/e2e',

  // set a global setup file that empties contacts.json
  globalSetup: require.resolve('./global-setup.js'),

  // default 30-second timeout
  timeout: 30000,

  // run all tests headless
  use: {
    headless: true
  },

};
