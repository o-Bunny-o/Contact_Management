export function addContact(contacts, contactData) {
    // + new contact
    // generate a unique id + timestamp
    const newContact = {
      ...contactData,
      id: Date.now().toString()
    };
    return [...contacts, newContact];
  }
  
  export function updateContact(contacts, id, updatedData) {
    // updates contact by id
    return contacts.map(contact => contact.id === id ? { ...contact, ...updatedData } : contact);
  }
  
  export function deleteContact(contacts, id) {
    // deletes contact by id
    return contacts.filter(contact => contact.id !== id);
  }
  
  export function validateContact(contactData) {
    // data validfation
    // check 4 mandatory fields: lastname, firstname, phone, email
    if (!contactData.lastname || !contactData.firstname || !contactData.phone || !contactData.email) {
      return { valid: false, message: "all fields are required" };
    }
    // email regex 4 validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      return { valid: false, message: "invalid email format" };
    }
    return { valid: true };
  }
  