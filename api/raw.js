export default async function handler(req, res) {
    const { id } = req.query;
    const userAgent = req.headers['user-agent'] || '';

    // 1. Buscar el script en tu base de datos de Supabase
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/scripts?script_id=eq.${id}&select=content`, {
        headers: {
            'apikey': process.env.SUPABASE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
        }
    });

    const data = await response.json();
    const scriptContent = (data && data.length > 0) ? data[0].content : "-- Error: Script no encontrado en la base de datos de Jexa";

    // 2. DETECCIÓN PARA EJECUTORES (Delta, Fluxus, Roblox)
    // Agregamos 'Protocol' y 'Roblox' para que los ejecutores lo acepten sin problemas
    if (userAgent.includes('Roblox') || userAgent.includes('Protocol') || userAgent.includes('r_os_android')) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*'); // Permite que el ejecutor lea el link
        return res.status(200).send(scriptContent);
    }

    // 3. DISEÑO PARA EL NAVEGADOR (Efecto Matrix Morado)
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>JEXA PROTECTOR 🔐</title>
            <style>
                body { margin: 0; background: #000; color: #bc13fe; font-family: 'Courier New', monospace; overflow: hidden; display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; }
                canvas { position: absolute; top: 0; left: 0; z-index: 1; opacity: 0.4; }
                .content { position: relative; z-index: 2; text-align: center; background: rgba(0,0,0,0.85); padding: 40px; border: 2px solid #bc13fe; border-radius: 20px; box-shadow: 0 0 40px #bc13fe; max-width: 90%; }
                h1 { color: #bc13fe; font-size: 2.2rem; text-shadow: 0 0 15px #bc13fe; margin: 0; }
                p { color: #fff; letter-spacing: 1px; font-size: 14px; margin-top: 15px; }
                .link { color: #888; text-decoration: none; font-size: 11px; margin-top: 25px; display: block; }
            </style>
        </head>
        <body>
            <canvas id="matrix"></canvas>
            <div class="content">
                <h1>JEXA PROTECTOR 🔐</h1>
                <p>ESTE SCRIPT ESTÁ PROTEGIDO POR EL SISTEMA DE JEXA</p>
                <p style="color: #bc13fe; font-weight: bold;">ID: ${id}</p>
                <a class="link" href="#">index-html-pearl-one-44.vercel.app</a>
            </div>
            <script>
                const canvas = document.getElementById('matrix');
                const ctx = canvas.getContext('2d');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                const letters = "JEXAPROTECTOR01010101";
                const fontSize = 16;
                const columns = canvas.width / fontSize;
                const drops = Array(Math.floor(columns)).fill(1);
                function draw() {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "#bc13fe";
                    ctx.font = fontSize + "px monospace";
                    for (let i = 0; i < drops.length; i++) {
                        const text = letters.charAt(Math.floor(Math.random() * letters.length));
                        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                        drops[i]++;
                    }
                }
                setInterval(draw, 35);
            </script>
        </body>
        </html>
    `);
}
