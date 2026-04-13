import OpenAI from "openai";

export async function POST(req) {
  const body = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
You are a professional football coach.

Analyze this training session:
- drill: ${body.drill || "dribbling"}
- duration: ${body.duration || "short video"}

Return JSON:
{
  "score": number (0-100),
  "strengths": [3 items],
  "improvements": [3 items]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return Response.json({
    result: response.choices[0].message.content,
  });
}
