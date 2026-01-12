
import { LBJSystem } from "../types";

let ai: any = null;
let Type: any = null;

async function getAI() {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set. Please add it to your .env file.");
    }
    const { GoogleGenAI, Type: GenAIType } = await import("@google/genai");
    Type = GenAIType;
    ai = new GoogleGenAI({ apiKey });
  }
  return { ai, Type };
}

export async function processOrchestration(prompt: string, fileData?: { data: string, mimeType: string }) {
  const { ai, Type } = await getAI();

  const parts: any[] = [{ text: prompt }];

  if (fileData) {
    parts.unshift({
      inlineData: {
        data: fileData.data,
        mimeType: fileData.mimeType,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      systemInstruction: `You are LBJ-Orchestrator-AI, the master intake and coordination system for the LBJ AI Operating System.
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
      }`,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brief: {
            type: Type.OBJECT,
            properties: {
              userIntent: { type: Type.STRING },
              keyContext: { type: Type.STRING },
              recommendedSystems: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              reasonForRouting: { type: Type.STRING }
            },
            required: ["userIntent", "keyContext", "recommendedSystems", "reasonForRouting"]
          },
          usageGuide: {
            type: Type.OBJECT,
            properties: {
              systemToOpen: { type: Type.STRING },
              whatToPasteOrUpload: { type: Type.STRING },
              whatThisSystemWillDo: { type: Type.STRING },
              whatYoullGetAtTheEnd: { type: Type.STRING }
            },
            required: ["systemToOpen", "whatToPasteOrUpload", "whatThisSystemWillDo", "whatYoullGetAtTheEnd"]
          }
        },
        required: ["brief", "usageGuide"]
      }
    }
  });

  const jsonStr = response.text;
  if (!jsonStr) throw new Error("Empty response");

  try {
    return JSON.parse(jsonStr.trim());
  } catch (error) {
    console.error("JSON parse failed", jsonStr);
    throw error;
  }
}
