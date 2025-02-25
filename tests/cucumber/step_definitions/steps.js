const { Given, When, Then } = require('@cucumber/cucumber'); // imports cucumber functions
const assert = require('assert'); 
const { Builder, By, until } = require('selenium-webdriver'); // imports selenium functions
const chrome = require('selenium-webdriver/chrome'); // is used 4 chrome options

let driver;

// opens the contacts page in a browser
Given('that i am on the contacts management page', async function () {
  const options = new chrome.Options();
  options.addArguments('--headless'); // use addArguments to enable headless mode
  driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  await driver.get('http://localhost:3000');
});

// ensures that a contact exists in the contacts list
Given('that a contact exists in the contacts list', async function () {
  // if the browser isn’t open yet, open it
  if (!driver) {
    const options = new chrome.Options();
    options.addArguments('--headless');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await driver.get('http://localhost:3000');
  }
  // check if a contact with lastname "Doe" exists
  const contacts = await driver.findElements(By.xpath('//td[text()="Doe"]'));
  if (contacts.length === 0) {
    // if not, fill the form with valid data & click "Add"
    await driver.findElement(By.id('lastname')).sendKeys('Doe');
    await driver.findElement(By.id('firstname')).sendKeys('John');
    await driver.findElement(By.id('phone')).sendKeys('1234567890');
    await driver.findElement(By.id('email')).sendKeys('john.doe@example.com');
    await driver.findElement(By.id('submit-button')).click();
    // wait until the contact appears in the list
    await driver.wait(until.elementLocated(By.xpath('//td[text()="Doe"]')), 5000);
  }
});

// fills the form fields with sample valid data
When('i fill up the form with valid data', async function () {
  await driver.findElement(By.id('lastname')).clear();
  await driver.findElement(By.id('lastname')).sendKeys('Doe');
  await driver.findElement(By.id('firstname')).clear();
  await driver.findElement(By.id('firstname')).sendKeys('John');
  await driver.findElement(By.id('phone')).clear();
  await driver.findElement(By.id('phone')).sendKeys('1234567890');
  await driver.findElement(By.id('email')).clear();
  await driver.findElement(By.id('email')).sendKeys('john.doe@example.com');
});

// clicks on a button with the given text
When('i click on {string}', async function (buttonText) {
  const button = await driver.findElement(By.xpath(`//button[text()="${buttonText}"]`));
  await button.click();
});

// clicks on the {string} button for that contact (modify & delete actions)
When('i click on the {string} button for that contact', async function (buttonText) {
  // locate the row that contains the contact with lastname "Doe"
  const row = await driver.findElement(By.xpath('//td[text()="Doe"]/parent::tr'));
  const button = await row.findElement(By.xpath(`.//button[text()="${buttonText}"]`));
  await button.click();
});

// changes the contact data 4 modification
When('i change the contact data', async function () {
  const firstnameField = await driver.findElement(By.id('firstname'));
  await firstnameField.clear();
  await firstnameField.sendKeys('Jane');
});

// confirms the deletion in the dialog
When('i confirm the deletion', async function () {
  await driver.switchTo().alert().accept();
});

// verifies that a new contact is added to the list
Then('i see a new contact on the list', async function () {
  await driver.wait(until.elementLocated(By.xpath('//td[text()="Doe"]')), 5000);
  const contactElement = await driver.findElement(By.xpath('//td[text()="Doe"]'));
  const text = await contactElement.getText();
  assert.strictEqual(text, 'Doe');
});

// verifies that the contact information is updated
Then('i see the updated contact information on the list', async function () {
  await driver.wait(until.elementLocated(By.xpath('//td[text()="Jane"]')), 5000);
  const contactElement = await driver.findElement(By.xpath('//td[text()="Jane"]'));
  const text = await contactElement.getText();
  assert.strictEqual(text, 'Jane');
});

// verifies that the contact has been removed from the list
Then('i no longer see the contact on the list', { timeout: 15000 }, async function () {
  // wait up to 10 seconds for the element to disappear
  await driver.wait(async () => {
    const contacts = await driver.findElements(By.xpath('//td[text()="Doe"]'));
    return contacts.length === 0;
  }, 10000);

  // reload the page to verify the deletion persists
  await driver.navigate().refresh();

  // wait a bit for the page to load after refresh
  await driver.wait(async () => {
    const contacts = await driver.findElements(By.xpath('//td[text()="Doe"]'));
    return contacts.length === 0;
  }, 5000);

  // final check: ensure no contact with "Doe" exists
  const contacts = await driver.findElements(By.xpath('//td[text()="Doe"]'));
  assert.strictEqual(contacts.length, 0);
  await driver.quit();
});



