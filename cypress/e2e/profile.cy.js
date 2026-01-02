/// <reference types="cypress" />
describe("Funcionamiento de perfil de usuario y edicion", ()=>{
    beforeEach(()=>{

        cy.intercept("PUT", "http://localhost:5000/api/users/profile", {
            statusCode: 200,
            body: {
            _id: "12345",
            name: "Nuevo Nombre",
            email: "nuevo_mail@test.com",
            phone: "1111111",
            address: "Nueva calle",
            createdAt: "2025-10-14T13:40:21.792+00:00"
            },
        }).as("mockProfileUpdate");

        cy.visit("/")

    })   


    it("Debería abrir el perfil desde el avatar", () => {
        cy.login(Cypress.env("TEST_ADMIN_EMAIL"), Cypress.env("TEST_ADMIN_PASSWORD"));
        cy.get(".avatar").click();
        cy.contains("Mi Perfil").click();

        cy.url().should('include', '/profile');

        cy.contains("Editar Perfil").should("be.visible")


        cy.get('[data-test="profile-avatar"]').should("be.visible")
        cy.get('[data-test="profile-name"]').should("be.visible")
        cy.get('[data-test="profile-email"]').should("be.visible")
        cy.get('[data-test="profile-phone"]').should("be.visible")
        cy.get('[data-test="profile-address"]').should("be.visible")
        cy.get('[data-test="profile-registered"]').should("be.visible")
        cy.contains("Editar Perfil").click()


        cy.get('input[name="name"]').clear().type("Nuevo Nombre")
        cy.get('input[name="email"]').clear().type("nuevo_mail@test.com")
        cy.get('input[name="phone"]').clear().type("1111111")
        cy.get('input[name="address"]').clear().type("Nueva calle")
        
        cy.contains("Guardar").click()
        cy.wait("@mockProfileUpdate")

        cy.contains("Perfil actualizado").should("be.visible")

        //verifico nombre nuevo
        cy.get('[data-test="profile-name"]').should("have.text","Nuevo Nombre")


        //Edito pero cancelo:
        cy.contains("Editar Perfil").click()
        cy.get('input[name="name"]').clear().type("Cancelar Nombre")

        cy.contains("Cancelar").click()
        cy.get('[data-test="profile-name"]').should("have.text", "Nuevo Nombre")
        
        

    });



})