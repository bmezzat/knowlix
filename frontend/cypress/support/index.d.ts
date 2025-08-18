declare namespace Cypress {
  interface Chainable {
    loginWithCognito(username: string, password: string): Chainable<void>;
    loginCognito(): Chainable<void>;
  }
}