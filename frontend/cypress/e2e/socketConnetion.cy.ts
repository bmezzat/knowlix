describe("WebSocket Resilience", () => {
  beforeEach(() => {
    cy.loginWithCognito(Cypress.env("testUsername"), Cypress.env("testPassword"));
  });

  it("reconnects after disconnect", () => {
    cy.origin('http://localhost:5176', () => {
    // Turn ON WebSocket
        cy.contains("WebSocket Connection").parent().find("input[type=checkbox]").check({ force: true });
        cy.wait(1000);

        cy.contains("Chatmode turned on");
        cy.contains("Socket connected");
        cy.window().then((win) => {
          const sock = (win as any).socket;
          sock.io.engine.close();
          cy.contains("Socket disconnected");
        });
        cy.wait(5000);
        cy.contains("Reconnecting");
        cy.contains("Reconnected")
        cy.contains("WebSocket Connection").parent().find("input[type=checkbox]").uncheck({ force: true });
        cy.wait(1000);
        cy.contains("Chatmode turned off");

        cy.contains("WebSocket Connection").parent().find("input[type=checkbox]").check({ force: true });
        cy.wait(1000);
        cy.contains("Chatmode turned on");
    });
  });
});
