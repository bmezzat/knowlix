
describe("Auth flow", () => {

  beforeEach(() => {
    cy.loginWithCognito(Cypress.env("testUsername"), Cypress.env("testPassword"));
  });

  it("logs in via Cognito Hosted UI", () => {
    cy.origin('http://localhost:5176', () => {
      cy.contains("Knowlix Challenge", { timeout: 10000 }).should("be.visible");
    });
  });

  it("logs out successfully", () => {
    cy.origin('http://localhost:5176', () => {
      cy.get('button[aria-label="account of current user"]', { timeout: 10000 })
        .click();

      cy.contains('Logout', { timeout: 10000 }).click();

      //  Assert redirected to login page
      cy.visit('https://eu-central-1oqo6bbroy.auth.eu-central-1.amazoncognito.com/login?client_id=54afnpo8teui50v06g704pf1l1&response_type=code&scope=openid+profile+email&redirect_uri=http%3A%2F%2Flocalhost%3A5176');
    });
  });
});
