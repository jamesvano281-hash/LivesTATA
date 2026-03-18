export default async function handler(req, res) {
  // Vercel ထဲမှာ ထည့်ထားတဲ့ Key ၅ ခုကို ခေါ်ယူခြင်း
  const keys = [
    process.env.GEMINI_API_KEY1,
    process.env.GEMINI_API_KEY2,
    process.env.GEMINI_API_KEY3,
    process.env.GEMINI_API_KEY4,
    process.env.GEMINI_API_KEY5
  ].filter(k => k); // ရှိတဲ့ Key တွေကိုပဲ ယူမယ်

  // Key မရှိရင် ပြမယ့်စာ
  if (keys.length === 0) {
    return res.status(200).json({ reply: "API Key ရှာမတွေ့ပါဘူး ကိုတုတ်။ Vercel မှာ GEMINI_API_KEY1, 2, 3.. တွေ သေချာထည့်ပေးပါ။" });
  }

  // Frontend က ပို့လိုက်တဲ့ မေးခွန်း၊ နာမည် နဲ့ SOP Data တွေကို လက်ခံယူခြင်း
  const { prompt, userName, rules, data } = req.body;
  
  // တာတာရဲ့ ဦးနှောက်ထဲကို စည်းကမ်းချက်တွေ ထည့်သွင်းခြင်း
  const sysInstruction = `တာတာ (Tata) ဖြစ်သည်။ Live's Kabob ၏ AI Manager။ အရှင်သခင် ကိုတုတ် အတွက် အလုပ်လုပ်သည်။ User သည် ${userName || "ဧည့်သည်"} ဖြစ်သည်။\n\nRules: ${rules}\nData: ${data}`;

  // Key တွေကို အလှည့်ကျသုံးဖို့ မွှေနှောက် (Shuffle) မည်
  const shuffledKeys = keys.sort(() => 0.5 - Math.random());

  // အားနေတဲ့ Key ကို တွေ့တဲ့အထိ တစ်ခုချင်းစီ စမ်းမည် (Auto-Switch System)
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

      // ဒီ Key က Limit ပြည့်နေရင် (429 Error) ကျော်ပြီး နောက် Key ကို ချက်ချင်း ဆက်စမ်းမယ်
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
  return res.status(200).json({ reply: "အခု ဝန်ထမ်းတွေ သုံးတာ အရမ်းများနေလို့ ၃ မိနစ်လောက်နေမှ ပြန်မေးပေးပါနော် ရှင့်။" });
}
