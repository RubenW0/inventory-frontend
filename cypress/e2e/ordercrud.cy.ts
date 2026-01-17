it('ordercreateandreceive', function() {
  cy.visit('http://localhost:5173/login');
  
  cy.get('[name="username"]').type('admin');
  cy.get('[name="password"]').type('admin');
  cy.get('button.auth-btn').click();

  cy.url().should("include", "/products");

  cy.get('a[href="/orders"]').click();
  cy.url().should("include", "/orders");

  cy.get('button.add-btn').click();

  cy.get('select').select('1');

  cy.get('.product-table button').first().click();

  cy.get('.quantity-controls button')
    .contains('+')
    .click()
    .click()
    .click()
    .click();

  cy.get('.actions button').click();

  cy.get('table.order-table tbody tr', { timeout: 8000 })
    .first()
    .should('exist')
    .click();

  cy.contains('button', /mark as delivered/i).click();

  cy.contains('p', /status:\s*received/i)
    .should('exist');

  cy.get('a[href="/products"]').click();
});
