import { GoogleGenAI } from "@google/genai";

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