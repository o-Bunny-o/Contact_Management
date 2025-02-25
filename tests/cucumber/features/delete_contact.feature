Feature: Delete Contact

  Scenario: delete an existing contact
    Given that a contact exists in the contacts list
    And that i am on the contacts management page
    When i click on the "Delete" button for that contact
    And i confirm the deletion
    Then i no longer see the contact on the list
