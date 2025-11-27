/// <reference types="cypress" />
describe("Funcionamiento del carrito y sus flujos" , () =>{
    beforeEach(()=>{
        cy.visit("/")
    })

    it("pruebo el flujo hasta el carrito",()=>{
        cy.get(".carrito").should("be.visible").click()
        cy.contains("Mis productos").should("be.visible")
    })


    it("pruebo carrito vacio",()=>{
        cy.visit("/cart");
        cy.url().should("include", "/cart")
        cy.contains("Carrito vacío")
        
    })

    it("pruebo el flujo carrito con elemento",()=>{
        cy.get(".grid a").first().contains("Ver detalles").click()
        cy.url().should("include", "/product/");
        //Primer producto agregado
        cy.contains("Agregar al carrito").should("be.visible").click()
        cy.contains("Mi Tienda").click()

        cy.get(".carrito").click()
        cy.get('[data-test="cart-item"]').should("have.length.at.least", 1)
        cy.get('[data-test="cart-item"] [data-test="cart-price"]')
            .invoke("text")
            .should("match", /\$\d+/)
    })


    it("pruebo flujo carrito en guest",()=>{
        cy.get(".grid a").first().contains("Ver detalles").click()
        cy.url().should("include", "/product/");
        //Primer producto agregado
        cy.contains("Agregar al carrito").should("be.visible").click()
        cy.get(".carrito").click()
        cy.get('[data-test="cart-item"]').should("have.length.at.least", 1)
        cy.contains("Finalizar Compra").click()
        cy.contains("Ir a login").click()
        cy.get('form', { timeout: 10000 }).should("be.visible");
        cy.url().should("include", "/login")
   
        cy.get('input[placeholder="tu@email.com"]', { timeout: 10000 })
        .should("be.enabled")
        .click()
        .type(Cypress.env("TEST_USER_EMAIL"), { log: false })

        cy.get('[data-cy="password"]', { timeout: 10000 })
        .should("be.enabled")
        .click()
        .type(Cypress.env("TEST_USER_PASSWORD"), { log: false })
        cy.contains("Ingresar").click();
        cy.get(".carrito").click()
        cy.get('[data-test="cart-item"]').should("have.length.at.least", 1)
        cy.get('[data-test="cart-total"]')
        .should("be.visible")
        .invoke("text")
        .should("match", /\$\d+/);
    })


    it("pruebo flujo compra con usuario",()=>{
        
        // 1. Logueo
        cy.login(); // comando custom que loguea al usuario

        // 2. Agregar productos
        cy.get(".grid a").first().contains("Ver detalles").click();
        cy.contains("Agregar al carrito").click();
        cy.contains("Mi Tienda").click();
        cy.get(".grid a").eq(1).contains("Ver detalles").click();
        cy.contains("Agregar al carrito").click();
        cy.contains("Agregar al carrito").click();
        // 3. Abrir carrito
        cy.get(".carrito").click();
        cy.get('[data-test="cart-item"]').should("have.length.at.least", 2);

        // 4. Verificar subtotales
        cy.get('[data-test="cart-item"]').each(($producto) => {
            cy.wrap($producto).find('[data-test="cart-line-total"]').invoke("text").then((subtotalText) => {
                const subtotal = Number(subtotalText.replace(/[^0-9]/g, ''));
                cy.wrap($producto).find('input[type="number"]').invoke('val').then((qty) => {
                    cy.wrap($producto).find('[data-test="cart-price"]').invoke('text').then((priceText) => {
                        const price = Number(priceText.replace(/[^0-9]/g, ''));
                        expect(subtotal).to.eq(price * Number(qty));
                    });
                });
            });
        });

        // 5. Verificar total
        let sumaSubtotales = 0;
        cy.get('[data-test="cart-line-total"]').each(($producto) => {
            const subtotal = Number($producto.text().replace(/[^0-9]/g, ''));
            sumaSubtotales += subtotal;
        }).then(() => {
            cy.get('[data-test="cart-total"]').invoke('text').then((totalText) => {
            const total = Number(totalText.replace(/[^0-9]/g, ''));
            expect(total).to.eq(sumaSubtotales);
            });
        });

        // 6. Probar eliminar
        cy.get('[data-test="cart-item"]').first().find('button').contains('Eliminar').click();
        cy.get('[data-test="cart-item"]').should('have.length', 1);


        // 6bis. Verificar que el total se actualiza tras eliminar
        let nuevoTotal = 0;
        cy.get('[data-test="cart-line-total"]').each(($el) => {
        nuevoTotal += Number($el.text().replace(/[^0-9]/g, ''));
        }).then(() => {
            cy.get('[data-test="cart-total"]').invoke('text').then((text) => {
                const totalActual = Number(text.replace(/[^0-9]/g, ''));
                expect(totalActual).to.eq(nuevoTotal);
            });
        });

        // 7. Mockear checkout para no gastar stock
        cy.intercept("POST", "http://localhost:5000/api/orders", {
            statusCode: 200,
            body: { message: "¡Compra simulada con éxito!" },
        }).as("mockCheckout");

        // 8. Finalizar compra
        cy.contains("Finalizar Compra").click();
        cy.wait("@mockCheckout"); // espera la llamada mock
        cy.contains("¡Compra realizada con éxito!").should("be.visible");
        cy.get('[data-test="cart-item"]').should("have.length", 0);
    });



    it("controla modificación de cantidades en el carrito", () => {
        // 1. Logueo para asegurar acceso al carrito
        cy.login();

        // 2. Agrego un producto
        cy.get(".grid a").first().contains("Ver detalles").click();
        cy.contains("Agregar al carrito").click();
        cy.get(".carrito").click();

        // 3. Selecciono el primer producto del carrito
        cy.get('[data-test="cart-item"]').first().as("item");

        // 4. Guardo subtotal y precio unitario iniciales
        let initialSubtotal, unitPrice;

        cy.get("@item").find('[data-test="cart-price"]').invoke("text").then(text => {
            unitPrice = Number(text.replace(/[^0-9]/g, ""));
        });

        cy.get("@item").find('[data-test="cart-line-total"]').invoke("text").then(text => {
            initialSubtotal = Number(text.replace(/[^0-9]/g, ""));
        });

        // 5. Intentar aumentar cantidad (solo si el botón no está deshabilitado)
        cy.get("@item").find('button').contains("+").then($btnPlus => {
            if ($btnPlus.is(":disabled")) { //aca en vez de las llaves y el log puede ir simplemente "return;"
                cy.log("Stock máximo alcanzado");
            } else {
                cy.wrap($btnPlus).click();
                cy.wait(300);

                cy.get("@item").find('[data-test="cart-line-total"]').invoke("text").then(text => {
                    const newSubtotal = Number(text.replace(/[^0-9]/g, ""));
                    expect(newSubtotal).to.eq(initialSubtotal + unitPrice);
                });
            }
        });

        // 6. Intentar disminuir (siempre debería mantenerse ≥ 1)
        cy.get("@item").find('button').contains("-").then($btnMinus => {
            if ($btnMinus.is(":disabled")) {
                cy.log("Hay 1 sola unidad");
            } else {
                cy.wrap($btnMinus).click();
                cy.wait(300);
                cy.get("@item").find('input[type="number"]').invoke("val").then(qty => {
                    expect(Number(qty)).to.be.gte(1);
                });
            }
        });

        // 7. Editar manualmente el input (colocar cantidad 1 siempre válida)
        cy.get("@item").find('input[type="number"]').click().type("{selectall}1").blur();
        cy.wait(300);
        cy.get("@item").find('[data-test="cart-line-total"]').invoke("text").then(text => {
            const manualSubtotal = Number(text.replace(/[^0-9]/g, ""));
            expect(manualSubtotal).to.eq(unitPrice * 1);
        });
    });





    it("ajusta la cantidad al máximo y minimo permitidos", () => {
        cy.login();

        // Agregar un producto al carrito
        cy.get(".grid a").first().contains("Ver detalles").click();
        cy.contains("Agregar al carrito").click();
        cy.get(".carrito").click();

        // Seleccionar el primer producto del carrito
        cy.get('[data-test="cart-item"]').first().as("item");

        // Forzar un valor exageradamente alto en el input (simula poner más que el stock real)
        cy.get('@item').find('input[type="number"]').click().type('{selectall}10000').blur();
        cy.wait(400); // Esperar para que se actualice la UI

        // Verificar que el input se corrigió al máximo disponible (valor > 0)
        cy.get("@item").find('input[type="number"]').invoke("val").then((val) => {
            const cantidad = Number(val);
            expect(cantidad).to.be.greaterThan(0);

            // Verificar que se muestra el mensaje de máximo
            cy.get("@item").contains("¡Máximo disponible!").should("be.visible");

            // Verificar que el botón "+" esté deshabilitado
            cy.get("@item").find('button').contains("+").should("be.disabled");

            // Si el stock máximo es mayor a 1, reducir y verificar que desaparezca el mensaje
            if (cantidad > 1) {
            cy.get("@item").find('button').contains("-").click();
            cy.wait(300);
            cy.get("@item").contains("¡Máximo disponible!").should("not.exist");
            } else {
            // Si solo hay 1 unidad, el botón "-" debe estar deshabilitado
            cy.get("@item").find('button').contains("-").should("be.disabled");
            cy.get("@item").contains("¡Máximo disponible!").should("be.visible");
            }
        });
    });




    it("verifica que el badge del carrito refleja la cantidad total de productos", () => {
        cy.login();

        // Agregar varios productos
        cy.get(".grid a").eq(0).contains("Ver detalles").click();
        cy.contains("Agregar al carrito").click();
        cy.contains("Mi Tienda").click();

        cy.get(".grid a").eq(1).contains("Ver detalles").click();
        cy.contains("Agregar al carrito").click();
        cy.contains("Agregar al carrito").click(); // este se agrega 2 veces
        cy.contains("Mi Tienda").click();

        cy.get(".grid a").eq(2).contains("Ver detalles").click();
        cy.contains("Agregar al carrito").click();

        // Obtener número del badge en el ícono del carrito
        cy.get(".carrito span")
            .should("be.visible")
            .invoke("text")
            .then((badgeText) => {
            const badgeNum = Number(badgeText.trim());

            // Abrir carrito y sumar las cantidades de todos los productos
            cy.get(".carrito").click();
            let suma = 0;
            cy.get('[data-test="cart-item"]').each(($el) => {
                cy.wrap($el)
                .find('input[type="number"]')
                .invoke("val")
                .then((val) => {
                    suma += Number(val);
                });
            }).then(() => {
                // Comparar la suma con el número del badge
                expect(suma).to.equal(badgeNum);
            });
        });
    });


})