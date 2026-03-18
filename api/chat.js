export default async function handler(req, res) {
  // Vercel Environment Variables ထဲက API Key ကို ယူသုံးခြင်း
  const apiKey = process.env.GEMINI_API_KEY; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Frontend က ပို့လိုက်တဲ့ Data တွေကို ဖမ်းယူခြင်း
  const { prompt, userName, rules, data } = req.body;

  // AI အတွက် System Instruction ကို Backend မှာပဲ လုံခြုံစွာ သတ်မှတ်ခြင်း
  const sysInstruction = `တာတာ (Tata) ဖြစ်သည်။ Live's Kabob ၏ AI Manager။ အရှင်သခင် ကိုတုတ် အတွက် အလုပ်လုပ်သည်။ User သည် ${userName || "ဧည့်သည်"} ဖြစ်သည်။ အဖြေကို မြန်မာလိုပဲ ကျစ်ကျစ်လစ်လစ် ဖြေပါ။ ၈၀/၂၀ Rule သုံးပါ။ \nRules: ${rules}\nData: ${data}`;

  // Gemini API ဆီ ပို့မယ့် Payload တည်ဆောက်ခြင်း
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: sysInstruction }] }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(responseData);
    }

    // Frontend ဘက်ကို 'reply' ဆိုတဲ့ key နဲ့ အဖြေပြန်ပို့ပေးခြင်း
    const aiReply = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "Error processing response.";
    res.status(200).json({ reply: aiReply });
    
  } catch (error) {
    res.status(500).json({ error: "Bridge Connection Error" });
  }
}
