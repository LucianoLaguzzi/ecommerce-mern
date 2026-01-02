describe("Auth vía API + DB real", () => {
  const unique = Date.now();
  const user = {
    name: `UsuarioQA_${unique}`,
    email: `qa_${unique}@mail.com`,
    password: "123456",
  };

  it("crea un usuario, lo loguea y accede al perfil", () => {
    // 1️⃣ Crear usuario real (DB)
    cy.request("POST", "http://localhost:5000/api/auth/register", {
      name: user.name,
      email: user.email,
      password: user.password,
    });

    // 2️⃣ Login por API
    cy.request("POST", "http://localhost:5000/api/auth/login", {
      email: user.email,
      password: user.password,
    }).then((res) => {
      const authData = {
        token: res.body.token,
        user: {
          _id: res.body._id,
          name: res.body.name,
          email: res.body.email,
          isAdmin: res.body.isAdmin,
        },
      };

      // Igual que tu AuthProvider
      window.localStorage.setItem("auth", JSON.stringify(authData));
    });

    // 3️⃣ Ir a perfil
    cy.visit("/profile");

    // 4️⃣ Validaciones
    cy.contains(user.name).should("be.visible");
    cy.contains(user.email).should("be.visible");
  });
});
