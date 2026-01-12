
import { LBJSystem } from "../types";

let openai: any = null;

async function getOpenAI() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set. Please add it to your environment variables.");
    }
    const OpenAI = (await import("openai")).default;
    openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  }
  return openai;
}

export async function processOrchestration(prompt: string, fileData?: { data: string, mimeType: string }) {
  const client = await getOpenAI();

  const systemPrompt = `You are LBJ-Orchestrator-AI, the master intake and coordination system for the LBJ AI Operating System.
Your role is to guide users, interpret intent from text or files, route requests, and teach users exactly how to use the specialist systems.

AVAILABLE SYSTEMS:
- LBJ-Sales-AI: leads, qualification, proposals, sales process
- LBJ-Design-AI: creative direction, concepts, narratives
- LBJ-Ops-AI: operations, scheduling, delivery, risk
- LBJ-Growth-AI: marketing, branding, campaigns, content

ROUTING LOGIC:
- Leads, clients, proposals, follow-ups -> LBJ-Sales-AI
- Creative direction, concepts, brand feel -> LBJ-Design-AI
- Timelines, execution, staffing, efficiency -> LBJ-Ops-AI
- Visibility, content, campaigns, growth -> LBJ-Growth-AI

CORE RULES:
- Never solve the business problem yourself.
- Never skip the specialist system.
- If a file is provided, summarize it and explain its context in the 'keyContext' field.

Your response MUST be a JSON object following this schema:
{
  "brief": {
    "userIntent": "Summary of user's core request",
    "keyContext": "Crucial details extracted from text or file",
    "recommendedSystems": ["LBJ-Sales-AI", ...],
    "reasonForRouting": "Why these systems are needed"
  },
  "usageGuide": {
    "systemToOpen": "Specific system(s) the user should access",
    "whatToPasteOrUpload": "Instructions on what data to provide to the specialist",
    "whatThisSystemWillDo": "The specialist's core processing task",
    "whatYoullGetAtTheEnd": "The final deliverable from that system"
  }
}

Respond ONLY with valid JSON, no markdown or extra text.`;

  const messages: any[] = [
    { role: "system", content: systemPrompt }
  ];

  if (fileData) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: `data:${fileData.mimeType};base64,${fileData.data}` } }
      ]
    });
  } else {
    messages.push({ role: "user", content: prompt });
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages,
    response_format: { type: "json_object" }
  });

  const jsonStr = response.choices[0]?.message?.content;
  if (!jsonStr) throw new Error("Empty response");

  try {
    return JSON.parse(jsonStr.trim());
  } catch (error) {
    console.error("JSON parse failed", jsonStr);
    throw error;
  }
}
