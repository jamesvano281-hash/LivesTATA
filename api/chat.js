export default async function handler(req, res) {
  const keys = [
    process.env.GEMINI_API_KEY1,
    process.env.GEMINI_API_KEY2,
    process.env.GEMINI_API_KEY3,
    process.env.GEMINI_API_KEY4,
    process.env.GEMINI_API_KEY5
  ].filter(k => k);

  if (keys.length === 0) {
    return res.status(200).json({ reply: "Key တွေ ရှာမတွေ့ပါဘူး ကိုတုတ်။ Vercel ကို ပြန်စစ်ပါ။" });
  }

  const { prompt, userName, rules, data } = req.body;
  const sysInstruction = `တာတာ (Tata) ဖြစ်သည်။ Live's Kabob ၏ AI Manager။ အရှင်သခင် ကိုတုတ် အတွက် အလုပ်လုပ်သည်။ User သည် ${userName || "ဧည့်သည်"} ဖြစ်သည်။ အဖြေကို မြန်မာလိုပဲ ကျစ်ကျစ်လစ်လစ် ဖြေပါ။ ၈၀/၂၀ Rule သုံးပါ။ \nRules: ${rules}\nData: ${data}`;

  // Key တွေကို အစဉ်လိုက် မဟုတ်ဘဲ မွှေနှောက် (Shuffle) ပြီးမှ တစ်ခုချင်းစီ စမ်းမယ်
  const shuffledKeys = keys.sort(() => 0.5 - Math.random());

  for (let key of shuffledKeys) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: sysInstruction }] }
        })
      });

      // ဒီ Key က Limit ပြည့်နေရင် ကျော်ပြီး နောက် Key တစ်ခုကို ချက်ချင်း ဆက်စမ်းမယ်
      if (response.status === 429) {
        continue; 
      }

      const responseData = await response.json();
      const aiReply = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      // အဖြေရပြီဆိုရင် ချက်ချင်း ပြန်ပို့မယ် (Loop ထဲကနေ ထွက်မယ်)
      if (aiReply) {
        return res.status(200).json({ reply: aiReply });
      }
      
    } catch (error) {
      continue; // Error တက်ရင်လည်း နောက် Key ကိုပဲ ဆက်ပြောင်းစမ်းမယ်
    }
  }

  // Key ၅ ခုလုံး (၁၀၀%) Limit ပြည့်သွားမှသာ ဒီစာကို ပြတော့မယ်
  return res.status(200).json({ reply: "အခု ဝန်ထမ်းတွေ သုံးတာ အရမ်းများနေလို့ ၃ မိနစ်လောက်နေမှ ပြန်မေးပေးပါနော်။" });
}
