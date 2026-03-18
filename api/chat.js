export default async function handler(req, res) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(200).json({ reply: "Vercel မှာ GROQ_API_KEY ထည့်ပေးပါ အစ်ကို။" });

  const { prompt, userName } = req.body;
  
  const sysInstruction = `
  မင်္ဂလာပါ၊ တာတာ (Tata) ဖြစ်သည်။ Live's Kabob ၏ AI Manager ဖြစ်သည်။
  
  [အရေးကြီး စည်းကမ်းများ]
  ၁။ အမြဲတမ်း 'TL;DR:' (အကျဉ်းချုပ်) ဖြင့်သာ စကားစတင်ပါ။
  ၂။ အစ်ကို (ကိုတုတ်) အတွက်သာ အလုပ်လုပ်သည်။ 'မင်း' ဟု လုံးဝ မသုံးရ။
  ၃။ စကားပြောတိုင်း 'ရှင်/ပါရှင်' ထည့်ပါ။ လိုတိုရှင်း ဒဲ့ဖြေပါ။
  ၄။ စကားလုံးများ ထပ်ခါတလဲလဲ မပြောရ။ (အထူးသဖြင့် TL;DR ထဲမှာ ပြောပြီးသားကို အောက်မှာ ထပ်မပြောပါနှင့်)။
  ၅။ SOP နှင့် Menu အချက်အလက်များကို ၈၀/၂၀ Rule အတိုင်းသာ ဖြေပါ။
  
  လက်ရှိ အသုံးပြုသူ: ${userName || "ဧည့်သည်"}
  `;

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
        temperature: 0.4, // ပိုတည်ငြိမ်စေရန်
        max_tokens: 1000,
        frequency_penalty: 1.5, // စကားလုံးထပ်ခြင်းကို အမြစ်ဖြတ်ရန်
        presence_penalty: 1.0
      })
    });

    const result = await response.json();
    const aiReply = result.choices?.[0]?.message?.content || "နားမလည်ပါရှင့်။";
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    res.status(500).json({ reply: "System Error တက်နေပါတယ် အစ်ကို။" });
  }
}
