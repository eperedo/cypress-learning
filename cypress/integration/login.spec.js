describe('Formulario de Login', () => {
	it('Ingresando credenciales incorrectas', () => {
		cy.visit('http://localhost:8081');

		// Escribir el email del usuario
		cy.get('input#email-input').type('fake@email.com');

		// Escribir una contraseña incorrecta
		cy.get('input#pass-input').type('theFakePass123');

		// Click sobre el botón **Submit**
		cy.get('button#btn-login').click();

		// Verificar que aparezca el mensaje indicando el error.
		cy.contains('p', 'Así no se puede, credenciales incorrectas');
	});

	it('Ingresando credenciales correctas', () => {
		cy.visit('http://localhost:8081');
		// Escribir el email del administrador
		cy.get('input#email-input').type('admin@mail.com');
		// Escribir una contraseña correcta
		cy.get('input#pass-input').type('theRealPass123');
		// Click sobre el botón **Submit**
		cy.get('button#btn-login').click();
		// Verificar que la nueva ruta es /welcome
		cy.url().should('include', '/welcome');

		cy.contains('h1', 'Bienvenido!');
	});
});
