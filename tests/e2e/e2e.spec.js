const { test, expect } = require('@playwright/test');

test.describe('Contacts Manager E2E tests', () => {

  test('add a contact', async ({ page }) => {
    // navigate to the contacts management page
    await page.goto('http://localhost:3000');
    
    // fill the form with contact data
    await page.fill('#lastname', 'Doe');
    await page.fill('#firstname', 'John');
    await page.fill('#phone', '1234567890');
    await page.fill('#email', 'john.doe@example.com');
    
    // click the add button
    await page.click('#submit-button');
    
    // wait for the new contact to appear in the table; adjust selector as needed
    await page.waitForSelector('td:has-text("Doe")', { timeout: 10000 });
    
    // retrieve and verify the lastname cell
    const lastname = await page.locator('td:has-text("Doe")').first().textContent();
    expect(lastname).toBe('Doe');
    
    await page.screenshot({ path: 'screenshots/add-contact.png' });
  });

  test('modify a contact', async ({ page }) => {
    // navigate to the contacts management page
    await page.goto('http://localhost:3000');
    
    // locate the table row that contains the contact with lastname "Doe"
    const row = await page.locator('tr:has(td:has-text("Doe"))').first();
    // click on the "Modify" button within that row (adjust selector if needed)
    await row.locator('button:has-text("Modify")').click();
    
    // update the first name to "Jane"
    await page.fill('#firstname', 'Jane');
    
    // click the save button (if same id as add, ensure the form submits the update)
    await page.click('#submit-button');
    
    // wait for the updated contact to appear with the new first name
    await page.waitForSelector('td:has-text("Jane")', { timeout: 10000 });
    
    const firstname = await page.locator('td:has-text("Jane")').first().textContent();
    expect(firstname).toBe('Jane');
    
    await page.screenshot({ path: 'screenshots/modify-contact.png' });
  });

  test('delete a contact', async ({ page }) => {
    // navigate to the contacts management page
    await page.goto('http://localhost:3000');
    
    // add a unique contact to delete
    const uniqueLastname = 'DoeDelete';
    await page.fill('#lastname', uniqueLastname);
    await page.fill('#firstname', 'John');
    await page.fill('#phone', '1234567890');
    await page.fill('#email', 'john.doe@example.com');
    await page.click('#submit-button');
    
    // wait for the unique contact to appear in a table row
    await page.waitForSelector(`tr:has(td:has-text("${uniqueLastname}"))`, { timeout: 10000 });
    
    // locate the table row that contains the unique contact
    const row = await page.locator(`tr:has(td:has-text("${uniqueLastname}"))`).first();
    // click the "Delete" button in that row
    await row.locator('button:has-text("Delete")').click();
    
    // if a confirmation dialog appears, accept it
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    
    // wait a few seconds to allow deletion to process
    await page.waitForTimeout(3000);
    
    // reload the page to verify the deletion persists
    await page.reload();
    
    // wait until the first matching row is detached
    await page.locator(`tr:has(td:has-text("${uniqueLastname}"))`).first().waitFor({ state: 'detached', timeout: 10000 });
    
    // verify that no rows matching the unique contact are present
    const rowCount = await page.locator(`tr:has(td:has-text("${uniqueLastname}"))`).count();
    expect(rowCount).toBe(0);
    
    await page.screenshot({ path: 'screenshots/delete-contact.png' });
  });
  
});
