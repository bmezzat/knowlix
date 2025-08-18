describe("Api Messages", () => {
  beforeEach(() => {
    cy.loginWithCognito(Cypress.env("testUsername"), Cypress.env("testPassword"));
  });

  it("APi send messages", () => {
    cy.origin('http://localhost:5176', () => {
        cy.wait(3000);
        cy.get('[data-testid="chat-input"]').type('get temp{enter}');
        cy.wait(1000);
        cy.contains('No API configured for "temp"');
        cy.get('[data-testid="chat-input"]').type('get search history{enter}');
        cy.wait(1000);
        cy.contains('API "backend" is not active');
        cy.get('[data-testid="chat-input"]').type('get weather berlin{enter}');
        cy.contains('API "weather" is not active');
        cy.get('[data-testid="switch-weather"] input[type="checkbox"]')
          .click({ force: true })
          .should('be.checked');
        cy.wait(500)
        cy.get('[data-testid="chat-input"]').type('get weather berlin{enter}');
        cy.wait(1000)
        cy.contains("Your request is processed")


        cy.get('[data-testid="api-panel-weather"]', { includeShadowDom: true })
          .shadow() // enter the shadow root
          .find('div.panel .messages')
          .contains('Current weather in Berlin is', { timeout: 5000 });

        cy.wait(1000)
        cy.get('[data-testid="switch-backend"] input[type="checkbox"]')
          .click({ force: true })
          .should('be.checked');
        cy.wait(500)
        cy.get('[data-testid="chat-input"]').type('get my preferences{enter}');
        cy.wait(500)
        cy.contains('Your request is processed, please check "Backend')
        cy.get('[data-testid="api-panel-backend"]', { includeShadowDom: true })
          .shadow()
          .find('div.panel .messages')
          .contains('Preferences is', { timeout: 5000 });
    });
  });
});
