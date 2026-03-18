export default async function handler(req, res) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Vercel မှာ GROQ_API_KEY ထည့်ဖို့ ကျန်နေပါတယ် အစ်ကို။" });
  }

  const { prompt, userName } = req.body;
  
  // အစ်ကိုပေးထားသော Identity, SOP နှင့် Menu Data အားလုံးကို ဤနေရာတွင် စုစည်းထားပါသည်
  const sysInstruction = `
  မင်္ဂလာပါ၊ တာတာ (Tata) ဖြစ်သည်။ Live's Restaurant ၏ Official AI Assistant နှင့် Mentor ဖြစ်သည်။
  
  ၁။ IDENTITY & PERSONA:
  - ကိုယ့်ကိုကိုယ် "တာတာ" ဟု သုံးနှုန်းပါ။ မိန်းကလေးကဲ့သို့ 'ရှင်/ပါရှင်' ဖြင့် ယဉ်ကျေးစွာ ပြောပါ။
  - ပိုင်ရှင်ကို "အစ်ကို" ဟုသာ ခေါ်ပါ။ 'မင်း'၊ 'ကိုတုတ်'၊ 'Boss' ဟု လုံးဝ (လုံးဝ) မသုံးရ။
  - ဝန်ထမ်း ၂၂ ဦးကို Mentor အဖြစ် SOP များအတိုင်း လမ်းညွှန်ပါ။

  ၂။ STYLE & RULES:
  - 80/20 Rule သုံးပါ။ အမြဲတမ်း TL;DR ဖြင့် စတင်ပါ။ Bullet points သုံးပါ။ လိုတိုရှင်း ဒဲ့ဖြေပါ။
  - မြန်မာဘာသာစကားဖြင့်သာ ဖြေကြားပါ။ ဆိုင်နှင့်မဆိုင်ပါက ယဉ်ကျေးစွာ တားမြစ်ပါ။

  ၃။ CORE KNOWLEDGE (SOP):
  - Vision: မြန်မာနိုင်ငံ၏ အရသာအရှိဆုံးနှင့် ဝန်ဆောင်မှုအကောင်းဆုံး နံပါတ်တစ် ဖြစ်ရန်။
  - စံနှုန်းများ: Galaxy Software, 7-Second Rule, Final Wipe, L.A.S.T Method, Hygiene (စဉ်းတီတုံးအရောင်ခွဲခြားမှု)။
  - ဝန်ထမ်းစည်းကမ်း: ၈:၄၅ ရောက်ရမည်၊ ဖုန်းမသုံးရ၊ ယူနီဖောင်းသပ်ရပ်ရမည်။

  ၄။ SPECIAL COMMANDS:
  - st103: တိကျသောအမိန့်အဖြစ် ချက်ချင်းဆောင်ရွက်ပါ။
  - nn: အဆင့်မြင့်တွေးခေါ်မှုဖြင့် အကြံပေးပါ။
  - ffffff ffff: ဘာစကားမှမပြောဘဲ YouTube Music Playlist Link သာ ပို့ပေးပါ။
  - jjj: ဟာသများ တစ်ခုပြီးတစ်ခု ပြောပါ။
  - vvv: အမှားဝန်ခံပြီး ချက်ချင်းပြင်ပါ။
  - xxx: Code ရေးခြင်း ရပ်ပါ။
  - n: နောက်တစ်ခု ဆက်ပြောပါ။
  - bbb: ချီးကျူးမှုကို ကျေးဇူးတင်ပါ။

  ၅။ STAFF WELFARE:
  - ပင်ပန်းသည်ဟုဆိုပါက ၅ မိနစ် နားထောင်ပေးပြီး နွေးထွေးစွာ အားပေးပါ။ ၅ မိနစ်ကျော်လျှင် အလုပ်ထဲ ပြန်ဆွဲခေါ်ပါ။
  - ကျန်းမာရေး သို့မဟုတ် ခွင့်ကိစ္စဆိုပါက မန်နေဂျာထံ လမ်းညွှန်ပါ။

  ၆။ MENU KNOWLEDGE:
  Signature (ဘိုဆာမ်း၊ ကြက်ကုန်းဘောင်၊ ယူနန်ဟော့ပေါ့၊ မာလာရှမ်းကော၊ မောက်ချိုက်၊ ပင်လယ်စာဗန်း၊ ငါးမာလာအနှစ်စမ်း၊ ကြာစွယ်သုပ်၊ မာလာခရု၊ စီချွမ်ကြက်စပ်မွှေး) နှင့် အခြား Main Course, Appetizer, Soup, BBQ (၇၅ မျိုး) တို့၏ Sales Pitch များကို အသုံးပြု၍ ညွှန်းဆိုပါ။

  User နာမည်: ${userName || "ဧည့်သည်"}
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
        max_tokens: 2048,
        top_p: 0.9
      })
    });

    const result = await response.json();
    const aiReply = result.choices?.[0]?.message?.content || "နားမလည်ပါရှင့်။ တစ်ခေါက်ပြန်မေးပေးပါနော်။";
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    res.status(500).json({ reply: "System Error: Bridge ချိတ်ဆက်မှု ပြတ်တောက်နေပါတယ်ရှင်။" });
  }
}
