const { text } = require("express");

// write tests here
describe('Quotes App', () => {
  beforeEach(() => {
    // Each test needs fresh state
    // They shouldn't rely on other tests
    // All tests should work in isolation!

    cy.visit('http://localhost:1234');
    // This ensures that every time we visit the page, it will be refreshed
    // careful! make sure this is identical to current localhost, may not be 1234
  })

  // Helpers (ie GETTERS)
  const textInput = () => cy.get('input[name=text]');
  const authorInput = () => cy.get('input[name=author]');
  const foobarInput = () => cy.get('input[name=foobar]');
  const submitBtn = () => cy.get(`button[id="submitBtn"]`);
  const cancelBtn = () => cy.get(`button[id="cancelBtn"]`);

  it('sanity check to make sure tests work', () => {
    // 'it' is a test
    // 'expect' is an assertion
    // There can be multipl assertions per test, but they all need to relate 
    // to the one thing we're testing

    expect(1 + 2).to.equal(3);
    expect(2 + 2).not.equal(5); // strict === vs == 
                                // === is strict, does not pass without type coercion (1 !== '1')
                                // == will pass if types are different (1 == '1')
    expect({}).not.to.equal({}); // These are NOT equal
    expect({}).to.eql({}); // This is true
  })

/**
 * const person = {
 *   name: 'Kevin'
 * }
 *                         These are NOT equal, they have different places in memory address
 * const person2 = {
 *   name: 'Kevin'
 * }
 * 
 */

// CI/CD Continuous integration / continuous delivery

it('the proper elements are showing', () => {
    textInput().should('exist');  // does it exist in the DOM
    authorInput().should('exist');
    foobarInput().should('not.exist');
    submitBtn().should('exist');
    cancelBtn().should('exist');

    cy.contains("Submit Quote").should('exist');
    cy.contains(/submit quote/i).should('exist');  // This will ignore casing, can be easier
})

describe('Filling out the inputs and cancelling', () => {
    it('can navigate to the site', () => {
        cy.url().should('include', 'localhost');
    })

    it('submit button starts out disabled', () => {
        submitBtn().should('be.disabled');
    })

    it('can type in the inputs', () => {
      textInput()
        .should('have.value', '')
        .type('CSS rulez')
        .should('have.value', 'CSS rulez');

      authorInput()
        .should('have.value', '')
        .type('CRHarding')
        .should('have.value', 'CRHarding');  
    })

    it('the submit button enables when both inputs are filled out', () => {
        authorInput().type('Kevin');
        textInput().type('This is fun!');
        submitBtn().should('not.be.disabled');
    })

    it('the cancel button can reset the inputs and disable the submit button', () => {
        authorInput().type('Kevin');
        textInput().type('FUN');
        cancelBtn().click();
        textInput().should('have.value', '');
        authorInput().should('have.value', '');
        submitBtn().should('be.disabled');
    })
})

describe('adding a new quote', () => {
  it('can submit and delete the new quote', () => {
    textInput.type("CSS rulez");
    authorInput.type("CRHarding");
    submitBtn().click();
    /**
     * It's important that the state is the same at the beginning of each test!
     * We immediately delete the new post
     * Worst case, restart server script (ctrl-c) and then run 'npm run server'
     * in the real world you'll have a testing database
     */
    cy.contains('CSS rulez').siblings('button:nth-of-type(2').click();
    cy.contains('CSS rulez').should('not.exist');
  })

  it('variation can submit a new quote', () => {
    cy.contains('CSS rulez').should('not.exist');
    textInput().type('CSS rulez');
    authorInput().type("Kevin");
    submitBtn().click();
    cy.contains('CSS rulez');
    cy.contains("Kevin");
    cy.contains('CSS rulez').next().next().click();
    cy.contains('CSS rulez').should('not.exist');
  })
})

describe('Editing an existing quote', () => {
    it('can edit a quote', () => {
        textInput().type('Lorem ipsum');
        authorInput().type('CRHarding');
        submitBtn().click();
        cy.contains('Lorem ipsum').siblings('button:nth-of-type(1)').click();
        textInput().should('have.value', 'Lorem ipsum');
        authorInput().should('have value', 'CRHarding');
        textInput().type(' dolor sit');
        authorInput().type(' Rocks!');
        submitBtn().click();
        cy.contains('Lorem ipsum dolor sit (CRHarding Rocks!)');
        // gotta hit the delete button!
        cy.contains('Lorem ipsum dolor sit (CRHarding Rocks!)').next().next().click();
        cy.contains('Lorem ipsum dolor sit (CRHarding Rocks!)').should('not.exist');
    })
})
})