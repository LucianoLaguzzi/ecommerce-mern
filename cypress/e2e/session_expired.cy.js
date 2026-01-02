describe("Sesión expirada", () => {
  beforeEach(() => {
    // Simular usuario logueado
    window.localStorage.setItem(
      "auth",
      JSON.stringify({
        token: "fake-expired-token",
        user: { _id: "1", name: "Admin", isAdmin: true }
      })
    );
  });

  it("muestra Swal y redirige al login", () => {
    cy.intercept("GET", "/api/orders", {
      statusCode: 401,
      body: { message: "Token expirado" }
    }).as("getOrders");

    cy.visit("/admin/orders");

    // Swal visible
    cy.contains("Sesión expirada").should("be.visible");
    cy.contains("Ir al login").click();

    cy.url().should("include", "/login");

    cy.window().then(win => {
      expect(win.localStorage.getItem("auth")).to.be.null;
    });
  });
});
