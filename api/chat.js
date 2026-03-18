export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY; 
  // v1beta Gemini 2.0 Flash endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    // Google ဆီက error ပြန်လာရင် client ဆီ တိုက်ရိုက်ပို့ပေးမယ်
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Bridge Connection Error" });
  }
}
