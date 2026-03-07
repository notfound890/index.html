export default async function handler(req, res) {
    const { id } = req.query;
    const userAgent = req.headers['user-agent'] || '';

    // Variables directas para evitar errores de entorno
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    try {
        // Petición ultra-limpia a Supabase
        const response = await fetch(`${supabaseUrl}/rest/v1/scripts?script_id=eq.${id}&select=content`, {
            method: 'GET',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Si Supabase responde mal, lo sabremos aquí
        if (!response.ok) {
            return res.status(response.status).send(`-- Error de Base de Datos: ${response.status}`);
        }

        const data = await response.json();
        const scriptContent = (data && data.length > 0) ? data[0].content : "-- Error: Script no encontrado";

        // SI ES ROBLOX / DELTA / FLUXUS
        if (userAgent.includes('Roblox') || userAgent.includes('Protocol') || !userAgent.includes('Mozilla')) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.status(200).send(scriptContent);
        }

        // SI ES NAVEGADOR (Tu diseño Matrix)
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(`
            <html>
            <body style="background:#000;color:#bc13fe;font-family:monospace;display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;margin:0;">
                <h1 style="text-shadow:0 0 15px #bc13fe;">JEXA PROTECTOR 🔐</h1>
                <p style="color:#fff;">ID: ${id} - ESTADO: ACTIVO</p>
                <p style="font-size:10px;color:#444;">NotFound Hub System</p>
            </body>
            </html>
        `);

    } catch (err) {
        return res.status(500).send("-- Error Interno del Servidor");
    }
}
