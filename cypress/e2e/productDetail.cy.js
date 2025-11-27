/// <reference types="cypress" />

describe("Pagina detalles del producto", () => {
    beforeEach(() => {
        cy.login();
    })

  it("muestra el producto válido correctamente", () => {
    // flujo normal desde home

    cy.get("nav").should("be.visible");
    cy.get(".grid a").first().should("contain.text", "Ver detalles").click();
    cy.url().should("include", "/product/");

    cy.contains("Agregar al carrito").should("be.visible").and("not.be.disabled")

    //imagen
    cy.get('[data-test = "product-image"]').should("be.visible")
    .and(($imagen) =>{  //$imagen es lo obtenido en el get ( una especie de objeto del dom)
      expect($imagen[0].naturalWidth).to.be.greaterThan(0);
    })

    //titulo
    cy.get("h1").should("exist").and("not.be.empty")

  
    // Precio
    cy.get('[data-test = "product-price"]').should("be.visible")
    .invoke("text")
    .should("not.be.empty")
    .and("include", "$")

    //Titulo desc
    cy.contains("Descripción").should("be.visible")

    //Contenido desc
    cy.get('[data-test="product-description"]').should("exist").invoke("text")
    .then((text) =>{
      expect(text.trim().length).to.be.greaterThan(0)
    })

    //Testeo zoom imagen
    cy.get('[data-test="img-zoom"]')
    .should('have.class', 'cursor-zoom-in')
    .click()
    .should('have.class', 'cursor-zoom-out');

  });





  it("muestra mensaje de error 404 cuando no existe el producto", () => {
    // intercept con status 404
    const fakeId = "invalid_id"; // ID válido pero inexistente

    cy.intercept("GET", `**/api/products/${fakeId}`, {
      statusCode: 404,
      body: { message: "Producto no encontrado" },
    }).as("getProduct404");

    cy.visit(`/product/${fakeId}`);
    cy.wait("@getProduct404");

    cy.contains("El producto no existe o fue eliminado.").should("be.visible");
    cy.contains("Volver al catálogo").should("be.visible");
    cy.get('[data-test="product-image"]').should("not.exist");
  });

  it("muestra mensaje de error 500 cuando hay fallo del servidor", () => {
    // intercept con status 500
    const fakeId = "fake-id"; // ID mal formado (simula error interno)

    cy.intercept("GET", `**/api/products/${fakeId}`, {
      statusCode: 500,
      body: { message: "Error interno del servidor" },
    }).as("getProduct500");

    cy.visit(`/product/${fakeId}`);
    cy.wait("@getProduct500");

    cy.contains("Ocurrió un error en el servidor. Intenta más tarde.").should("be.visible");
    cy.contains("Volver al catálogo").should("be.visible");
    cy.get('[data-test="product-title"]').should("not.exist");
  });


});