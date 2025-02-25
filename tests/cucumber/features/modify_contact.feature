Feature: Modify Contact

  Scenario: modify existing contact
    Given that a contact exists in the contacts list
    And that i am on the contacts management page
    When i click on the "Modify" button for that contact
    And i change the contact data
    And i click on "Save"
    Then i see the updated contact information on the list
