//Creo la funcion para tomar los datos del boton al dar click
const teclas = document.getElementById('teclas'),
    pantallas = document.getElementById('pantalla')

let operacionEstado = false,
    numero1,
    tipoOperacion,
    puntos


const calculadora = () => {
    if (!teclas) return
    teclas.addEventListener('click', e => {
        const t = e.target,
            d = t.dataset
            //Detecta si pulsamos un numero
        if (d.numero) writeScreen(d.numero)
            //Detecta si pulsamos una operacion matematicas
        if (d.matematica) getOperation(t, d.matematica)
            //Detecta si pulsamos operacion de lipiar o igual
        if (d.operacion) runOperation(d.operacion)
    })
}

//Esta funcion es para tomar los numeros y concatenarlos
const writeScreen = numero => {
    pantallas.textContent === '0' || operacionEstado === true ?
        pantallas.textContent = numero :
        pantallas.textContent += numero
    operacionEstado = false
}

// Esta funcion selecciono la operacion matematica
const getOperation = (elemento, opMatematica) => {
    operacionEstado = true
    numero1 = Number(pantallas.textContent)
    tipoOperacion = opMatematica
    pantallas.textContent = elemento.textContent
        //return {numero1, tipoOperacion}
}

//Esta Funcion es hacer los calculos
const runOperation = operacion => {

    const getresult = (numero1, tipoOperacion) => {
        const numero2 = Number(pantallas.textContent)
        let resultado
        switch (tipoOperacion) {
            case 'suma':
                resultado = numero1 + numero2
                break

            case 'multi':
                resultado = numero1 * numero2
                break

            case 'resta':
                resultado = numero1 - numero2
                break

            case 'divide':
                resultado = numero1 / numero2
                break
            default:
                break;
        }

        resultado === Infinity ?
            pantallas.textContent = 'Error!!!' :
            pantallas.textContent = resultado
    }

    operacion === 'limpiar' ?
        pantallas.textContent = '0' :
        getresult(numero1, tipoOperacion)
    operacionEstado = true
}

calculadora()