Ok, cypress oficialmente no es más un producto en fase beta y aunque incluso en beta
ya era muy bueno creo que es hora de darle mucho más tiempo e ir descubriendo su
total utilidad.

Siempre odié hacer pruebas de tipo **end to end (e2e)** por dos razones: la primera y la segunda! 🤭

Bueno la primera es que son demasiado lentas, todo bien cuando la aplicación tiene pocas pantallas
o funcionalidades no muy complejas, pero a medida la aplicación crece tienes que esperar mucho
tiempo para completar el proceso de testing.

La segunda es que el _setup_ de un entorno para **e2e** puede ser muy complicado porque tengo que tener un servidor donde esté corriendo todo lo necesario para que la aplicación pueda ejecutar las pruebas en cualquier momento: Base de Datos, Http APIS, scripts que generen/borren data, etc.

La tercera es consecuencia de las dos primeras: ES CARO! Las tareas anteriores requieren de muchos recursos que
alguien va a tener que pagar. Ok ya sé que solo dije 2 razones y al final escribí 3, pero se me ocurrió cuando terminaba de escribir la segunda y me dio flojera editarlo así que preferí mandarme toda esta explicación en lugar
de simplemente cambiar el número de arriba porque 0 sentido común.

### Qué demonios es Cypress?

Pues estoy desarrollando una app que requiere un login simple: email y contraseña. Ya escribí el código necesario luce así:

![Cypress Login Example](https://s3.amazonaws.com/eperedo-blog/cypress-app-test.png)

Ahora me toca probar si realmente mi código funciona, abro mi browser y efectivamente veo mi formulario de login, completo los campos y al hacer click sobre el botón no sucede nada. Reviso el código y me doy cuenta que no tomé en cuenta el caso en el que el usuario escriba mal sus credenciales. Bueno no es tan grave me digo a mi mismo para asolapar mi ineptitud y poca visión. Válido el escenario y escribo el código que muestra un mensaje al usuario indicándole su falta de memoria o poca destreza con el teclado. Vuelvo a mi browser, pero esta vez voy a probar el caso de credenciales inválidas, completo el formulario y hago click sobre el botón y muestra el mensaje que quería. Todo bien, pero aún no he probado el caso inicial! Cuando las credenciales son correctas! Nuevamente abro mi browser, completo el formulario con datos válidos click en el botón y veo que funciona bien y me envia a una página distinta donde puedo ver un mensaje de bienvenida.

Para una funcionalidad tan pequeña y común tuve que abrir mi browser y completar el formulario 3 veces.

- Cuando no consideré el caso de las credenciales incorrectas
- Cuando iba a probar las credenciales incorrectas
- Cuando iba a probar las credenciales correctas

Que bonito sería poder volar, pero también que la tecnología nos permita automatizar estas pruebas y no tener
que hacer esto de manera manual 🤔. Pues Cypress es una herramienta que resuelve este problema y al ser algo automatizado reduce el % de error en un 99.65 % según una estadistica realizada en mi casa a 15 personas de las cuales solo 1 es programador.

### Instalar Cypress

Ya tengo nodejs y npm en mi laptop así que solo me queda crear un **package.json** para poder manejar cypress como dependencia de mi proyecto.

```bash
cd [ruta-a-mi-carpeta]
npm init -f
```

Se genera el package.json y ahora el complicado y tortuoso camino a instalar cypress

```bash
npm i cypress -D
```

Luego de unos cuantos segundos - como unos 10000 😆 - termina la instalación y ya puedo trabajar con cypress. Usando el comando open puedo abrir su panel y a la vez me va a generar la configuración necesaria para empezar a escribir mis pruebas y automatizar mi formulario de login.

Para poder abrir cypress voy a crear un script asi puedo ponerle un alias más sencillo de recordar.

(Se omiten otra información del package.json por temas de espacio)

```json
{
	"scripts": {
		"co": "cypress open"
	},
	"devDependencies": {
		"cypress": "3.1.0"
	}
}
```

Listo, ahora si escribo **npm run co** en mi terminal deberían pasar dos cosas:

1. Se crea una carpeta **cypress** con toda la configuración de cypress
2. Se abre el panel de **cypress** donde puedo ir viendo las pruebas que voy escribiendo.

Dentro de la carpeta **cypress** hay otras carpetas con varios archivos de ejemplo que luego iré revisando
como apoyo de ciertos casos de uso así no tengo que ir a la documentación a cada momento.

### Creando pruebas

Cypress me da una estructura de carpetas y me pide que cada prueba que voy a escribir la ponga en la carpeta **integration** así que voy a esa carpeta y creo un archivo **login.spec.js**.
El sufijo **spec** le permite a cypress saber que ese archivo servirá como pruebas y por lo tanto lo debe ejecutar.

Dentro del archivo tengo que definir mis pruebas de la siguiente manera:

```js
describe('Formulario de Login', () => {
	it('Ingresando credenciales incorrectas', () => {
		// codigo de prueba acá
	});

	it('Ingresando credenciales correctas', () => {
		// codigo de prueba acá
	});
});
```

El método **describe** me permite agrupar muchas pruebas bajo un nombre o descripción, en este caso uso **Formulario de Login** porque es la mejor manera de describir las pruebas que tendré en este archivo.

El segúndo parametro del método describe es una función en la que debo definir otras funciones llamdas **it**.

El método **it** son las pruebas que cypress va a ejecutar, al igual que describe recibe dos parámetros: un nombre que describa lo que estoy probando y una función donde indico el código para automatizar el proceso. El método **it** siempre debe tener un **assert** que es la forma en la cual cypress sabe si la prueba fue ejecutada con exito o falló.

Voy al panel de cypress y veo lo siguiente en el panel

![Cypress Panel](https://s3.amazonaws.com/eperedo-blog/cypress-panel.png)

Y al darle click sobre **login.spec.js** debe abrirse una instancia de Chrome y ejecutar las pruebas vacías.

![Cypress Chrome Test](https://s3.amazonaws.com/eperedo-blog/cypress-login-test.png)

Cypress me dice que mis dos pruebas pasaron correctamente, pero también me muestra un mensaje indicando que no hice nada dentro de las pruebas.

### Escribiendo código para la prueba

Como forma personal de escribir test lo primero que hago es describir el flujo que quiero probar de manera simple, para el caso de credenciales incorrectas sería:

- Abrir la página que tiene el formulario de login
- Escribir el email del usuario
- Escribir una contraseña incorrecta
- Click sobre el botón **Submit**
- Verificar que aparezca el mensaje indicando el error.

Para llevar esto a una prueba de cypress sería lo siguiente

```js
it('Ingresando credenciales incorrectas', () => {
	// Abrir la página que tiene el formulario de login
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
```

La variable **cy** es injectada de manera global por cypress y me permite acceder a muchos métodos para manipulación de la instancia de Chrome. El método **visit** le dice a cypress sobre que página web haré las pruebas, en este caso mi servidor local en el puerto 8081.

El método get me permite acceder a un elemento del DOM, es casi la misma funcionalidad del método **querySelector** y permite encadenar otros métodos como **type** ya que al ser un input me permite escribir algo sobre él.
Para mi prueba lo que hago es obtener el input donde está el email y el password y tipear valores sobre ellos.

Para el caso del botón uso el método **click** ya que es la acción que quiero realizar una vez tipeados los valores en los inputs.

Por último debo verificar que el mensaje de error aparezca para que el usuario sepa que - como siempre - hizo algo mal. Para eso he usado el método **contains** que busca un elemento en el DOM que tenga un texto en específico. En este caso el texto es **Así no se puede, credenciales incorrectas**.

Mientras voy escribiendo la prueba cypress tiene un _watch_ sobre mi codigo y va a ejecutando la prueba así no tengo que escribir el comando **npm run co** cada vez que hago cambios. Aunque he notado que si tengo un error grave de sintaxis el proceso _crashea_ y pues no queda otra que volver a correr el comando **co**.

Luego de escribir el código para credenciales incorrectas vuelvo a cypress y veo lo siguiente:

![Cypress Test OK](https://s3.amazonaws.com/eperedo-blog/cypress-test-result-1.png)

La siguiente prueba es muy parecida, vuelvo a plantearme el flujo y lo plasmo en lenguaje humano:

- Abrir la página que tiene el formulario de login
- Escribir un email válido
- Escribir una contraseña correcta
- Click sobre el botón **Submit**
- Se debe abrir la nueva página /welcome
- Debe aparecer un mensaje de **Bienvenido!**

Ahora en un lenguaje de verdad:

```js
it('Ingresando credenciales correctas', () => {
	cy.visit('http://localhost:8081');
	// Escribir el email válido
	cy.get('input#email-input').type('admin@mail.com');
	// Escribir una contraseña correcta
	cy.get('input#pass-input').type('theRealPass123');
	// Click sobre el botón **Submit**
	cy.get('button#btn-login').click();
	// Verificar que la nueva ruta es /welcome
	cy.url().should('include', '/welcome');
	// Verificar mensaje de Bienvenido
	cy.contains('h1', 'Bienvenido!');
});
```

Luego de [leer la documentación](https://docs.cypress.io/api/introduction/api.html) descubrí que la forma de verificar la URL actual es usando el método **url** 😒
y luego hago un assert usando **should** que recibe dos parametros: el primero es un _chainer_ con el cual le digo a cypress como debe validar mi assert y el segundo parámetro es el valor que espero que se valide. Uso **include** porque voy a verificar que dentro de la URL de mi web se incluya la palabra **/welcome** ya que eso me confirma que luego de presionar click sobre el botón el usuario está en la url **http://localhost:8081/welcome.html**.
Por último usando **contains** verifico que dentro de la nueva página exista un elemento h1 y que contenga el texto **Bienvenido!**.

Listo, una funcionalidad de mi aplicación totalmente automatizada.

### Ventajas

1. Cypress usa [mocha](https://mochajs.org/) como test framework así que me resulta familiar escribir las pruebas.
2. Más rápido que otras herramientas similares tipo Nightwatch, Protractor, etc ya que no está basado en Selenium.
3. Incluye un UI que permite administrar tus pruebas
4. Puedes crearte una cuenta y tener un dashboard dónde se graban los tests que ejecutas. [Existe un plan gratuito y también opciones de pago para esto](https://www.cypress.io/pricing/).

### Desventajas

1. Solo se puede probar en Chrome 😭
