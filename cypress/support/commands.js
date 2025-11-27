// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add("login", (email, password) => {
  const userEmail = email || Cypress.env("TEST_USER_EMAIL");
  const userPassword = password || Cypress.env("TEST_USER_PASSWORD");

  cy.request("POST", "http://localhost:5000/api/auth/login", {
    email: userEmail,
    password: userPassword,
  }).then((resp) => {
    const { token, ...user } = resp.body;

    cy.visit("/", {
      onBeforeLoad(win) {
        // Setear el localStorage ANTES de que cargue React
        win.localStorage.setItem("auth", JSON.stringify({ user, token }));
      },
    });
  });
});







