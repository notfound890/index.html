export default function handler(req, res) {
    const { id } = req.query;
    res.setHeader('Content-Type', 'text/plain');
    // Esto es lo que verá tu ejecutor Delta
    res.status(200).send(`-- JEXA PROTECTOR\nprint('Script cargado con ID: ${id}')\n-- Conecta Supabase para cargar scripts reales.`);
}
