import { escribir, hablar, precargarAudio } from "./funcionalidades.js"

const btnComenzar = document.getElementById('btn-comenzar')
const btnContinuarNombre = document.getElementById('btn-continuar-nombre')
const btnContinuarInfo = document.getElementById('btn-continuar-info')

const contComienzo = document.getElementById('cont-comienzo')
const contFormNombre = document.getElementById('cont-form-nombre')
const contFormInfo = document.getElementById('cont-form-info')

const inputNombre = document.getElementById("nombre")
const formNombre = document.getElementById('form-nombre')
const formInfo = document.getElementById('form-info')

const textoUno = document.getElementById("textoUno");
const textoDos = document.getElementById("textoDos");
const textoTres = document.getElementById("textoTres");

let textos;

async function cargarTextos() {
    const res = await fetch("../data/textos.json");
    textos = await res.json();
}

btnComenzar.addEventListener("click", async () => {

    await cargarTextos();

    await precargarAudio(textos.textoUno);
    await precargarAudio(textos.textoDos);

    contComienzo.style.display = "none"
    contFormNombre.style.display = "flex"

    siguientePaso()
})

let paso = 0;

function siguientePaso(){

    paso++;

    if(paso === 1){
        escribir(textos.textoUno, textoUno, 0, siguientePaso)
        precargarAudio(textos.textoDos);
        alert(paso)
    }

    if(paso === 2){
        textoDos.style.display = 'flex'
        escribir(textos.textoDos, textoDos, 0, siguientePaso)
        alert(paso)
    }

    if(paso === 3){
            formNombre.style.display = "flex"
            inputNombre.addEventListener("input", () => {
                if (inputNombre.value.trim().length > 0) {
                    btnContinuarNombre.style.display = "flex"
                } else {
                    btnContinuarNombre.style.display = "none"
                }
            })

            formNombre.addEventListener("submit", async (e) => {
                e.preventDefault()

                contFormNombre.style.display = "none"
                contFormInfo.style.display = "flex"

                let texto = `${inputNombre.value} ${textos.textoTres}`
                escribir(texto, textoTres, 0, siguientePaso)
                alert(paso)
            })
    }

    if (paso === 4) {
        formInfo.style.display = "flex"
    }

}
