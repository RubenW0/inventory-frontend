/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", () => {
  cy.request("POST", "http://127.0.0.1:8000/auth/login/", {
    username: "ruben",
    password: "test123"
  }).then((resp) => {
    window.localStorage.setItem("access", resp.body.access);
  });
});

export {};
