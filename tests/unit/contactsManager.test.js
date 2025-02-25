const { addContact, updateContact, deleteContact, validateContact } = require('../../lib/contactsManager');

describe('contactsManager functions', () => {
  test('addContact adds a new contact', () => {
    // prepare test data
    const contacts = [];
    const newContact = {
      lastname: "Doe",
      firstname: "John",
      phone: "1234567890",
      email: "john.doe@example.com"
    };
    const updatedContacts = addContact(contacts, newContact);
    expect(updatedContacts.length).toBe(1);
    expect(updatedContacts[0]).toMatchObject(newContact);
    expect(updatedContacts[0]).toHaveProperty('id');
  });

  test('updateContact updates an existing contact', () => {
    const contacts = [{
      id: "1",
      lastname: "Doe",
      firstname: "John",
      phone: "1234567890",
      email: "john.doe@example.com"
    }];
    const updatedData = {
      lastname: "Smith",
      firstname: "Jane",
      phone: "0987654321",
      email: "jane.smith@example.com"
    };
    const updatedContacts = updateContact(contacts, "1", updatedData);
    expect(updatedContacts[0]).toMatchObject({ id: "1", ...updatedData });
  });

  test('deleteContact deletes a contact by id', () => {
    const contacts = [
      { id: "1", lastname: "Doe", firstname: "John", phone: "1234567890", email: "john.doe@example.com" },
      { id: "2", lastname: "Smith", firstname: "Jane", phone: "0987654321", email: "jane.smith@example.com" }
    ];
    const updatedContacts = deleteContact(contacts, "1");
    expect(updatedContacts.length).toBe(1);
    expect(updatedContacts[0].id).toBe("2");
  });

  test('validateContact returns error for missing fields', () => {
    // validation with missing fields
    const invalidContact = { lastname: "Doe", firstname: "", phone: "123", email: "" };
    const result = validateContact(invalidContact);
    expect(result.valid).toBe(false);
  });

  test('validateContact returns error for invalid email', () => {
    // validation with invalid email format
    const invalidContact = { lastname: "Doe", firstname: "John", phone: "123", email: "invalid" };
    const result = validateContact(invalidContact);
    expect(result.valid).toBe(false);
  });

  test('validateContact returns valid for correct contact', () => {
    // validation with correct contact data
    const validContact = { lastname: "Doe", firstname: "John", phone: "1234567890", email: "john.doe@example.com" };
    const result = validateContact(validContact);
    expect(result.valid).toBe(true);
  });
});
