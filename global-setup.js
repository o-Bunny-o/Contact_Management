const fs = require('fs').promises;
const path = require('path');

module.exports = async () => {
  const contactsFilePath = path.join(__dirname, 'contacts.json');
  console.log('Global Setup: resetting contacts.json to empty array');
  await fs.writeFile(contactsFilePath, '[]', 'utf8');
};
