describe('Formulario de Login', () => {
	it('Ingresando credenciales incorrectas', () => {
		const user = {
			email: 'fake@email.com',
			password: 'theFakePass123',
		};
		cy.login(user);
		// Verificar que aparezca el mensaje indicando el error.
		cy.contains('p', 'Así no se puede, credenciales incorrectas');
	});

	it('Ingresando credenciales correctas', () => {
		const user = {
			email: 'admin@mail.com',
			password: 'theRealPass123',
		};
		cy.login(user);
		// Verificar que la nueva ruta es /welcome
		cy.url().should('include', '/welcome');
		cy.contains('h1', 'Bienvenido!');
	});
});
