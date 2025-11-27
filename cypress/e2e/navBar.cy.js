/// <reference types="cypress" />

describe("Navbar con usuario logueado (no admin)", () => {
  beforeEach(() => {
    cy.login();
  });

  it("muestra las opciones correctas para usuario no admin", () => {
    cy.get("nav").should("be.visible");
    cy.get(".carrito").should("exist")
    cy.get(".avatar", { timeout: 8000 }).should("be.visible");
    cy.get(".avatar").click();
    cy.contains("Mi Perfil").should("be.visible")
    cy.contains("Mis Compras").should("be.visible");
    cy.contains("Cerrar Sesión").should("be.visible");
    cy.contains("Panel de Admin").should("not.exist");
    cy.contains("Mi Tienda").click()
    cy.contains("Bienvenido a Mi Tienda")
  });
});



// Usuario admin
describe("Navbar con usuario logueado (admin)", () => {
  beforeEach(() => {
    cy.login(Cypress.env("TEST_ADMIN_EMAIL"), Cypress.env("TEST_ADMIN_PASSWORD"));
  });

  it("muestra las opciones correctas para usuario admin", () => {
    cy.get("nav").should("be.visible");
    cy.get(".carrito").should("exist")
    cy.get(".avatar").should("be.visible").click();
    cy.contains("Mi Perfil").should("be.visible");
    cy.contains("Mis Compras").should("be.visible");
    cy.contains("Panel de Admin").should("be.visible");
    cy.contains("Cerrar Sesión").should("be.visible");
    cy.contains("Panel de Admin").click();
    cy.url().should("include", "/admin");
    cy.contains("Gestión de Usuarios")

  });
});


describe("Navbar con usuario invitado (guest)", () => {
  beforeEach(() => {
    cy.visit("/");//arranca como guest, no setea nada en localstorage
  });

  it("muestra las opciones correctas para guest", () => {
    cy.get("nav").should("be.visible");
    cy.get(".carrito").should("exist");
    cy.contains("Login").should("be.visible");
    cy.contains("Registro").should("be.visible");
    cy.get(".avatar").should("not.exist");

    cy.contains("Mi Tienda").click()
    cy.contains("Bienvenido a Mi Tienda")
  });
});