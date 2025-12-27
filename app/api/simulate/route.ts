import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import * as weave from "weave";

weave.init('nrgizers/stratos');

const createCompletion = weave.op(
  async (message: string): Promise<string> => {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error("Missing API Key");
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "text/plain", temperature: 0.8 }
      });
      const result = await model.generateContent(message);
      return result.response.text();
    } catch (error) {
      throw new Error(`API Generation Failed: ${(error as Error).message}`);
    }
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, context, options } = body;
    
    const prompt = `
      You are the "Strategic Digital Twin" for ${companyName}.
      
      ROLE:
      Act as a Game Theory Engine. Treat competitors as rational, resource-bounded, and strategically selfish agents.
      
      INPUT:
      Context: ${context}
      Options: ${options}
      
      TASKS:
      1. ANALYZE COMPETITORS: Identify the primary competitor and their "Dominant Strategy".
      2. GENERATE STRATEGIES: Create 3 scenarios.
      3. RISK MATRIX: For each scenario, assign specific High/Medium/Low levels to Financial, Legal, Market, and Brand risks.
      
      OUTPUT JSON SCHEMA:
      {
        "twin_status": "Synced with Live Market Model",
        "competitor_profile": {
          "name": "String",
          "archetype": "String",
          "likely_counter_move": "String",
          "threat_level": "High | Critical | Moderate"
        },
        "scenarios": [
          {
            "id": "1",
            "title": "String",
            "outcome_3m": "String",
            "outcome_12m": "String",
            "risk_score": 85,
            "competitor_reaction": "String",
            "risk_matrix": {
              "financial": "High",
              "legal": "Low",
              "market": "Medium",
              "brand": "Low"
            }
          }
        ],
        "recommended_id": "1",
        "implementation_flowchart": {
          "nodes": [
            { "id": "1", "label": "Start", "type": "input" },
            { "id": "2", "label": "Action", "type": "process" }
          ],
          "edges": [
            { "source": "1", "target": "2", "label": "Next" }
          ]
        }
      }
    `;
    
    const result = await createCompletion(prompt);
    const data = result.replace('```json', '').replace('```', '').trim();
    
    try {
      const parsedData = JSON.parse(data);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      return NextResponse.json({ 
        error: "Twin Synchronization Failed (JSON Error)" 
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ 
      error: (error as Error).message 
    }, { status: 500 });
  }
}