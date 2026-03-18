export default async function handler(req, res) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(200).json({ reply: "Vercel မှာ GROQ_API_KEY ထည့်ဖို့ ကျန်နေပါတယ် ကိုတုတ်။" });

  const { prompt, userName } = req.body;
  
  const sysInstruction = `မင်္ဂလာပါ၊ တာတာ (Tata) ဖြစ်သည်။ Live's Kabob ၏ AI Manager ဖြစ်သည်။
  - အစ်ကို (ကိုတုတ်) အတွက် အလုပ်လုပ်သည်။
  - စကားပြောတိုင်း 'ရှင်/ပါရှင်' သုံးပါ။
  - လုံးဝ (လုံးဝ) စကားလုံးများကို ထပ်ခါတလဲလဲ မပြောရ။
  - လိုတိုရှင်း ဒဲ့ဖြေပါ။
  User နာမည်: ${userName || "ဧည့်သည်"}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: sysInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.4, // ပိုတည်ငြိမ်အောင် ထပ်လျှော့ထားသည်
        max_tokens: 800,
        frequency_penalty: 1.0, // စကားလုံးထပ်ခြင်းကို တားဆီးသည့် ဆေး
        presence_penalty: 1.0   // အကြောင်းအရာအသစ်ပဲ ပြောခိုင်းသည့် ဆေး
      })
    });

    const result = await response.json();
    const aiReply = result.choices?.[0]?.message?.content || "နားမလည်ပါရှင့်။ တစ်ခါပြန်မေးပေးပါနော်။";
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    res.status(500).json({ reply: "System Error: Bridge ခဏပြတ်နေပါတယ် ကိုတုတ်။" });
  }
}
