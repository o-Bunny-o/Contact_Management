const { Given, When, Then } = require('@cucumber/cucumber'); // imports cucumber functions
const assert = require('assert'); // used 4 assertions
const { Builder, By, until } = require('selenium-webdriver'); // imports selenium functions
const chrome = require('selenium-webdriver/chrome'); // used 4 chrome options

// use global.driver so it can be accessed in hooks
global.driver = null;

Given('that i am on the contacts management page', async function () {
  const options = new chrome.Options();
  options.addArguments('--headless'); // enable headless mode
  global.driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  await global.driver.get('http://localhost:3000');
});

Given('that a contact exists in the contacts list', async function () {
  if (!global.driver) {
    const options = new chrome.Options();
    options.addArguments('--headless');
    global.driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await global.driver.get('http://localhost:3000');
  }
  // check if a contact with lastname "Doe" exists
  const contacts = await global.driver.findElements(By.xpath('//td[text()="Doe"]'));
  if (contacts.length === 0) {
    // if not, fill the form with valid data & click "Add"
    await global.driver.findElement(By.id('lastname')).sendKeys('Doe');
    await global.driver.findElement(By.id('firstname')).sendKeys('John');
    await global.driver.findElement(By.id('phone')).sendKeys('1234567890');
    await global.driver.findElement(By.id('email')).sendKeys('john.doe@example.com');
    await global.driver.findElement(By.id('submit-button')).click();
    // wait until the contact appears in the list
    await global.driver.wait(until.elementLocated(By.xpath('//td[text()="Doe"]')), 5000);
  }
});

When('i fill up the form with valid data', async function () {
  await global.driver.findElement(By.id('lastname')).clear();
  await global.driver.findElement(By.id('lastname')).sendKeys('Doe');
  await global.driver.findElement(By.id('firstname')).clear();
  await global.driver.findElement(By.id('firstname')).sendKeys('John');
  await global.driver.findElement(By.id('phone')).clear();
  await global.driver.findElement(By.id('phone')).sendKeys('1234567890');
  await global.driver.findElement(By.id('email')).clear();
  await global.driver.findElement(By.id('email')).sendKeys('john.doe@example.com');
});

When('i click on {string}', async function (buttonText) {
  const button = await global.driver.findElement(By.xpath(`//button[text()="${buttonText}"]`));
  await button.click();
});

When('i click on the {string} button for that contact', async function (buttonText) {
  // locate the row that contains the contact with lastname "Doe"
  const row = await global.driver.findElement(By.xpath('//td[text()="Doe"]/parent::tr'));
  const button = await row.findElement(By.xpath(`.//button[text()="${buttonText}"]`));
  await button.click();
});

When('i change the contact data', async function () {
  const firstnameField = await global.driver.findElement(By.id('firstname'));
  await firstnameField.clear();
  await firstnameField.sendKeys('Jane');
});

When('i confirm the deletion', async function () {
  await global.driver.switchTo().alert().accept();
});

Then('i see a new contact on the list', async function () {
  await global.driver.wait(until.elementLocated(By.xpath('//td[text()="Doe"]')), 5000);
  const contactElement = await global.driver.findElement(By.xpath('//td[text()="Doe"]'));
  const text = await contactElement.getText();
  assert.strictEqual(text, 'Doe');
});

Then('i see the updated contact information on the list', async function () {
  await global.driver.wait(until.elementLocated(By.xpath('//td[text()="Jane"]')), 5000);
  const contactElement = await global.driver.findElement(By.xpath('//td[text()="Jane"]'));
  const text = await contactElement.getText();
  assert.strictEqual(text, 'Jane');
});

Then('i no longer see the contact on the list', { timeout: 30000 }, async function () {
  // wait up to 15 seconds for the element to disappear
  await global.driver.wait(async () => {
    const contacts = await global.driver.findElements(By.xpath('//td[text()="Doe"]'));
    console.log('waiting for deletion, found count:', contacts.length);
    return contacts.length === 0;
  }, 15000);

  // reload the page to verify the deletion persists
  await global.driver.navigate().refresh();

  // wait up to 10 seconds after refresh for the element to remain absent
  await global.driver.wait(async () => {
    const contacts = await global.driver.findElements(By.xpath('//td[text()="Doe"]'));
    console.log('after refresh, found count:', contacts.length);
    return contacts.length === 0;
  }, 10000);

  const contacts = await global.driver.findElements(By.xpath('//td[text()="Doe"]'));
  assert.strictEqual(contacts.length, 0);
});
