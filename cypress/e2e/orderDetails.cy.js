describe("Funcionamiento del panel de admin usuarios", ()=>{
    
    it("Muestra mensaje cuando el usuario no tiene compras", () => {
        cy.intercept("GET", "http://localhost:5000/api/orders/myorders", {
            statusCode: 200,
            body: []
        }).as("mockMyOrders");


        cy.login(Cypress.env("TEST_EMAIL"), Cypress.env("TEST_PASSWORD"));

        cy.get(".avatar").click();
        cy.contains("Mis Compras").click();

        cy.wait("@mockMyOrders");

        cy.contains("Mis Compras").should("be.visible");
        cy.contains("No tenés órdenes todavía.").should("be.visible");
    });


    it("Muestra la lista de compras del usuario y abre el detalle", () => {
    
        // 1) Mock de /myorders
        cy.intercept("GET", "http://localhost:5000/api/orders/myorders", {
            statusCode: 200,
            body: [
                {
                    _id: "orderAAA",
                    total: 8500,
                    status: "Completada",
                    createdAt: "2025-09-20T12:00:00.000Z",
                    orderItems: [
                        { productId: "prodA1", name: "Producto Prueba", quantity: 1, price: 8500 }
                    ]
                }
            ]
        }).as("mockMyOrdersFilled");


        // 2) Mock del GET de la orden individual
        cy.intercept("GET", "http://localhost:5000/api/orders/orderAAA", {
            statusCode: 200,
                body:{
                    _id: "orderAAA",
                    user: {
                        _id: "user999",
                        name: "Usuario Prueba",
                        email: "admin@test.com"
                    },
                    items: [
                        {
                            productId: "prodA1",
                            name: "Producto Prueba", 
                            quantity: 1,
                            price: 8500
                        },
                        
                    ],
                    total: 8500,
                    status: "Completada",
                    createdAt: "2025-10-28T12:00:00.000Z",
                    updatedAt: "2025-10-28T12:00:00.000Z"
                }
                
        }).as("mockOrderDetail");


        // Login con usuario sin compras reales
        cy.visit("/");
        cy.login(Cypress.env("TEST_ADMIN_EMAIL"), Cypress.env("TEST_ADMIN_PASSWORD"));

        cy.get(".avatar").click();
        cy.contains("Mis Compras").click();

        // espera la lista
        cy.wait("@mockMyOrdersFilled");

        cy.contains("Completada").should("exist");
        cy.contains("$8.500,00").should("exist");


        // Clic en el link
        cy.contains("Orden #").click();

        // espera el detalle
        cy.wait("@mockOrderDetail");

        // validar que estamos en la URL correcta
        cy.url().should("include", "/orders/orderAAA");

        // validar contenido del detalle
        cy.contains("Detalle de Orden").should("exist");
        cy.contains("Producto Prueba").should("exist");
        cy.contains("$8.500,00").should("exist");

    });


})