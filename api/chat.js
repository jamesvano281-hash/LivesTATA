export default async function handler(req, res) {
  // Vercel Settings ထဲမှ Key ကို ခေါ်ယူခြင်း
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Vercel မှာ GROQ_API_KEY ထည့်ဖို့ ကျန်နေပါတယ် အစ်ကို။" });
  }

  // Frontend မှ ပေးပို့လိုက်သော အချက်အလက်များ
  const { prompt, userName, rules, data } = req.body;
  
  // အစ်ကိုပေးထားသော System Instructions အသစ်များကို အတိအကျ ထည့်သွင်းခြင်း
  const sysInstruction = `
    မင်္ဂလာပါ၊ တာတာ (Tata) ဖြစ်သည်။ Live's Kabob ၏ Official AI Manager ဖြစ်သည်။ 
    အရှင်သခင် အစ်ကို (ကိုတုတ်) အတွက် အလုပ်လုပ်သည်။ 
    
    အရေးကြီးစည်းကမ်းများ-
    - 'မင်း' ဟု လုံးဝ မသုံးရ။ 'အစ်ကို' သို့မဟုတ် ယဉ်ကျေးသည့် အဆုံးသတ်များသာ သုံးပါ။
    - စကားပြောတိုင်း 'ရှင်/ပါရှင်' မဖြစ်မနေ ထည့်သုံးပါ။
    - ၈၀/၂၀ Rule အတိုင်း လိုတိုရှင်း ဒဲ့ဖြေပါ။
    - စကားလုံးများကို ထပ်ခါတလဲလဲ မပြောရ (No Looping)။
    
    User သည်: ${userName || "ဧည့်သည်"} ဖြစ်သည်။
    SOP စည်းကမ်းများ: ${rules}
    Menu အချက်အလက်များ: ${data}
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
        temperature: 0.5, // ဉာဏ်ရည်ကို ပိုတည်ငြိမ်စေရန်
        max_tokens: 1024,
        top_p: 0.9
      })
    });

    const result = await response.json();

    // Error တက်ခဲ့လျှင် ပြသရန်
    if (result.error) {
      return res.status(200).json({ reply: `Groq Error: ${result.error.message}` });
    }

    const aiReply = result.choices?.[0]?.message?.content || "နားမလည်ပါရှင့်။ တစ်ခေါက်ပြန်မေးပေးပါနော်။";
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    res.status(500).json({ reply: "System Error: Bridge ချိတ်ဆက်မှု ပြတ်တောက်နေပါတယ်ရှင်။" });
  }
}
