/// <reference types="cypress" />
describe("Funcionamiento del panel de admin usuarios", ()=>{
    beforeEach(()=>{
        cy.visit("/")
    })

    it("Prueba panel oculto usuario no admin", ()=>{
        cy.login()
        cy.get(".avatar").should("be.visible").click()
        // Verifico que la opcion del panel no exista para usuario comun
        cy.contains("Panel de admin").should("not.exist")
    })


    it("Prueba panel para admins", ()=>{
        cy.login(Cypress.env("TEST_ADMIN_EMAIL"), Cypress.env("TEST_ADMIN_PASSWORD"));
        cy.get(".avatar").should("be.visible").click()
        cy.contains("Panel de Admin").should("be.visible").click()
        cy.contains("Panel Admin").should("be.visible")
        cy.contains("Gestión de Usuarios").should("be.exist")
        cy.get('[data-test="tabla-users"]').should("be.visible")


        cy.get("tbody tr").eq(0).should("be.visible")
            .within(($linea) =>{
            cy.get('[data-test="cy-name"]').should("be.visible");
            cy.get('[data-test="cy-email"]').should("be.visible");
            cy.get('[data-test="user-rol"]').should("be.visible");
            cy.get('[data-test="btn-cambia-rol"]').should("be.visible");
            cy.get('[data-test="btn-eliminar"]').should("be.visible");
        })

    })


    it("Verifica que el admin logueado no puede cambiar su rol ni eliminarse", () => {
        cy.login(Cypress.env("TEST_ADMIN_EMAIL"), Cypress.env("TEST_ADMIN_PASSWORD"));
        cy.get(".avatar").click();
        cy.contains("Panel de Admin").click();

        cy.get('[data-test="tabla-users"]').should("be.visible");

        // Busco fila con su propio email
        cy.contains('[data-test="cy-email"]', Cypress.env("TEST_ADMIN_EMAIL"))
        .parents("tr")
        .within(() => {
        cy.get('[data-test="btn-cambia-rol"]').should("be.disabled");
        cy.get('[data-test="btn-eliminar"]').should("be.disabled");
        });
    });


    it("Mockea cambio de rol sin tocar base real", () => {
        cy.intercept("GET", "http://localhost:5000/api/users", {
            statusCode: 200,
            body: [
            {
                _id: "1",
                name: "Admin",
                email: "admin@test.com",
                isAdmin: true,
            },
            {
                _id: "2",
                name: "Usuario Test",
                email: "usuario@test.com",
                isAdmin: false,
            },
            ],
        }).as("mockUsers");

        cy.intercept("PUT", "http://localhost:5000/api/users/*", {
            statusCode: 200,
            body: {
            _id: "2",
            name: "Usuario Test",
            email: "usuario@test.com",
            isAdmin: true, // simulacion de cambio de rol
            },
        }).as("mockToggleRole");

        cy.login(Cypress.env("TEST_ADMIN_EMAIL"), Cypress.env("TEST_ADMIN_PASSWORD"));
        cy.visit("/admin");

        cy.wait("@mockUsers");

        cy.get('[data-test="tabla-users"]').should("be.visible");
        cy.contains('[data-test="cy-email"]', "usuario@test.com")
            .parents("tr")
            .within(() => {
            cy.get('[data-test="btn-cambia-rol"]').click();
        });

        // confirmamos SweetAlert
        cy.get(".swal2-confirm").click();

        cy.wait("@mockToggleRole").its("response.statusCode").should("eq", 200);
        cy.contains("Usuario actualizado").should("be.visible");
    });



    it("Mockea eliminar sin tocar base real", () => {
        cy.intercept("GET", "http://localhost:5000/api/users", {
            statusCode: 200,
            body: [
            {
                _id: "1",
                name: "Admin",
                email: "admin@test.com",
                isAdmin: true,
            },
            {
                _id: "2",
                name: "Usuario Test",
                email: "usuario@test.com",
                isAdmin: false,
            },
            ],
        }).as("mockUsers");

        cy.intercept("DELETE", "http://localhost:5000/api/users/*", {
            statusCode: 200,
            body: { message: "Usuario eliminado" },
        }).as("mockDeleteUser");

        cy.login(Cypress.env("TEST_ADMIN_EMAIL"), Cypress.env("TEST_ADMIN_PASSWORD"));
        cy.visit("/admin");

        cy.wait("@mockUsers");

        cy.get('[data-test="tabla-users"]').should("be.visible");
        cy.contains('[data-test="cy-email"]', "usuario@test.com")
            .parents("tr")
            .within(() => {
            cy.get('[data-test="btn-eliminar"]').click();
        });

        // confirmamos SweetAlert
        cy.get(".swal2-confirm").click();

        cy.wait("@mockDeleteUser").its("response.statusCode").should("eq", 200);
        cy.contains("Usuario eliminado").should("be.visible");
    });

})


describe("Verificar funcionamiento de panel admin productos",() =>{
    beforeEach(()=>{
         cy.intercept("GET", "http://localhost:5000/api/products*", {
            statusCode: 200,
            body: {
                products: [
                    {
                    _id: "1",
                    name: "Reloj",
                    description: "Reloj digital con alarma, cronómetro, sumergible hasta 50 metros y correa de silicona negra.",
                    image: "https://res.cloudinary.com/dzaqvpxqk/image/upload/v1757014155/ecommerce/hllxrch0rfxdtusfxiyk.jpg",
                    price: 35200.99,
                    stock: 18,
                    },
                ],
                page: 1,
                totalPages: 1,
            },
        }).as("mockProducts");

        cy.visit("/");
        cy.login(Cypress.env("TEST_ADMIN_EMAIL"), Cypress.env("TEST_ADMIN_PASSWORD"));
        cy.get(".avatar").click();
        cy.contains("Panel de Admin").click();
        cy.contains("Productos").click();
    })

    it("Verificar vista panel",()=>{
        cy.wait("@mockProducts")
        cy.get("table").should("be.visible")
        cy.get('[data-test="cy-name"]').contains("Reloj")

        cy.get('[data-test="tabla-products"] tr').should("have.length", 1);
        //otra forma para lo mismo (find) 
        //cy.get('[data-test="tabla-products"]').find("tr").should("have.length", 1);

    })


    it("Alta de nuevo producto", () => {
        //Intercepto creacion nuevo producto
        cy.intercept("POST", "http://localhost:5000/api/products" , {
            statusCode:200,
            body: {
                _id : "3",
                name: "Celular iphone",
                description: "Celular IOS ultima tecnologia",
                image: "https://res.cloudinary.com/dzaqvpxqk/image/upload/v1757014234/ecommerce/wimp32lkzkt47pqjb302.jpg",
                price: 650000,
                stock: 14,
            }
        }).as("mockNewProduct");


            


        //Muestra el producto inicial base
        cy.wait("@mockProducts")
        //Verifica que este en la tabla
        cy.get('[data-test="tabla-products"]')


        cy.get('input[name="name"]').click().type("Celular iphone")
        cy.get('input[name="description"]').click().type("Celular IOS ultima tecnologia")
        cy.get('input[name="price"]').click().type("650000")
        cy.get('input[name="stock"]').click().type("15")

        cy.contains("Crear Producto").click();

        cy.wait("@mockNewProduct")


  
        //Verifica los 2 productos en la tabla
        cy.get('[data-test="tabla-products"]')

        //Verifico que esten los 2 productos, el inicial y el reloj creado
        cy.get('[data-test="tabla-products"] tr').should("have.length", 2);
        
    })






    it("Edita un producto existente", () => {
        // intercept PUT
        cy.intercept("PUT", "http://localhost:5000/api/products/*", {
             body: {
                _id: "1",
                name: "Reloj",
                description: "Reloj digital con alarma, cronómetro, sumergible hasta 50 metros y correa de silicona negra.",
                image: "https://res.cloudinary.com/dzaqvpxqk/image/upload/v1757014155/ecommerce/hllxrch0rfxdtusfxiyk.jpg",
                price: 35200.99,
                stock: 5,
            },
        }).as("mockUpdateProduct");


        // click en editar
        cy.get('[data-test="tabla-products"] tr').eq(0).within(() =>{
            cy.contains("Editar").click()
        })
 
        // modificar datos
        cy.get('input[name="price"]').click().type("{selectall}35200.99")
        cy.get('input[name="stock"]').click().type("{selectall}5")
        cy.contains("Actualizar Producto").click()
        cy.wait("@mockUpdateProduct")

        // valida tabla actualizada
        cy.get('[data-test="tabla-products"] tr')
            .eq(0)
            .find("td")
            .eq(3) // columna stock
            .should("have.text", "5");


    });

    it("Elimina un producto", () => {

        // intercept DELETE
         cy.intercept("DELETE", "http://localhost:5000/api/products/*", {
            statusCode: 200, //o puede no ir (por default es 200)
            body: {
             message: 'Producto eliminado' 
            },
        }).as("mockDeleteProduct");

        cy.contains("No se encontraron productos").should("not.exist")

        // click eliminar
        cy.get('[data-test="tabla-products"] tr').eq(0).within(() =>{
            cy.contains("Eliminar").click()
        })

        // confirmar
         cy.get('.swal2-confirm').click()
         cy.contains("Producto eliminado").should("be.visible")

        // validar que desaparece de tabla
        cy.contains("No se encontraron productos")
        

    });

    it("Valida errores en el formulario", () => {

        //Muestra el producto inicial base
        cy.wait("@mockProducts");

        // Intento enviar sin completar nada
        cy.contains("Crear Producto").click();

        //En caso de verificar un campo en required(name en este caso):
        cy.get('input[name="name"]').should('have.prop', 'validationMessage');

        // Verifico luego de mandar el form arriba de q la imagen no se mando entonces muestra un error de validacion html
        //el error dice "selecciona un archivo" por lo q es distinto de vacio ("") entonces el test pasa en verde.
        cy.get('input[name="image"]')
        .invoke("prop", "validationMessage")
        .should("not.equal", "");

        // No debería crearse nada
        cy.contains("Producto creado").should("not.exist");

        // Ahora completo pero con precio negativo
        cy.get('input[name="name"]').type("Producto X");
        cy.get('input[name="description"]').type("Desc X");
        cy.get('input[name="price"]').type("100");
        cy.get('input[name="stock"]').type("5");

        cy.contains("Crear Producto").click();

        // Sigue sin crearse nada porque falta completar el campo imagen entonces no se crea.
        cy.contains("Producto creado").should("not.exist");

    });
    
})


describe("Verificar funcionamiento de panel admin ordenes",() =>{
    beforeEach(()=>{
         cy.intercept("GET", "http://localhost:5000/api/orders", {
            statusCode: 200,
            body: [
                {
                _id: "order123",
                user: {
                    _id: "user999",
                    name: "Usuario Prueba",
                    email: "admin@test.com"
                },
                items: [
                    {
                        productId: "prodA1",
                        name: "Producto Demo A",
                        quantity: 2,
                        price: 4500
                    },
                    {
                        productId: "prodB2",
                        name: "Producto Demo B",
                        quantity: 1,
                        price: 9999
                    }
                    
                ],
                total: 10500,
                status: "Pendiente",
                createdAt: "2025-10-28T12:00:00.000Z",
                updatedAt: "2025-10-28T12:00:00.000Z"
                }
            ],
        }).as("mockOrders");


        cy.intercept(
            "PATCH",
            "http://localhost:5000/api/orders/*",
            {
                statusCode: 200,
                body: {   
                    _id: "order123",
                    status: "Completada" 
                }
                
            }
        ).as("updateOrder");

    

        cy.visit("/");
        cy.login(Cypress.env("TEST_ADMIN_EMAIL"), Cypress.env("TEST_ADMIN_PASSWORD"));
        cy.get(".avatar").click();
        cy.contains("Panel de Admin").click();
        cy.contains("Órdenes").click();
    })


    it.only("Verificar vista panel ordenes",()=>{
        cy.wait("@mockOrders")

        cy.get('[data-test="tabla-orders"]').should("be.visible")

        cy.get('[data-test="tabla-orders"] tr').eq(0).within(() =>{
            cy.get('[data-test="cy-order-n"]')
        }) 

        cy.get('[data-test= "cy-filtrar"]').should("be.visible").click();
        cy.get('[data-test= "input-filtro"]').should("be.visible").click().type("DER")
        

        cy.get('[data-test="tabla-orders"] tr').eq(0).within(() =>{
            cy.get('[data-test="cy-order-n"]').should("contain", "DER123")
        }) 


        cy.get('[data-test= "input-filtro"]').should("be.visible").clear().type("AA00")

        cy.get('[data-test="tabla-orders"] tr').eq(0).within(() =>{
            cy.contains("No se encontraron órdenes").should("be.visible")
        })

        cy.get('[data-test= "input-filtro"]').should("be.visible").clear()

        cy.get('[data-test="cy-order-status"] select').select("Completada");
        cy.wait("@updateOrder");

        cy.contains("Pendiente").should("be.visible");



    })


})