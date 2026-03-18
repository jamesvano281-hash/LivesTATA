export default async function handler(req, res) {
  // ဤ API Key ကို Vercel Environment Variables ထဲတွင် ထည့်ရပါမည်
  const apiKey = process.env.GEMINI_API_KEY; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Bridge Connection Error" });
  }
}
