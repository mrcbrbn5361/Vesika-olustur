import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function editImageWithGemini(
  base64ImageData: string,
  mimeType: string
): Promise<string | null> {
  try {
    const systemInstruction = {
        text: `You are an AI assistant that creates professional passport photos from a user's image.
- The person's face, facial features, hair style, and head shape MUST NOT be altered in any way. Preserve the original identity.
- Change the clothing to be formal or business-appropriate attire (e.g., a collared shirt, blouse, or suit jacket). The clothing should look natural on the person.
- Replace the background with a solid white color (#FFFFFF), suitable for official passport photos.
- The final image should be a high-quality, realistic, portrait-style photograph.
- Output ONLY the generated image file. Do not include any text, explanation, or commentary.`
    };
    
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };
    
    const userTextPart = {
      text: "Generate a professional passport photo.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          systemInstruction,
          userTextPart,
          imagePart,
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Loop through the response parts to find the edited image
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    // If no image is found in the parts, return null
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}