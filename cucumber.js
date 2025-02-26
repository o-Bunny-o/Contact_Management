// this file tells cucumber where to look 4 feature files & step definitions
module.exports = {
    default: "--require tests/cucumber/step_definitions/**/*.js --format json:./cucumber-report.json tests/cucumber/features/**/*.feature --publish-quiet"
  };
  