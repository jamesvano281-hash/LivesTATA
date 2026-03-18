export default async function handler(req, res) {
  // Vercel Environment Variables ထဲမှ API Key ကို ဆွဲယူခြင်း
  const apiKey = process.env.GEMINI_API_KEY; 

  // URL ထဲတွင် API Key ကို ထည့်သွင်းရန် Backtick ( ` ) ကို အတိအကျ သုံးထားပါသည်
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    // Google ထံမှ ရရှိသော အဖြေကို UI ထံ ပြန်လည် ပေးပို့ခြင်း
    res.status(200).json(data);
  } catch (error) {
    // ချိတ်ဆက်မှု အဆင်မပြေပါက Error ပြသခြင်း
    res.status(500).json({ error: "Bridge Connection Error" });
  }
}
