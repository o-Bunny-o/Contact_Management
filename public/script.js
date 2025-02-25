document.addEventListener('DOMContentLoaded', () => {
    // init page by showing contacts
    loadContacts();
  
    // 4 the form submit event
    document.getElementById('contact-form').addEventListener('submit', handleFormSubmit);
  });
  
  async function loadContacts() {
    // gets contacts from the server & puts them in the table
    try {
      const response = await fetch('/api/contacts');
      const contacts = await response.json();
      renderContacts(contacts);
    } catch (error) {
      console.error('error loading contacts:', error);
    }
  }
  
  function renderContacts(contacts) {
    // puts contacts in the table dynamically
    const tbody = document.getElementById('contacts-table-body');
    tbody.innerHTML = ''; // clear existing rows
  
    contacts.forEach(contact => {
      const tr = document.createElement('tr');
  
      // cells 4 each contact field
      const tdLastname = document.createElement('td');
      tdLastname.textContent = contact.lastname;
      tr.appendChild(tdLastname);
  
      const tdFirstname = document.createElement('td');
      tdFirstname.textContent = contact.firstname;
      tr.appendChild(tdFirstname);
  
      const tdPhone = document.createElement('td');
      tdPhone.textContent = contact.phone;
      tr.appendChild(tdPhone);
  
      const tdEmail = document.createElement('td');
      tdEmail.textContent = contact.email;
      tr.appendChild(tdEmail);
  
      // cell 4 modify & delete buttons
      const tdActions = document.createElement('td');
  
      const modifyButton = document.createElement('button');
      modifyButton.textContent = 'Modify';
      modifyButton.addEventListener('click', () => populateForm(contact));
      tdActions.appendChild(modifyButton);
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteContact(contact.id));
      tdActions.appendChild(deleteButton);
  
      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });
  }
  
  async function handleFormSubmit(event) {
    // form submission 4 adding/updating a contact
    event.preventDefault();
  
    const id = document.getElementById('contact-id').value;
    const contactData = {
      lastname: document.getElementById('lastname').value,
      firstname: document.getElementById('firstname').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value
    };
  
    try {
      if (id) {
        // if id exists then update contact
        await fetch(`/api/contacts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData)
        });
      } else {
        // if no id then add new contact
        await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData)
        });
      }
      // reset form after operation
      resetForm();
      // reload contacts list dynamically
      loadContacts();
    } catch (error) {
      console.error('error handling form submit:', error);
    }
  }
  
  function populateForm(contact) {
    // pre-fills the form with contact data 4 modification
    document.getElementById('contact-id').value = contact.id;
    document.getElementById('lastname').value = contact.lastname;
    document.getElementById('firstname').value = contact.firstname;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('email').value = contact.email;
    document.getElementById('form-title').textContent = 'Modify Contact';
    document.getElementById('submit-button').textContent = 'Save';
  }
  
  async function deleteContact(id) {
    // deletes a contact after confirmation
    if (confirm('are you sure you want to delete this contact?')) {
      try {
        await fetch(`/api/contacts/${id}`, {
          method: 'DELETE'
        });
        // reload contacts list after deletion
        loadContacts();
      } catch (error) {
        console.error('error deleting contact:', error);
      }
    }
  }
  
  function resetForm() {
    // resets the contact form to its default state
    document.getElementById('contact-form').reset();
    document.getElementById('contact-id').value = '';
    document.getElementById('form-title').textContent = 'Add Contact';
    document.getElementById('submit-button').textContent = 'Add';
  }
  