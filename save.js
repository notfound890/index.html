export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const id = Math.random().toString(36).substring(7);
    res.status(200).json({ id: id });
}

