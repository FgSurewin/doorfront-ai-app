describe('Testing the tests', () => {
    before(()=>{
        cy.visit('localhost:3000/login')
        cy.waitForReact(1000, '#root');
    })
    beforeEach(()=>{
        cy.waitForReact(1000, '#root');
    })

    it('log-in', ()=>{
        //const user = cy.react('header').find('button')
        cy.react('Field', {props:{name:'email'}}).type('test@test.com')
        cy.react('Field', {props:{name:'password'}}).type('test')
        cy.react('button', {props:{type:'submit'}}).click()
    });

    it('Access Map', () => {
        cy.react('MapboxMap').trigger('mouseover')
    })

    it('Access Profile',() => {
        cy.visit('localhost:3000/profile')
        cy.waitForReact(1000, '#root');
        cy.react("Tabs").react("Tab",{props:{label:'Change Settings'}}).click()
    });

})