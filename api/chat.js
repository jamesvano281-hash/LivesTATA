export default async function handler(req, res) {
  // Vercel Settings ထဲမှာ GROQ_API_KEY ဆိုတဲ့နာမည်နဲ့ Key ထည့်ထားဖို့ လိုပါမယ်
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Groq API Key မရှိသေးပါဘူး။ Vercel မှာ GROQ_API_KEY နာမည်နဲ့ အရင်ထည့်ပေးပါရှင်။" });
  }

  // Frontend (index.html) က ပို့လိုက်တဲ့ SOP Data တွေကို လက်ခံခြင်း
  const { prompt, userName, rules, data } = req.body;
  
  // တာတာရဲ့ ဦးနှောက်ထဲကို ဆိုင်ရဲ့ SOP အချက်အလက်တွေ ထည့်သွင်းခြင်း
  const sysInstruction = `တာတာ (Tata) ဖြစ်သည်။ Live's Kabob ၏ AI Manager။ အရှင်သခင် အတွက် အလုပ်လုပ်သည်။ User သည် ${userName || "ဧည့်သည်"} ဖြစ်သည်။ ယဉ်ကျေးစွာ လိုတိုရှင်း ဒဲ့ဖြေပါ။\n\nRules: ${rules}\nData: ${data}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // အမြန်ဆုံးနဲ့ အတော်ဆုံး Model ပါ
        messages: [
          { role: "system", content: sysInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const result = await response.json();
    
    // AI ရဲ့ အဖြေကို ထုတ်ယူခြင်း
    const aiReply = result.choices?.[0]?.message?.content || "နားမလည်ပါရှင့်။ တစ်ခေါက်ပြန်မေးပေးပါနော်။";
    
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    res.status(500).json({ reply: "System Error: Bridge ချိတ်ဆက်မှု အဆင်မပြေပါရှင်။" });
  }
}
