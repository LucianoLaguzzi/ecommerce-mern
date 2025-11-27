/// <reference types="cypress" />

describe("verifico login y flujo ", () => {
    beforeEach(()=>{
        cy.visit("/");
    })

    it("flujo home/login y funcional", () => {
        cy.contains("Login").click();
        cy.url().should("include", "/login")
        cy.get('input[placeholder="tu@email.com"]').should("exist").type(Cypress.env("TEST_USER_EMAIL"))
        cy.get('[data-cy="password"]').should("exist").type(Cypress.env("TEST_USER_PASSWORD"))
        cy.contains("Ingresar").click()
        cy.get(".avatar").should("exist")
    })

    it("login página aislada y funcional", () => {
        cy.visit("/login"); // directamente a la página de login
        cy.get('input[placeholder="tu@email.com"]').should("exist").type(Cypress.env("TEST_USER_EMAIL"))
        cy.get('[data-cy="password"]').should("exist").type(Cypress.env("TEST_USER_PASSWORD"))
        cy.contains("Ingresar").click()
        cy.url().should("eq", Cypress.config().baseUrl + "/") //redirige al home
        cy.get(".avatar").should("exist")
    })
})


describe("verifico registrar y flujo ", () => {
    beforeEach(()=>{
        cy.visit("/");
    })
     it("flujo home/register y funcional", () => {
        cy.contains("Registro").click();
        cy.url().should("include", "/register");
        cy.contains("Registrarse").should("exist");
        cy.intercept("POST", "/api/auth/register", {
            statusCode: 201,
            body: {
                token: "fake-token-123",
                _id: "user123",
                name: "Juan Pérez",
                email: "juan@test.com",
                phone: "444333",
                address: "calle 1234",
            }
        }).as("registerRequest");
        //Completo el form con datos de prueba
        cy.get('[data-cy="register-name"]').type("Juan Pérez");
        cy.get('[data-cy="register-email"]').type("juan@test.com");
        cy.get('[data-cy="register-password"]').type("juan123!!");
        cy.get('[data-cy="register-phone"]').type("444333");
        cy.get('[data-cy="register-address"]').type("calle 1234");

        //Cliquea y espera el mock si pasa
        cy.contains("Registrarse").should("exist").click();
        cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);
        // luego verificar la UI
        cy.contains('Usuario creado con éxito').should('be.visible');
        cy.contains("Ir al inicio").click();
        cy.get(".avatar").should("be.visible")

    })


    it("register página aislada y funcional", () => {
        cy.visit("/register")
        cy.url().should("include", "/register");
        cy.contains("Registrarse").should("exist");
        cy.intercept("POST", "/api/auth/register", {
            statusCode: 201,
            body: {
                token: "fake-token-123",
                _id: "user123",
                name: "Juan Pérez",
                email: "juan@test.com",
                phone: "444333",
                address: "calle 1234",
            }
        }).as("registerRequest");
        //Completo el form con datos de prueba
        cy.get('[data-cy="register-name"]').type("Juan Pérez");
        cy.get('[data-cy="register-email"]').type("juan@test.com");
        cy.get('[data-cy="register-password"]').type("juan123!!");
        cy.get('[data-cy="register-phone"]').type("444333");
        cy.get('[data-cy="register-address"]').type("calle 1234");

        //Cliquea y espera el mock si pasa
        cy.contains("Registrarse").should("exist").click();
        cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);
        // luego verificar la UI
        cy.contains('Usuario creado con éxito').should('be.visible');
        cy.contains("Ir al inicio").click();
        cy.get(".avatar").should("be.visible")

    })
})

describe("links entre login y registro", () => {
    it("desde login puedo ir a register", () => {
        cy.visit("/login");
        cy.contains("Regístrate aquí").click();
        cy.url().should("include", "/register");
        cy.contains("Registrarse").should("exist");
    });

    it("desde register puedo ir a login", () => {
        cy.visit("/register");
        cy.contains("Inicia sesión aquí").click();
        cy.url().should("include", "/login");
        cy.contains("Ingresar").should("exist");
    });
});