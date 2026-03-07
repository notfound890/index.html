export default async function handler(req, res) {
    const { id } = req.query;
    const userAgent = req.headers['user-agent'] || '';

    // Buscar el script en Supabase
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/scripts?script_id=eq.${id}&select=content`, {
        headers: {
            'apikey': process.env.SUPABASE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
        }
    });

    const data = await response.json();
    const scriptContent = (data && data.length > 0) ? data[0].content : "-- Error: Script no encontrado";

    // SI ES ROBLOX: Entregar solo el código puro
    if (userAgent.includes('Roblox')) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(scriptContent);
    }

    // SI ES UN NAVEGADOR: Mostrar la página de protección con efecto Matrix
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>JEXA PROTECTOR 🔐</title>
            <style>
                body { margin: 0; background: #000; color: #0f0; font-family: 'Courier New', monospace; overflow: hidden; display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; }
                canvas { position: absolute; top: 0; left: 0; z-index: 1; opacity: 0.3; }
                .content { position: relative; z-index: 2; text-align: center; background: rgba(0,0,0,0.8); padding: 40px; border: 2px solid #bc13fe; border-radius: 15px; box-shadow: 0 0 30px #bc13fe; max-width: 80%; }
                h1 { color: #bc13fe; font-size: 2.5rem; text-shadow: 0 0 10px #bc13fe; margin-bottom: 10px; }
                p { color: #fff; letter-spacing: 2px; font-size: 14px; }
                .link { color: #00ffcc; text-decoration: none; font-size: 12px; margin-top: 20px; display: block; opacity: 0.7; }
            </style>
        </head>
        <body>
            <canvas id="matrix"></canvas>
            <div class="content">
                <h1>JEXA PROTECTOR 🔐</h1>
                <p>ESTE SCRIPT ESTÁ PROTEGIDO POR EL SISTEMA DE JEXA</p>
                <p style="color: #888; font-size: 10px;">ID DETECTADO: ${id}</p>
                <a class="link" href="#">https://index-html-pearl-one-44.vercel.app/</a>
            </div>
            <script>
                const canvas = document.getElementById('matrix');
                const ctx = canvas.getContext('2d');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
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
                setInterval(draw, 33);
            </script>
        </body>
        </html>
    `);
}
