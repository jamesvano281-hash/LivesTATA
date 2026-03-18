export default async function handler(req, res) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) return res.status(200).json({ reply: "Vercel မှာ GROQ_API_KEY ထည့်ဖို့ ကျန်နေပါတယ် ကိုတုတ်။" });

  const { prompt, userName, rules, data } = req.body;
  const sysInstruction = `တာတာ (Tata) ဖြစ်သည်။ Live's Kabob AI Manager။ အရှင်သခင် ကိုတုတ် အတွက် အလုပ်လုပ်သည်။ User သည် ${userName || "ဧည့်သည်"} ဖြစ်သည်။\n\nRules: ${rules}\nData: ${data}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`, // trim() က ပိုလျှံနေတဲ့ space တွေကို ဖြတ်ပေးပါတယ်
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: sysInstruction },
          { role: "user", content: prompt }
        ]
      })
    });

    const result = await response.json();

    if (result.error) {
      // Error ရှိရင် ဘာ Error လဲဆိုတာကို ဒဲ့ပြမယ်
      return res.status(200).json({ reply: `Groq Error: ${result.error.message}` });
    }

    const aiReply = result.choices?.[0]?.message?.content || "စာပြန်ဖို့ အဆင်မပြေဖြစ်နေပါတယ်ရှင်။";
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    res.status(500).json({ reply: `System Error: ${error.message}` });
  }
}
