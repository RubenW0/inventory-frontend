describe("order create and receive", () => {
  it("creates and receives an order", () => {

    // Login via API (snel + stabiel)
    cy.login();

    // Intercept vóór visit()
    cy.intercept("POST", "/orders/create/").as("createOrder");

    // Gebruik de Docker frontend
    cy.visit("http://localhost:5173/orders/create");

    cy.url().should("include", "/orders/create");

    // Supplier selecteren
    cy.get('#root select').should("exist").select("1");

    // Eerste product toevoegen
    cy.get('#root div.product-table div:nth-child(1) button').click();

    // Aantal invullen
    cy.get('#root input').clear().type("10");

    // Order opslaan
    cy.get('#root div.actions button').click();

    // Wachten op backend response
    cy.wait("@createOrder").its("response.statusCode").should("eq", 201);

    // Redirect naar orders
    cy.url().should("include", "/orders");

  });
  
});

//     // Eerste order openen
//     cy.get('#root table tbody tr')
//       .first()
//       .find('td')
//       .eq(3)
//       .find('a')
//       .click();

//     cy.url().should("match", /\/orders\/\d+$/);

//     // Order ontvangen
//     cy.get('#root div.order-page button').should("exist").click();

//     // Terug naar producten
//     cy.get('#root a[href="/products"]').click();
//     cy.url().should("include", "/products");
//   });
// });
