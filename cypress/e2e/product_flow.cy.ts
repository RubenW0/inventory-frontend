it('login create order', function() {
  cy.visit('http://localhost:5173/login');
  
  cy.get('#root [name="username"]').should("be.visible").type('ruben');
  cy.get('#root [name="password"]').should("be.visible").type('test123');
  cy.get('#root button.auth-btn').should("be.enabled").click();

  cy.url().should("eq", "http://localhost:5173/");

  cy.get('#root a[href="/products"]').click();
  cy.url().should("include", "/products");

  cy.get('#root button.add-btn').should("be.visible").click();

cy.get('#root label:nth-child(1) input').type('Product X');

cy.contains("label", "Type")
  .find("select")
  .select("Tiles");

cy.get('#root label:nth-child(3) input').type('10');
cy.get('#root label:nth-child(4) input').type('1');
cy.get('#root label:nth-child(5) input').type('22');

cy.contains("label", "Location") .find("input") .type("A1");

cy.get('#root button.save-btn').click();

cy.url().should("include", "/products");

});
