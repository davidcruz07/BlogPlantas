exports.handler = async function(event, context) {

    const API_KEY = process.env.API_KEY; 
    const URL = `https://perenual.com/api/species-list?key=${API_KEY}`;

    try {
        const response = await fetch(URL);
        
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: "Error de la API externa" })
            };
        }

        const datos = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(datos)
        };

    } catch (error) {
        console.error("Error detallado:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Fallo total en el backend: " + error.message })
        };
    }
};