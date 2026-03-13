import { escribir, precargarAudio } from "./funcionalidades.js"

// botones
const btnComenzar = document.getElementById('btn-comenzar')
const btnContinuarNombre = document.getElementById('btn-continuar-nombre')
const btnContinuarInfo = document.getElementById('btn-continuar-info')
const btnAgregarInfo = document.getElementById('btn-agregar-info')

// contenedores
const contComienzo = document.getElementById('cont-comienzo')
const contFormNombre = document.getElementById('cont-form-nombre')
const contFormInfo = document.getElementById('cont-form-info')
const contInfo = document.getElementById('cont-info')
const contEspera = document.getElementById('cont-espera')
const contPersonalizar = document.getElementById('cont-personalizar')

// inputs y forms
const inputNombre = document.getElementById("nombre")
const formNombre = document.getElementById('form-nombre')

const inputInfo = document.getElementById("info")
const formInfo = document.getElementById('form-info')

// textos del bot
const textoUno = document.getElementById("textoUno");
const textoDos = document.getElementById("textoDos");
const textoTres = document.getElementById("textoTres");

const data = {
    nombre: "",
    info: []
}

const datosGuardados = localStorage.getItem("datosUsuario")

if (datosGuardados) {
    Object.assign(data, JSON.parse(datosGuardados))
}

let textos;

async function cargarTextos() {
    const res = await fetch("/data/textos.json");
    textos = await res.json();
}

btnComenzar.addEventListener("click", () => {
    contComienzo.style.display = "none"
    contEspera.style.display = "flex"
})

btnComenzar.addEventListener("click", async () => {

    await cargarTextos();

    await precargarAudio(textos.textoUno);
    await precargarAudio(textos.textoDos);

    contEspera.style.display = "none"
    contFormNombre.style.display = "flex"

    siguientePaso()
})

let paso = 0;

function siguientePaso(){

    paso++;

    if(paso === 1){
        escribir(textos.textoUno, textoUno, 0, siguientePaso)
        precargarAudio(textos.textoDos);
    }

    if(paso === 2){
        textoDos.style.display = 'flex'
        escribir(textos.textoDos, textoDos, 0, siguientePaso)
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

                data.nombre = inputNombre.value
                localStorage.setItem("datosUsuario", JSON.stringify(data))

                contFormNombre.style.display = "none"
                contFormInfo.style.display = "flex"

                let texto = `${inputNombre.value} ${textos.textoTres}`
                escribir(texto, textoTres, 0, siguientePaso)
            })
    }

    if (paso === 4) {
        formInfo.style.display = "flex";

        inputInfo.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                btnAgregarInfo.click();
            }
        });


        // agregar info
        btnAgregarInfo.addEventListener("click", () => {

            if (inputInfo.value.trim() !== "") {

                const valor = inputInfo.value

                data.info.push(valor)
                localStorage.setItem("datosUsuario", JSON.stringify(data))

                const info = document.createElement("button");
                info.className = "btn btn-info";
                info.type = "button";
                info.textContent = inputInfo.value;

                info.addEventListener("click", () => {
                    const index = data.info.indexOf(valor)

                    if (index !== -1) {
                        data.info.splice(index, 1)
                        localStorage.setItem("datosUsuario", JSON.stringify(data))
                    }

                    

                    info.remove()
                });

                contInfo.appendChild(info);

                inputInfo.value = "";
            }

        });

        // validar envio
        formInfo.addEventListener("submit", (e) => {
            e.preventDefault()

            if (contInfo.children.length === 0) {
                e.preventDefault();
                alert("Agregá al menos una información");
            }

            contFormInfo.style.display = 'none'
            contPersonalizar.style.display = 'flex'

            console.log(data)

        });
    }
    

}
