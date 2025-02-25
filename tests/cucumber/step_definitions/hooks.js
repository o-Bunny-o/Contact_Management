const { After } = require('@cucumber/cucumber');

After(async function () {
  // if the global driver exists, quit it and reset
  if (global.driver) {
    await global.driver.quit();
    global.driver = null;
  }
});
