/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command para login programático
     */
    login(): Chainable<void>;
  }
}
