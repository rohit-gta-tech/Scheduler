describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
   });

   it("It should book an interview", () => {
    cy.visit("/");
    cy.contains("Monday");
    cy.get('[alt=Add]').first().click()
    cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones')
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains('Save').click();
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("It should edit an interview", () => {
    cy.get('[alt=Edit]').first().click({force: true})
    cy.get('[data-testid=student-name-input]').clear();
    cy.get('[data-testid=student-name-input]').type('Justin Singh');
    cy.get("[alt='Tori Malcolm']").click();
    cy.contains('Save').click();
    cy.contains(".appointment__card--show", "Justin Singh");
    cy.contains(".appointment__card--show", "Tori Malcolm");

  });

  it("It should cancel an interview", () => {
    cy.get('[alt=Delete]').first().click({force: true});
    cy.contains('Confirm').click();
    cy.contains("Please hold on while we delete your appointment").should('exist')
    cy.contains("Please hold on while we delete your appointment").should('not.exist')
    cy.get(".appointment__card--show").should('not.exist')

  });
});


