const contenedor = document.getElementById('contenedor-plantas');

const API_KEY = 'sk-69n36982edd51b23714664';
const API_URL = `https://perenual.com/api/species-list?key=${API_KEY}&page=${Math.floor(Math.random() * 10) + 1}`;

let fallosConsecutivos = 0;
const MAX_FALLOS = 3;
let circuitoAbierto = false;

async function cargarPlantas() {

    if (circuitoAbierto) {
        contenedor.innerHTML = `
            <div class="text-center text-red-500">
                <p>El servicio no está disponible en este momento. Por favor, inténtalo más tarde.</p>
            </div>`;
        return;
    }

    contenedor.innerHTML = `
        <div class="text-center text-gray-500">
            <p>Cargando plantas...</p>
        </div>`;

    const MAX_REINTENTOS = 3;

    for (let intento = 1; intento <= MAX_REINTENTOS; intento++) {
        try {

            const respuesta = await fetch(API_URL);
            if (!respuesta.ok) throw new Error('Error en el servidor');

            const datos = await respuesta.json();
            
            fallosConsecutivos = 0; // reiniciar contador de fallos 
            circuitoAbierto = false; // cerrar circuito si estaba abierto
            contenedor.innerHTML = "";

            datos.data.forEach(planta => {
                if (planta.default_image) {

                    const card = document.createElement('div');
                    card.className = 'bg-white shadow-md rounded-xl w-80 overflow-hidden border border-gray-100 p-4';

                    const img = document.createElement('img');
                    img.src = planta.default_image.regular_url;
                    img.className = 'rounded-xl h-64 w-full object-cover mb-4';
                    img.alt = planta.common_name;

                    const titulo = document.createElement('h2');
                    titulo.className = 'text-xl font-bold capitalize text-gray-800';
                    titulo.textContent = planta.common_name;

                    const detalles = document.createElement('p');
                    detalles.className = 'text-sm text-gray-600 mt-2';

                    const ciclo = planta.cycle || 'Ciclo desconocido';
                    const riego = planta.watering || 'Riego no especificado';
                    detalles.textContent = `Ciclo: ${ciclo} • Riego: ${riego}`;

                    const boton = document.createElement('button');
                    boton.className = 'w-full mt-4 bg-slate-800 text-white py-2 rounded-lg text-xs font-bold uppercase';
                    boton.textContent = 'Ver más';

                    card.append(img, titulo, detalles, boton);
                    contenedor.appendChild(card);
                }
            });
            return;

        } catch (error) {

if (intento === MAX_REINTENTOS) {
                manejarFalloCritico();

                // si el fallo hizo que se abriera el circuito, mostramos el mensaje de bloqueo
                if (circuitoAbierto) {
                    contenedor.innerHTML = `
                        <div class="text-center text-red-500 font-bold p-8 border-2 border-red-200 rounded-xl">
                            <p>CIRCUITO ABIERTO</p>
                            <p class="text-sm font-normal">Demasiados fallos. Reintenta en 30 segundos.</p>
                        </div>`;
                } else {
                    // si falló pero aún no llegamos al MAX_FALLOS del circuito
                    contenedor.innerHTML = `
                        <div class="text-center text-red-500">
                            <p>Error: ${error.message}</p>
                            <p class="text-xs text-gray-400">Fallo consecutivo: ${fallosConsecutivos}/${MAX_FALLOS}</p>
                            <button onclick="cargarPlantas()" class="mt-4 text-blue-500 underline">Reintentar</button>
                        </div>`;
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

        }
    }
}

function manejarFalloCritico() {
    fallosConsecutivos++;
    if (fallosConsecutivos >= MAX_FALLOS) {
        circuitoAbierto = true;
        console.error("CIRCUITO ABIERTO: Demasiados fallos.");
        setTimeout(() => {
            circuitoAbierto = false;
            fallosConsecutivos = 0;
            console.log("CIRCUITO CERRADO: Listo para intentar de nuevo.");
        }, 30000);
    }
}

cargarPlantas();