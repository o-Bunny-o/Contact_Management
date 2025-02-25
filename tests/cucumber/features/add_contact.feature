Feature: Add Contact

  Scenario: add new contact
    Given that i am on the contacts management page
    When i fill up the form with valid data
    And i click on "Add"
    Then i see a new contact on the list
