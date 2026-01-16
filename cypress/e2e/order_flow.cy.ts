describe("order create and receive", () => {
  it("creates and receives an order", () => {

    cy.login();

    cy.intercept("POST", "/orders/create/").as("createOrder");

    cy.visit("http://localhost:5173/orders/create");

    cy.url().should("include", "/orders/create");

    cy.get('#root select').should("exist").select("1");

    cy.get('#root div.product-table div:nth-child(1) button').click();

    cy.get('#root input').clear().type("10");

    cy.get('#root div.actions button').click();

    cy.wait("@createOrder").its("response.statusCode").should("eq", 201);

    cy.url().should("include", "/orders");

  });
  
});