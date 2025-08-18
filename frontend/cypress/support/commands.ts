Cypress.Commands.add("loginWithCognito", (username: string, password: string) => {
  cy.visit("https://eu-central-1oqo6bbroy.auth.eu-central-1.amazoncognito.com/login?client_id=54afnpo8teui50v06g704pf1l1&response_type=code&scope=openid+profile+email&redirect_uri=http%3A%2F%2Flocalhost%3A5176")  

//   Step 1: Enter username
  cy.log("Entered Cognito origin successfully");
  cy.wait(1000);
  cy.get("input[name='username']").type(username);
  cy.get("button[type=submit]", { timeout: 10000 }).click();

//  Step 2: password
  cy.wait(1000);
  cy.get("input[name='password']", { timeout: 10000 }).type(password);
  cy.get("button[type=submit]").click();

});
