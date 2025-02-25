import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { addContact, updateContact, deleteContact, validateContact } from './lib/contactsManager.js';

const app = express();
const port = 3000;

// express app setup & we use json middleware 4 parsing
app.use(express.json());
// serves static files from the public directory
app.use(express.static('public'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsFilePath = path.join(__dirname, 'contacts.json');

// endpoint 4 getting contacts list
app.get('/api/contacts', async (req, res) => {
  try {
    const data = await fs.readFile(contactsFilePath, 'utf-8'); // reading contacts file
    const contacts = JSON.parse(data); // json data
    res.json(contacts); 
  } catch (err) {
    res.status(500).json({ error: err.message }); // error
  }
});

// + a new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const newContact = req.body; // getting new contact data
    const validation = validateContact(newContact); // validating contact data
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message }); // error
    }
    const data = await fs.readFile(contactsFilePath, 'utf-8'); // read contacts
    const contacts = JSON.parse(data); // parse contacts
    const updatedContacts = addContact(contacts, newContact); // + new contact
    await fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts, null, 2)); // save updated contacts
    res.status(201).json(updatedContacts); // send new contacts list
  } catch (err) {
    res.status(500).json({ error: err.message }); // error
  }
});

// updating existing contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const id = req.params.id; // get id from url
    const updatedData = req.body; // get updated contact data
    const validation = validateContact(updatedData); // validate updated data
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message }); // error
    }
    const data = await fs.readFile(contactsFilePath, 'utf-8'); // read contacts file
    const contacts = JSON.parse(data); // json data
    const updatedContacts = updateContact(contacts, id, updatedData); // update contact data
    await fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts, null, 2)); // write back to file
    res.json(updatedContacts); // updated contacts list
  } catch (err) {
    res.status(500).json({ error: err.message }); // error 
  }
});

// deleting a contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const id = req.params.id; // get id from url
    const data = await fs.readFile(contactsFilePath, 'utf-8'); // contacts file
    const contacts = JSON.parse(data); // contacts
    const updatedContacts = deleteContact(contacts, id); // delete contact with given id
    await fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts, null, 2)); // update file
    res.json(updatedContacts); // send updated list
  } catch (err) {
    res.status(500).json({ error: err.message }); // error
  }
});

// start the server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
