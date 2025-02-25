const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let driver;

// opens the contacts page in a browser
Given('that i am on the contacts management page', async function () {
  driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
  await driver.get('http://localhost:3000');
});

// fills the form fields with sample valid data
When('i fill up the form with valid data', async function () {
  await driver.findElement(By.id('lastname')).sendKeys('Doe');
  await driver.findElement(By.id('firstname')).sendKeys('John');
  await driver.findElement(By.id('phone')).sendKeys('1234567890');
  await driver.findElement(By.id('email')).sendKeys('john.doe@example.com');
});

// clicks on a button with the given text
When('i click on {string}', async function (buttonText) {
  const button = await driver.findElement(By.xpath(`//button[text()="${buttonText}"]`));
  await button.click();
});

// changes the form data 4 modification
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
Then('i no longer see the contact on the list', async function () {
  const contacts = await driver.findElements(By.xpath('//td[text()="Doe"]'));
  assert.strictEqual(contacts.length, 0);
  await driver.quit();
});
