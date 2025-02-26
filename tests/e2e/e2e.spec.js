const { test, expect } = require('@playwright/test');

test.describe('Contacts Manager E2E tests (API deletion)', () => {

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
    
    // wait for the new contact to appear in the table
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
    // click on the "Modify" button within that row
    await row.locator('button:has-text("Modify")').click();
    
    // update the first name to "Jane"
    await page.fill('#firstname', 'Jane');
    
    // click the save button
    await page.click('#submit-button');
    
    // wait for the updated contact to appear with the new first name
    await page.waitForSelector('td:has-text("Jane")', { timeout: 10000 });
    
    const firstname = await page.locator('td:has-text("Jane")').first().textContent();
    expect(firstname).toBe('Jane');
    
    await page.screenshot({ path: 'screenshots/modify-contact.png' });
  });

  test('delete a contact via API', async ({ page, request }) => {
    // navigate to the contacts management page
    await page.goto('http://localhost:3000');
  
    // use a truly unique lastname so we can identify this contact later
    const uniqueLastname = `DoeDelete-${Date.now()}`;
  
    // add the contact using the UI
    await page.fill('#lastname', uniqueLastname);
    await page.fill('#firstname', 'John');
    await page.fill('#phone', '1234567890');
    await page.fill('#email', 'john.doe@example.com');
    await page.click('#submit-button');
  
    // wait for the contact to appear in the table
    await page.waitForSelector(`tr:has-text("${uniqueLastname}")`, { timeout: 10000 });
  
    // use the API to fetch the current contacts
    const response = await request.get('http://localhost:3000/api/contacts');
    const contacts = await response.json();
    // find the newly added contact by its unique lastname
    const contactToDelete = contacts.find(contact => contact.lastname === uniqueLastname);
    expect(contactToDelete).toBeDefined();
  
    console.log('Deleting contact with id:', contactToDelete.id);
  
    // call DELETE on the contact using its real id
    const deleteResponse = await request.delete(`http://localhost:3000/api/contacts/${contactToDelete.id}`);
    expect(deleteResponse.ok()).toBeTruthy();
  
    // reload the page to get the updated table
    await page.reload();
  
    // final check: ensure the unique contact is no longer in the table
    const tableText = await page.locator('table').textContent();
    console.log('table text after deletion & reload:', tableText);
    expect(tableText).not.toContain(uniqueLastname);
  
    await page.screenshot({ path: 'screenshots/delete-contact.png' });
  });

});
