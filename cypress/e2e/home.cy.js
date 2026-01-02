describe("Home Page", () => {

  it("debería mostrar el hero y el catálogo", () => {
    // Navegar al home
    cy.visit("/");

    // Hero
    cy.contains("Bienvenido a Mi Tienda").should("be.visible");

    // Verifico que hay un catálogo
    cy.contains("Catálogo").should("be.visible");

    // Footer
    cy.contains("Mi Ecommerce - Todos los derechos reservados").should("be.visible");

    // Verifico que exista al menos un producto en la lista
    cy.get(".grid a").should("have.length.greaterThan", 0);

    // Verifico los datos en la primera tarjeta
    cy.get(".producto-celda").first().within(() => {
      cy.get("h3").should("be.visible");
      cy.get("p").should("exist");
      cy.contains("Ver detalles");
    });
  });


  it("debería mostrar el mensaje si no hay productos (mock)", () => {
    cy.fixture("emptyProducts.json").then((emptyData) => {
      cy.intercept("GET", "**/api/products*", {
        statusCode: 200,
        body: emptyData,
      }).as("getProductsEmpty");
    });

    cy.visit("/");
    cy.wait("@getProductsEmpty");

    cy.contains("No hay productos disponibles").should("be.visible");
    cy.get(".grid").should("not.exist");
  });


  it("debería andar la paginación y mostrar productos diferentes", () => {
    cy.visit("/");

    cy.get(".producto-celda h3")
      .first()
      .invoke("text")
      .as("firstProductPage1");

    cy.contains("Siguiente").click();

    cy.get("@firstProductPage1").then((textPage1) => {
      cy.get(".producto-celda h3")
        .first()
        .should(($el) => {
          expect($el.text()).to.not.equal(textPage1);
        });
    });
  });



  it("debería permitir hacer click en 'Ver detalles' y navegar al detalle del producto", () => {
    cy.visit("/");

    // Click en el primer producto
    cy.get(".grid a").first().click();

    // Verifico que cambió de ruta a detalle (ejemplo /product/:id)
    cy.url().should("include", "/product/");

    // Verifico que en la página de detalle aparezcan datos clave
    cy.get("h1").should("be.visible"); // título del producto

    //imagen ver visibilidad
    cy.get('[data-test = "product-image"]').should("be.visible")
      .and(($imagen) =>{  //$imagen es lo obtenido en el get ( una especie de objeto del dom)
      expect($imagen[0].naturalWidth).to.be.greaterThan(0);
    })
    
    cy.contains("Agregar al carrito").should("be.visible"); // que aparezca el boton de agregar
    cy.contains("Descripción").should("be.visible")
  });

});
