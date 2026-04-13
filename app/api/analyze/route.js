import OpenAI from "openai";

export async function POST(req) {
  const body = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",

    messages: [
      {
        role: "system",
        content: "You are a professional football coach.",
      },
      {
        role: "user",
        content: `
Analyze this training:
- drill: ${body.drill}
- duration: ${body.duration}
        `,
      },
    ],

    // 🔥 핵심 (JSON 강제)
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "football_analysis",
        schema: {
          type: "object",
          properties: {
            score: { type: "number" },
            strengths: {
              type: "array",
              items: { type: "string" },
            },
            improvements: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["score", "strengths", "improvements"],
        },
      },
    },
  });

  // 🔥 이제 JSON.parse 필요 없음
  const result = JSON.parse(response.choices[0].message.content);

  return Response.json({
    result,
  });
}
