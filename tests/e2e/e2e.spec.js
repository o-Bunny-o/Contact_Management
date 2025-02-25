const { test, expect } = require('@playwright/test');

test('add a contact', async ({ page }) => {
  // adding a new contact
  await page.goto('http://localhost:3000');
  await page.fill('#lastname', 'Doe');
  await page.fill('#firstname', 'John');
  await page.fill('#phone', '1234567890');
  await page.fill('#email', 'john.doe@example.com');
  await page.click('#submit-button');
  // wait 4 the contact to appear in the table
  const lastname = await page.locator('td').first().textContent();
  expect(lastname).toBe('Doe');
  await page.screenshot({ path: 'screenshots/add-contact.png' });
});

test('modify a contact', async ({ page }) => {
  // modifying an existing contact
  await page.goto('http://localhost:3000');
  // assume the first contact is the one 2 modify
  await page.click('text=Modify');
  // change firstname
  await page.fill('#firstname', 'Jane');
  await page.click('#submit-button');
  // verify update
  const firstname = await page.locator('td').nth(1).textContent();
  expect(firstname).toBe('Jane');
  await page.screenshot({ path: 'screenshots/modify-contact.png' });
});

test('delete a contact', async ({ page }) => {
  // deleting a contact
  await page.goto('http://localhost:3000');
  // click on delete button with confirmation
  page.once('dialog', async dialog => {
    await dialog.accept();
  });
  await page.click('text=Delete');
  // verify deletion by checking that the contact is no longer in the table
  const contacts = await page.locator('td').allTextContents();
  expect(contacts).not.toContain('Doe');
  await page.screenshot({ path: 'screenshots/delete-contact.png' });
});
