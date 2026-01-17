describe("Product CRUD flow", () => {

  it("should create, update and delete a product", () => {

    // LOGIN
    cy.visit("http://localhost:5173/login");

    cy.get('[name="username"]').type("ruben");
    cy.get('[name="password"]').type("test123");
    cy.get("button.auth-btn").click();

    cy.url().should("include", "/products");

    // WAIT FOR PRODUCTS TO LOAD
    cy.get(".product-table", { timeout: 8000 }).should("be.visible");

    // CREATE PRODUCT
    cy.get(".add-btn").click();

    // --- VELDEN INVULLEN ---
    cy.contains("label", "Name")
      .find("input")
      .type("TestProduct123");

    cy.contains("label", "Type")
      .find("select")
      .select("Tiles");

    cy.contains("label", "Stock Quantity")
      .find("input")
      .type("10");

    cy.contains("label", "Min Stock")
      .find("input")
      .type("2");

    cy.contains("label", "Advised Price")
      .find("input")
      .type("15");

    cy.contains("label", "Location")
      .find("input")
      .type("A1");

    cy.get(".save-btn").click();

    // CHECK PRODUCT EXISTS
    cy.contains("td", "TestProduct123", { timeout: 8000 }).should("exist");

    // UPDATE PRODUCT
    cy.contains("tr", "TestProduct123")
      .find(".edit-btn")
      .click();

    cy.contains("label", "Name")
      .find("input")
      .clear()
      .type("UpdatedProduct123");

    cy.get(".save-btn").click();

    // CHECK UPDATED NAME
    cy.contains("td", "UpdatedProduct123", { timeout: 8000 }).should("exist");

    // DELETE PRODUCT
    cy.contains("tr", "UpdatedProduct123")
      .find(".delete-btn")
      .click();

    // CHECK PRODUCT IS GONE
    cy.contains("td", "UpdatedProduct123").should("not.exist");
  });

});
