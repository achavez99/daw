// IMPORTS
const path = require('path');
const Utils = require('./testutils');

// CRITICAL ERRORS
let error_critical = null;

// CONSTANTS
const T_TEST = 2 * 60; // Time between tests (seconds)
const browser = new Browser({waitDuration: 100, silent: true});
const path_assignment = path.resolve(path.join(__dirname, "../index.html"));
const URL = "file://" + path_assignment.replace("%", "%25");

const to = function to(promise) {
    return promise
        .then(data => {
            return [null, data];
        })
        .catch(err => [err]);
}; 

//TESTS
describe("MVC_peliculas", function () {

    this.timeout(T_TEST * 1000);

    it("1(Precheck): Comprobando que existe el fichero de la entrega...", async function () {
        this.name = ``;
        this.score = 0;
        this.msg_ok = `Encontrado el fichero '${path_assignment}'`;
        this.msg_err = `No se encontró el fichero '${path_assignment}'`;
        const fileexists = await Utils.checkFileExists(path_assignment);
        if (!fileexists) {
            error_critical = this.msg_err;
        }
        fileexists.should.be.equal(true);
    });

    it("2(Precheck): Comprobando que el fichero contiene HTML válido...", async function () {
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;

        } else {
            this.msg_ok = `El fichero '${path_assignment}' se ha parseado correctamente`;
            this.msg_err = `Error al parsear '${path_assignment}'`;
            [error_nav, resp] = await to(browser.visit(URL));
            if (error_nav) {
                this.msg_err = `Error al parsear '${path_assignment}': ${error_nav}`;
                error_critical = this.msg_err;
            }
        }
        should.not.exist(error_critical);
    });

    it("3: Comprobando la funcionalidad 'Show'...", async function () {
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));

            if (error_nav) {
                this.msg_err = `Error al abrir el fichero ${path_assignment}
                Error: ${error_nav}
                Recibido: ${browser.text('body')}`;
            }
            this.msg_err = "No se encuentra el botón con clase 'show'";

            [error_nav, resp] = await to(browser.click('button[data-my-id="0"].show'));

            if (error_nav) {
                this.msg_err = `Error al hacer click en el botón con clase 'show'`;
            }
            const expected = "Javier Ruiz Caldera";

            this.msg_err = "No se ḿuestra la información de la película";
            this.msg_ok = "La información acerca de la película se muestra correctamente";
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    it("4: Comprobando la funcionalidad 'New'...", async function () {
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));

            if (error_nav) {
                this.msg_err = `Error al abrir el fichero ${path_assignment}
                Error: ${error_nav}
                Recibido: ${browser.text('body')}`;
            }
            this.msg_err = "No se encuentra el botón con clase 'new'";
            [error_nav, resp] = await to(browser.click('.new'));

            if (error_nav) {
                this.msg_err = `Error al hacer click en el botón con clase 'new'`;
            }

            this.msg_err = "No se encuentran inputs";
            browser.assert.elements('input', { atLeast: 3 });

            this.msg_err = "No se encuentra el input con id 'titulo'";
            browser.assert.element('input#titulo');

            this.msg_err = "No se encuentra el input con id 'director'";
            browser.assert.element('input#director');

            this.msg_err = "No se encuentra el input con id 'miniatura'";
            this.msg_ok = "El formulario de crear una nueva película se muestra correctamente";
            browser.assert.element('input#miniatura');

        }
    });
    
    it("5: Comprobando la funcionalidad 'Create'...", async function () {
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            const expected = "Titanic";
            [error_nav, resp] = await to(browser.visit(URL));
            if (error_nav) {
                this.msg_err = `Error al abrir el fichero ${path_assignment}
                Error: ${error_nav}
                Recibido: ${browser.text('body')}`;
            }
            this.msg_err = "No se encuentra el botón con clase 'new'";
            [error_nav, resp] = await to(browser.click('.new'));
            if (error_nav) {
                this.msg_err = `Error al hacer click en el botón con clase 'new'`;
            }
            this.msg_err = "No se encuentra el input con clase 'titulo'";

            [error_nav, resp] = await to(browser.fill('#titulo', "Titanic"));
            if (error_nav) {
                this.msg_err = `Error al rellenar el campo de título`;
            }

            this.msg_err = "No se encuentra el input con clase 'director'";
            [error_nav, resp] = await to(browser.fill('#director', "James Cameron"));
            if (error_nav) {
                this.msg_err = `Error al rellenar el campo de director`;
            }

            this.msg_err = "No se encuentra el input con clase 'miniatura'";
            [error_nav, resp] = await to(browser.fill('#miniatura', "https://www.storytel.com/images/200x200/0000011196.jpg"));
            if (error_nav) {
                this.msg_err = `Error al rellenar el campo de miniatura`;
            }

            this.msg_err =  `Error al hacer click en el botón con clase 'create'`;
            [error_nav, resp] = await to(browser.click('.create'));

            if (error_nav) {
                this.msg_err = `Error al hacer click en el botón con clase 'create'`;
            }

            this.msg_ok = "Se ha creado correctamente una nueva película";
            this.msg_err = "No se ha creado correctamente una nueva película";
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    it("6: Comprobando la funcionalidad 'Delete'...", async function () {
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));
            if (error_nav) {
                this.msg_err = `Error al abrir el fichero ${path_assignment}
                Error: ${error_nav}
                Recibido: ${browser.text('body')}`;
            }
            let movies = browser.querySelectorAll('.movie');
            const expected = movies.length - 1;

            this.msg_err = "No se encuentra el botón con clase 'delete'";
            [error_nav, resp] = await to(browser.click('button.delete'));
            if (error_nav) {
                this.msg_err =  `Error al hacer click en el botón con clase 'delete'`;
            }
            const newMovies = browser.querySelectorAll('.movie');
            this.msg_err = `Número erróneo de películas\n\t\t\t Esperadas:${expected}\n\t\t\t Encontradas:${newMovies.length}`;
            this.msg_ok = "Se ha borrado correctamente una película";
            newMovies.length.should.be.equal(expected);
        }
    });

    it("7: Comprobando la funcionalidad 'Reset'...", async function () {
        this.name = ``;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));
            let movies = browser.querySelectorAll('.movie');
            const expected = 3;
            browser.document._localStorage["mis_peliculas"] = "[]";
            browser.assert.evaluate("indexContr()", undefined);
            this.msg_err = "No se encuentra el botón con clase 'reset'";
            [error_nav, resp] = await to(browser.click('button.reset'));
            if (error_nav) {
                this.msg_err =  `Error al hacer click en el botón con clase 'reset'`;
            }

            this.msg_ok = `Se han restaurado correctamente las películas iniciales`;
            this.msg_err = `No se han restaurado correctamente las películas.
            \t\t\t Esperadas:${expected}
            \t\t\t Encontradas:${browser.querySelectorAll('.movie').length}`;
            // [error_nav, resp] = await to(browser.visit(URL));
            JSON.parse(browser.document._localStorage["mis_peliculas"]).length.should.be.equal(expected);
            (browser.querySelectorAll('.movie').length).should.be.equal(expected);
        }
    });

    after(async function() {
        try {
            await browser.tabs.closeAll(); 
        } catch(e) {}
    });
});
