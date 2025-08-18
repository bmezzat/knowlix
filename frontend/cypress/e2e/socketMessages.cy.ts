describe("WebSocket Messages", () => {
  beforeEach(() => {
    cy.loginWithCognito(Cypress.env("testUsername"), Cypress.env("testPassword"));
  });

  it("socket messages", () => {
    cy.origin('http://localhost:5176', () => {
        cy.contains("WebSocket Connection").parent().find("input[type=checkbox]").check({ force: true });
        cy.wait(1000);
        cy.contains("Chatmode turned on");
        cy.contains("Socket connected");
        cy.wait(1000);
        cy.get('[data-testid="chat-input"]').type('get my preferences{enter}');
        cy.wait(1000);
        cy.contains("Preferences is");
        cy.get('[data-testid="chat-input"]').type('get search history{enter}');
        cy.wait(1000);
        cy.contains("2025-08-18 14:32:57 - 4d2661ae-12ee-453a-b6f7-502af6f90159: get my preferences");
        cy.wait(500)
        cy.get('[data-testid="chat-input"]').type('clear{enter}');
        cy.wait(500)
        cy.contains('Preferences is').should('not.exist');
    });
  });
});
