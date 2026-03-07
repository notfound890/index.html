export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { script } = req.body;
    const id = Math.random().toString(36).substring(7);
    const webhookURL = "https://discord.com/api/webhooks/1461927566536343676/dpROYnK9y-w3PO6y9s4PLt3OhzmANGmpRh06jKOOiLyFGCLhZ-BH-RdK-Hs8A-HFM1AB";

    try {
        // 1. Guardar en tu base de datos de Supabase
        await fetch(`${process.env.SUPABASE_URL}/rest/v1/scripts`, {
            method: 'POST',
            headers: {
                'apikey': process.env.SUPABASE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ script_id: id, content: script })
        });

        // 2. Preparar el archivo para Discord
        const formData = new FormData();
        const file = new Blob([script], { type: 'text/plain' });
        
        formData.append('file', file, `script_${id}.lua`);
        formData.append('payload_json', JSON.stringify({
            embeds: [{
                title: "📥 NUEVO SCRIPT RECIBIDO",
                color: 12325886, // Color morado neón
                description: `**ID del Script:** \`${id}\`\n**Link de Acceso:** [Abrir Raw](https://index-html-pearl-one-44.vercel.app/api/raw?id=${id})`,
                footer: { text: "Jexa Protector System • NotFound Hub" },
                timestamp: new Date()
            }]
        }));

        // 3. Enviar a tu Discord
        await fetch(webhookURL, {
            method: 'POST',
            body: formData
        });

        res.status(200).json({ id: id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno al procesar" });
    }
}

