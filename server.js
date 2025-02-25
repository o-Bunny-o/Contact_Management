const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { addContact, updateContact, deleteContact, validateContact } = require('./lib/contactsManager');

const app = express();
const port = 3000;

// middleware 4 parsing json bodies
app.use(express.json());

// serve static files from the public folder
app.use(express.static('public'));

const contactsFilePath = path.join(__dirname, 'contacts.json');

/**
 * GET /api/contacts
 * returns all contacts from contacts.json
 */
app.get('/api/contacts', async (req, res) => {
  try {
    console.log('GET /api/contacts called');
    const data = await fs.readFile(contactsFilePath, 'utf-8');
    const contacts = JSON.parse(data);
    res.status(200).json(contacts);
  } catch (err) {
    console.error('error in GET /api/contacts:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/contacts
 * adds a new contact
 */
app.post('/api/contacts', async (req, res) => {
  try {
    console.log('POST /api/contacts called with body:', req.body);
    const newContact = req.body;

    // validate incoming contact data
    const validation = validateContact(newContact);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    // read existing contacts & add new contact
    const data = await fs.readFile(contactsFilePath, 'utf-8');
    const contacts = JSON.parse(data);
    const updatedContacts = addContact(contacts, newContact);

    // write updated list back to file
    await fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts, null, 2));
    res.status(201).json(updatedContacts);
  } catch (err) {
    console.error('error in POST /api/contacts:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/contacts/:id
 * updates an existing contact
 */
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`PUT /api/contacts/${id} called with body:`, req.body);

    // validate updated data
    const updatedData = req.body;
    const validation = validateContact(updatedData);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    // read existing contacts & update the specified contact
    const data = await fs.readFile(contactsFilePath, 'utf-8');
    const contacts = JSON.parse(data);
    const updatedContacts = updateContact(contacts, id, updatedData);

    // write the updated list to file
    await fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts, null, 2));
    res.status(200).json(updatedContacts);
  } catch (err) {
    console.error(`error in PUT /api/contacts/${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * deletes an existing contact
 */
app.delete('/api/contacts/:id', async (req, res) => {
  console.log('server: delete route called with id=', req.params.id);
  const data = await fs.readFile(contactsFilePath, 'utf-8');
  const contacts = JSON.parse(data);
  console.log('contacts before delete:', contacts);
  
  const updatedContacts = deleteContact(contacts, req.params.id);
  console.log('contacts after delete:', updatedContacts);

    await fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts, null, 2));
    res.status(200).json(updatedContacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// start the server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
