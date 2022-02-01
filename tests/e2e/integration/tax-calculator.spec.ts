/// <reference types="Cypress" />

import { equal } from 'assert';

describe('Home Page', () => {
  it('should display the app name on the home page', () => {
    cy.visit('http://localhost:4200');
    cy.get('.toolbar').should('contain.text', 'Points - Free Tax Calculator');
  });
});

describe('Page Validation', () => {
  it('Page display three cards as expected', () => {
    cy.get('.child-cards').should('have.length', 3);
  });

  it('Tax Table to show No records on intitial load', () => {
    cy.get('.no-records')
      .should('be.visible')
      .and('contain.text', 'No records.');
  });

  it('Should capture Input by user and submit', () => {
    cy.get('.select').eq(0).click();
    cy.get('.mat-option').contains('2020').click();
    cy.get('input[name="amount"]').type('120000');
    cy.get('input[name="amount"]').should('have.value', 120000);
    cy.get('.calculate').click();
    cy.wait(3000);
    cy.get('.tax-rate').should('have.text', '0.26%');
    cy.get('.tax-bracket').should('have.text', ' 97069-150473 ');
    cy.get('.tax-due').should('have.text', '$31,200.00');
  });
});
