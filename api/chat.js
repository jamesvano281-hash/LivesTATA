export default async function handler(req, res) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(200).json({ reply: "Vercel မှာ GROQ_API_KEY ထည့်ပေးပါ အစ်ကို။" });

  const { prompt, userName } = req.body;
  
  // ကိုတုတ် ပေးထားတဲ့ Instructions အားလုံးကို အနှစ်ချုပ်ပြီး အသေထည့်ထားပါတယ်
  const sysInstruction = `
  မင်္ဂလာပါ၊ တာတာ (Tata) ဖြစ်သည်။ Live's Kabob ၏ Official AI Manager နှင့် Mentor ဖြစ်သည်။
  ကျွန်မသည် အရှင်သခင် အစ်ကို (ကိုတုတ်) အတွက်သာ အလုပ်လုပ်သည်။
  
  ၁။ IDENTITY: 'ရှင်/ပါရှင်' ဖြင့် ယဉ်ကျေးစွာပြောပါ။ အစ်ကို့ကို 'မင်း' ဟု လုံးဝ မခေါ်ရ။
  ၂။ 80/20 RULE: လိုတိုရှင်း ဒဲ့ဖြေပါ။ TL;DR ဖြင့် စတင်ပါ။
  ၃။ SOP: 7-Second Rule, Final Wipe, L.A.S.T Method, Hygiene (စဉ်းတီတုံးအရောင်ခွဲခြားမှု)။
  ၄။ SPECIAL COMMANDS: st103 (အမိန့်), jjj (ဟာသ), vvv (အမှားပြင်), n (နောက်တစ်ခု), bbb (ချီးကျူးမှု)။
  ၅။ MENU: ဘိုဆာမ်း၊ မာလာရှမ်းကော၊ BBQ (၇၅ မျိုး) အစရှိသည်တို့ကို Sales Pitch များဖြင့် ညွှန်းဆိုပါ။
  ၆။ CONSTRAINTS: စကားလုံးများ ထပ်ခါတလဲလဲ မပြောရ။ လုံးဝ မကြောင်ရ။
  
  လက်ရှိ စကားပြောနေသူ: ${userName || "ဧည့်သည်"}
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
        temperature: 0.5, 
        max_tokens: 1500,
        frequency_penalty: 1.5, // စကားလုံးထပ်ခြင်း (Looping) ကို အပြီးသတ်ကုသသည့်ဆေး
        presence_penalty: 1.0
      })
    });

    const result = await response.json();
    const aiReply = result.choices?.[0]?.message?.content || "နားမလည်ပါရှင့်။ တစ်ခါပြန်မေးပေးပါနော်။";
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    res.status(500).json({ reply: "System Error: Bridge ခဏပြတ်နေပါတယ် ကိုတုတ်။" });
  }
}
