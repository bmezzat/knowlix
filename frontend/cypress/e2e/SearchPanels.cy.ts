describe("Filter Panels", () => {
  beforeEach(() => {
    cy.loginWithCognito(Cypress.env("testUsername"), Cypress.env("testPassword"));
  });

  it("Search panels", () => {
    cy.origin('http://localhost:5176', () => {
        cy.wait(3000);
        cy.get('[data-testid="switch-github"] input[type="checkbox"]')
          .click({ force: true })
          .should('be.checked');
        cy.wait(500)
        cy.get('[data-testid="chat-input"]').type('search github john{enter}');
        cy.wait(1000)
        cy.contains("Your request is processed")
        
        cy.get('[data-testid="api-panel-github"]', { includeShadowDom: true })
          .shadow() // enter the shadow root
          .find('div.panel .messages')
          .contains('john', { timeout: 5000 });

        cy.get('input[placeholder="Type to search..."]').type('https://api');  
        cy.wait(1000)

        cy.get('[data-testid="api-panel-github"]', { includeShadowDom: true })
            .shadow()
            .find('div.panel .messages mark') 
            .contains('https://api')
            .should('have.css', 'background-color', 'rgb(255, 255, 0)'); // yellow in rgb
        cy.wait(1000)
    })
  });
})
