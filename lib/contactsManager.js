// adds a new contact 4 the contacts array
// it generates a unique id using current timestamp
function addContact(contacts, contactData) {
  const newContact = {
    ...contactData,
    id: Date.now().toString()
  };
  return [...contacts, newContact];
}

// updates a contact by id 4 the contacts array
function updateContact(contacts, id, updatedData) {
  return contacts.map(contact => contact.id === id ? { ...contact, ...updatedData } : contact);
}

// deletes a contact by id 4 the contacts array
function deleteContact(contacts, id) {
  return contacts.filter(contact => contact.id !== id);
}

// validates the contact data
function validateContact(contactData) {
  if (!contactData.lastname || !contactData.firstname || !contactData.phone || !contactData.email) {
    return { valid: false, message: "all fields are required" };
  }
  // simple email regex 4 validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactData.email)) {
    return { valid: false, message: "invalid email format" };
  }
  return { valid: true };
}

module.exports = {
  addContact,
  updateContact,
  deleteContact,
  validateContact
};
