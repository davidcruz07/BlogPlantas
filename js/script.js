// 1. Buscamos el lugar donde vamos a poner las plantas
const contenedor = document.getElementById('contenedor-plantas');

// 2. Función para traer la información
async function obtenerPlantas() {
    try {
        const respuesta = await fetch('https://perenual.com/api/species-list?key=sk-69n36982edd51b23714664');
        const datos = await respuesta.json();

        datos.data.forEach(planta => {
            
            //la tarjeta solo se crea si la planta tiene foto
            if (planta.default_image) {
                const card = document.createElement('div');

                card.innerHTML = `
                    <div class="relative flex flex-col text-gray-700 bg-white shadow-md rounded-xl w-80 tarjeta-planta">
                        <div class="relative mx-4 mt-4 overflow-hidden rounded-xl h-64">
                            <img src="${planta.default_image.regular_url}" class="object-cover w-full h-full" />
                        </div>
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-2">
                                <p class="text-lg font-bold capitalize">${planta.common_name}</p>
                            </div>
                            <p class="text-sm text-gray-600">
                                Ciclo: ${planta.cycle} <br>
                                Riego: ${planta.watering}
                            </p>
                        </div>
                        <div class="p-6 pt-0">
                            <button class="w-full bg-slate-800 text-white py-2 px-4 rounded-lg text-xs font-bold uppercase">
                                Ver más
                            </button>
                        </div>
                    </div>
                `;
                contenedor.appendChild(card);
            }
        });
    } catch (error) {
        contenedor.innerHTML = "<p>Hubo un error al cargar los datos.</p>";
    }
}

obtenerPlantas();