const { BeforeAll, AfterAll } = require('@cucumber/cucumber');
const fs = require('fs').promises;
const path = require('path');

// runs once before all scenarios
BeforeAll(async function () {
  // adjust the relative path as needed
  const contactsFilePath = path.join(__dirname, '../../../contacts.json');
  console.log('beforeAll hook: resetting contacts.json to empty array');
  await fs.writeFile(contactsFilePath, '[]', 'utf8');
});

