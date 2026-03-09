export default async function handler(req, res) {
    const { id } = req.query;

    // Usamos las variables de Vercel para que sea seguro y automático
    const SB_URL = process.env.SUPABASE_URL;
    const SB_KEY = process.env.SUPABASE_KEY;

    try {
        const response = await fetch(`${SB_URL}/rest/v1/scripts?script_id=eq.${id}&select=content`, {
            headers: {
                'apikey': SB_KEY,
                'Authorization': `Bearer ${SB_KEY}`
            }
        });

        const data = await response.json();
        
        // Si el ID existe, entrega el código; si no, manda un error visible en Roblox
        if (!data || data.length === 0) {
            res.setHeader('Content-Type', 'text/plain');
            return res.status(200).send(`print("JEXA ERROR: El ID ${id} no existe.")`);
        }

        const scriptContent = data[0].content;

        // Configuramos los encabezados para que el ejecutor lo lea correctamente
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        return res.status(200).send(scriptContent);

    } catch (err) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(`print("JEXA ERROR CRITICO: ${err.message}")`);
    }
}
