export default async function handler(req, res) {
    const { id } = req.query;
    const userAgent = req.headers['user-agent'] || '';

    try {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/scripts?script_id=eq.${id}&select=content`, {
            headers: {
                'apikey': process.env.SUPABASE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
            }
        });

        const data = await response.json();
        
        // Si no hay datos, enviamos un print para que lo veas en la consola de Roblox
        if (!data || data.length === 0) {
            res.setHeader('Content-Type', 'text/plain');
            return res.status(200).send(`print("JEXA ERROR: El ID ${id} no existe en la base de datos.")`);
        }

        const scriptContent = data[0].content;

        // Forzamos la respuesta para ejecutores
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        // Enviamos un mensaje de confirmación + el código original
        const finalCode = `print("JEXA SYSTEM: Cargando script ID ${id}...");\n` + scriptContent;
        
        return res.status(200).send(finalCode);

    } catch (err) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(`print("JEXA ERROR CRITICO: ${err.message}")`);
    }
}
