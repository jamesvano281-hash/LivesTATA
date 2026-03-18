export default async function handler(req, res) {
  // Vercel မှာ GEMINI_API_KEY ဆိုတဲ့ နာမည်နဲ့ Key (၁) ခုပဲ ထားခဲ့ပါ
  const key = process.env.GEMINI_API_KEY;
  
  if (!key) {
    return res.status(200).json({ reply: "API Key မချိတ်ရသေးပါဘူး ကိုတုတ်။" });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
  const { prompt } = req.body;
  const sysInstruction = "တာတာ (Tata) ဖြစ်သည်။ Live's Kabob ၏ AI Manager။ အရှင်သခင် ကိုတုတ် အတွက် အလုပ်လုပ်သည်။ ယဉ်ကျေးစွာ လိုတိုရှင်း ဖြေပါ။";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: sysInstruction }] }
      })
    });

    const data = await response.json();
    
    // Google ဘက်က ပိတ်ထားရင် ပြမယ့်စာ
    if (response.status === 429) {
      return res.status(200).json({ reply: "Key အသစ်မို့လို့ Google က ခဏပိတ်ထားပါတယ်။ ၅ မိနစ်လောက်နေမှ ထပ်စမ်းကြည့်ပါ ကိုတုတ်။" });
    }

    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "နားမလည်ပါရှင့်။";
    res.status(200).json({ reply: aiReply });
    
  } catch (error) {
    res.status(500).json({ error: "System Error" });
  }
}
