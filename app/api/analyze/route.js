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
        content: `
You are a professional football coach.

Analyze the training and ALSO estimate player style attributes.

IMPORTANT:
Return realistic football metrics between 60 and 95.

styleData meaning:
- dribblingSpeed: how fast the player moves with ball
- control: ball control quality
- agility: quick direction change ability
        `,
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

    // 🔥 JSON 강제 + styleData 추가
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

            // 🔥 추가
            styleData: {
              type: "object",
              properties: {
                dribblingSpeed: { type: "number" },
                control: { type: "number" },
                agility: { type: "number" },
              },
              required: ["dribblingSpeed", "control", "agility"],
            },
          },
          required: ["score", "strengths", "improvements", "styleData"],
        },
      },
    },
  });

  const result = JSON.parse(response.choices[0].message.content);

  return Response.json({
    result,
  });
}
