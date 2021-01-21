// IMPORTS
const path = require('path');
const Utils = require('./testutils');

// CRITICAL ERRORS
let error_critical = null;

// CONSTANTS
const T_TEST = 2 * 60; // Time between tests (seconds)
const browser = new Browser({waitDuration: 100, silent: true});
const path_assignment = path.resolve(path.join(__dirname, "../index.html"));
const URL = "file://"+path_assignment.replace("%", "%25");
const showBoss = (game) => {
    game.shoot(game.player);
    game.playerShots[0].x = game.opponent.x + 5;
    game.playerShots[0].y = game.opponent.y + game.opponent.height + 10;
    game.render();
}
//TESTS
describe("Juego", function () {

    this.timeout(T_TEST * 1000);
  
    it("1(Precheck): Comprobando que existe el fichero de la entrega...", async function () {
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
            [error_nav, resp] = await Utils.to(browser.visit(URL));
            if (error_nav) {
                this.msg_err = `Error al parsear '${path_assignment}': ${error_nav}`;
                error_critical = this.msg_err;
            }
        }
        should.not.exist(error_critical);
    });

    it("3(Precheck): Comprobando que existe una instancia de la clase 'Game'...", async function () {
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await Utils.to(browser.visit(URL));
            if (error_nav) {
                 this.msg_err = `Error al abrir el fichero ${path_assignment}`;
            }
            await browser.wait({ duration: 500 });
            this.msg_ok = `Instancia de clase 'Game' iniciada`;
            this.msg_err = `No se encuentra instancia de la clase 'Game' iniciada`;
            browser.window.game.started.should.be.equal(true);
        }
    });

    it("4: Comprobando que existe el elemento 'Score'...", async function () {
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await Utils.to(browser.visit(URL));
            if (error_nav) {
                this.msg_err = `Error al abrir el fichero ${path_assignment}
                Error: ${error_nav}
                Recibido: ${browser.text('body')}`;
            }
            this.msg_err = `No se encuentra ningún elemento 'li' con id 'scoreli'`;
            await browser.wait({ duration: 500 });
            const scoreli = browser.html("li#scoreli");
            this.msg_ok = "Se ha encontrado el componente 'Score'";
            this.msg_err = `El elemento 'li' con id 'scoreli'  ${ scoreli ? ("contiene '"+ scoreli +"'") : "esta vacío"} en vez de contener la puntuación en el formato especificado por el enunciado`;
            Boolean(scoreli.match(/Score: ?\d+/)).should.be.equal(true);
        }
    });

    it("5: Comprobando que existe el elemento 'Lives'...", async function () {
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await Utils.to(browser.visit(URL));

            if (error_nav) {
                this.msg_err = `Error al abrir el fichero ${path_assignment}
                Error: ${error_nav}
                Recibido: ${browser.text('body')}`;
            }
            await browser.wait({ duration: 500 });
            this.msg_err = `No se encuentra ningún elemento 'li' con id 'livesli'`;
            const livesli = browser.html("li#livesli");
            this.msg_ok = "Se ha encontrado el componente 'Lives'";
            this.msg_err = `El elemento 'li' con id 'livesli'  ${ livesli ? ("contiene '"+ livesli + "'") : "esta vacío"} en vez de contener el número de vidas en el formato especificado por el enunciado`;
            this.msg_ok = "Se ha encontrado el componente 'Lives'";
            Boolean(livesli.match(/Lives: ?\d+/)).should.be.equal(true);
        }
    });

    it("6: Comprobando que el 'Score' funciona...", async function () {
        this.score = 1.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await Utils.to(browser.visit(URL));

            if (error_nav) {
                this.msg_err = `Error al abrir el fichero ${path_assignment}
                Error: ${error_nav}
                Recibido: ${browser.text('body')}`;
            }
            this.msg_err = "La funcionalidad de 'Score' no ha sido implementada";
            await browser.wait({ duration: 500 });
            const scoreInitial = parseInt(browser.html("li#scoreli").match(/Score: ?(\d+)/)[1]);
            this.msg_err = "No se encuentra la instancia de 'Game' en el JavaScript";
            const { game } = browser.window;
            this.msg_err = "Ha fallado el método 'collide' del oponente";
            game.opponent.collide();
            await browser.wait({ duration: 2500 });
            const scoreFinal = parseInt(browser.html("li#scoreli").match(/Score: ?(\d+)/)[1]);
            this.msg_ok = "El campo 'Score' ha aumentado tras disparar al oponente";
            this.msg_err = "El campo 'Score' NO ha aumentado tras disparar al oponente";
            scoreFinal.should.be.equal(scoreInitial + 1);
        }
    });

    it("7: Comprobando que 'Lives' funciona...", async function () {
        this.score = 1.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await Utils.to(browser.visit(URL));

            if (error_nav) {
                this.msg_err = `Error al abrir el fichero ${path_assignment}
                Error: ${error_nav}
                Recibido: ${browser.text('body')}`;
            }
            this.msg_err = "La funcionalidad de 'Lives' no ha sido implementada";
            const livesInitial = parseInt(browser.html("li#livesli").match(/Lives: ?(\d+)/)[1]);
            this.msg_err = "No se encuentra la instancia de 'Game' en el JavaScript";
            await browser.wait({ duration: 500 });
            const { game } = browser.window;
            this.msg_err = "Ha fallado el método 'collide' del jugador";
            game.player.collide();
            await browser.wait({ duration: 1000 });
            const livesFinal = parseInt(browser.html("li#livesli").match(/Lives: ?(\d+)/)[1]);
            this.msg_ok = "El jugador ha perdido una vida tras ser disparado";
            this.msg_err = "El jugador NO ha perdido una vida tras ser disparado";
            livesInitial.should.be.equal(livesFinal + 1);
        }
    });

    it("8: Comprobando que una instancia de 'Boss' aparece cuando muere el oponente...", async function () {
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await Utils.to(browser.visit(URL));

            if (error_nav) {
                this.msg_err = `Error al abrir el fichero ${path_assignment}
                Error: ${error_nav}
                Recibido: ${browser.text('body')}`;
            }
            this.msg_err = "No se encuentra la instancia de 'Game' en el JavaScript";
            await browser.wait({ duration: 500 });
            const { game } = browser.window;
            this.msg_err = "Ha fallado el método 'collide' del jugador";
            
            showBoss(game)
            await browser.wait({ duration: 3000 });
            this.msg_ok = "El 'Boss' aparece tras matar al oponente";
            this.msg_err = "El 'Boss' NO aparece tras matar al oponente";
            browser.queryAll(".Boss").length.should.be.equal(1);
        }

    });
    it("9: Comprobando la velocidad del 'Boss'...", async function () {
        this.score = 2;
        if (error_critical) {
           this.msg_err = error_critical;
           should.not.exist(error_critical);
       } else {
           [error_nav, resp] = await Utils.to(browser.visit(URL));

           if (error_nav) {
               this.msg_err = `Error al abrir el fichero ${path_assignment}
               Error: ${error_nav}
               Recibido: ${browser.text('body')}`;
           }

            this.msg_err = "No se encuentra la instancia de 'Game' en el JavaScript";
            await browser.wait({ duration: 500 });
            const { game } = browser.window;
            this.msg_err = "No se encuentra la clase 'Boss'";
            const boss = browser.evaluate("new Boss(game)");
            this.msg_err = "El oponente no tiene atributo 'speed'";
            const opponentSpeed = game.opponent.speed;
            const bossSpeed = boss.speed;
            this.msg_ok = "El 'Boss' se mueve al doble de velocidad que el oponente";
            this.msg_err =  "El 'Boss' NO se mueve al doble de velocidad que el oponente";
            bossSpeed.should.be.equal(opponentSpeed*2);
        }

    });

    it("10: Comprobando que aparece la imagen de 'You win'...", async function () {
        this.score = 1;
        if (error_critical) {
           this.msg_err = error_critical;
           should.not.exist(error_critical);
       } else {
           [error_nav, resp] = await Utils.to(browser.visit(URL));

           if (error_nav) {
               this.msg_err = `Error al abrir el fichero ${path_assignment}
               Error: ${error_nav}
               Recibido: ${browser.text('body')}`;
           }

            this.msg_err = "No se encuentra la instancia de 'Game' en el JavaScript";
            await browser.wait({ duration: 500 });
            const { game } = browser.window;
            this.msg_err = "Ha fallado el método 'collide' del oponente";
            try {
                showBoss(game);
                await browser.wait({ duration: 2500 });
                showBoss(game);
                await browser.wait({ duration: 2500 });

            } catch (e) {
                game.endGame(true);
                await browser.wait({ duration: 2500 });
            }
            this.msg_err =  "No aparece la imagen de 'You win' al ganar";
            this.msg_ok = "La imagen de 'You win' aparece al ganar el juego";
            const youWin = browser.html('img').match(/you_win\.png/).length > 0;
            youWin.should.be.equal(true);
        }

    });

    after(async function() {
        try {
            await browser.tabs.closeAll(); 
        } catch(e) {}
    });
});
