Feature: Circuit Finder
  Scenario: The state matches the server
    Given the power is on

    When I load the page
    Then the page shows the power is on

    When the power is turned off
    Then the page shows the power is off

    When the power is turned back on
    Then the page shows the power is on
