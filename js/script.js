const contenedor = document.getElementById('contenedor-plantas');
const API_URL = '/.netlify/functions/plants';

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function cargarPlantas() {
    try {

        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error en el servidor');

        const datos = await respuesta.json();
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
                detalles.textContent = `Ciclo: ${planta.cycle} • Riego: ${planta.watering}`;

                const boton = document.createElement('button');
                boton.className = 'w-full mt-4 bg-slate-800 text-white py-2 rounded-lg text-xs font-bold uppercase';
                boton.textContent = 'Ver más';

                card.append(img, titulo, detalles, boton);
                contenedor.appendChild(card);
            }
        });

    } catch (error) {
        contenedor.innerHTML = `
                    <div class="text-center text-red-500">
                        <p>Error: ${error.message}</p>
                        <button onclick="location.reload()" class="mt-4 text-blue-500 underline">Reintentar</button>
                    </div>`;
    }
}

cargarPlantas();