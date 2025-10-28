
import { GoogleGenAI, Type } from "@google/genai";
import type { TreatmentPlanProcedure } from '../types';

export const generatePatientSummary = async (notes: string): Promise<string> => {
  // Assume process.env.API_KEY is configured in the environment
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.warn("API_KEY for Gemini is not set. AI features will be disabled.");
    return "API Key is not configured. Please set it up to use AI features.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `
      You are an expert dental assistant. Summarize the following patient notes into a concise, easy-to-read overview for a dentist.
      Focus on key issues, recent treatments, and any patient-specific concerns like allergies or anxiety. Use bullet points.

      Patient Notes:
      ---
      ${notes}
      ---
      
      Summary:
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating patient summary:", error);
    if (error instanceof Error) {
        return `Failed to generate summary. Error: ${error.message}`;
    }
    return "An unknown error occurred while generating the summary.";
  }
};

export const generateTreatmentPlan = async (prompt: string): Promise<Omit<TreatmentPlanProcedure, 'id' | 'status'>[]> => {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        console.warn("API_KEY for Gemini is not set. AI features will be disabled.");
        throw new Error("API Key is not configured. Please set it up to use AI features.");
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        
        const fullPrompt = `Based on the following patient notes, create a structured dental treatment plan. List the necessary procedures with their estimated costs.
        
        Patient Notes:
        ---
        ${prompt}
        ---
        
        Treatment Plan Procedures:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: {
                                type: Type.STRING,
                                description: "The name of the dental procedure.",
                            },
                            cost: {
                                type: Type.NUMBER,
                                description: "The estimated cost of the procedure.",
                            },
                        },
                        required: ["description", "cost"],
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const plan = JSON.parse(jsonText);
        return plan as Omit<TreatmentPlanProcedure, 'id' | 'status'>[];

    } catch (error) {
        console.error("Error generating treatment plan:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate treatment plan. Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the treatment plan.");
    }
};
