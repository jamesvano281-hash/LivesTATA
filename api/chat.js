export default async function handler(req, res) {
  // KEY ၁ ခုထက်ပိုပြီး သုံးနိုင်အောင် Array ဆောက်ထားခြင်း
  const keys = [
    process.env.GEMINI_API_KEY,  // မူလ Key
    process.env.KEY_2,           // အပို Key ၂
    process.env.KEY_3,           // အပို Key ၃
    process.env.KEY_4,           // အပို Key ၄
    process.env.KEY_5            // အပို Key ၅
  ].filter(k => k); // ရှိတဲ့ Key တွေကိုပဲ ရွေးယူမယ်

  // Key တွေထဲက တစ်ခုကို အလှည့်ကျ (Random) ရွေးသုံးမယ်
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${randomKey}`;

  const { prompt, userName, rules, data } = req.body;
  const sysInstruction = `တာတာ (Tata) ဖြစ်သည်။ Live's Kabob ၏ AI Manager။ အရှင်သခင် ကိုတုတ် အတွက် အလုပ်လုပ်သည်။ User သည် ${userName || "ဧည့်သည်"} ဖြစ်သည်။ အဖြေကို မြန်မာလိုပဲ ကျစ်ကျစ်လစ်လစ် ဖြေပါ။ ၈၀/၂၀ Rule သုံးပါ။ \nRules: ${rules}\nData: ${data}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: sysInstruction }] }
      })
    });

    const responseData = await response.json();
    
    // Error 429 တက်ရင် ဝန်ထမ်းကို ယဉ်ယဉ်ကျေးကျေး အကြောင်းကြားမယ်
    if (response.status === 429) {
      return res.status(200).json({ reply: "အခု ဝန်ထမ်းတွေ သုံးတာ များနေလို့ ၅ မိနစ်လောက်နေမှ ပြန်မေးပေးပါနော်။" });
    }

    const aiReply = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "နားမလည်ပါရှင့်။";
    res.status(200).json({ reply: aiReply });
    
  } catch (error) {
    res.status(500).json({ error: "Bridge Connection Error" });
  }
}
