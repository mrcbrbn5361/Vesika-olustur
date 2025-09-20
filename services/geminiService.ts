import { GoogleGenAI, Modality } from "@google/genai";

export async function editImageWithGemini(
  base64ImageData: string,
  mimeType: string,
  apiKey: string
): Promise<string | null> {
  if (!apiKey) {
    throw new Error("API key is missing. Please enter your API key.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const systemInstruction = {
        text: `You are an AI assistant that creates professional, biometric-standard passport photos from a user's image.
- The person's face, facial features, hair style, and head shape MUST NOT be altered in any way. Preserve the original identity and all unique biometric identifiers.
- The person should be looking directly at the camera with a neutral expression and their mouth closed.
- Change the clothing to be formal or business-appropriate attire (e.g., a collared shirt, blouse, or suit jacket). The clothing should look natural on the person.
- Replace the background with a solid, uniform, off-white or light grey color suitable for official passport photos.
- Ensure the lighting is even, with no shadows on the face or background.
- The final image must be a high-quality, realistic, head-and-shoulders portrait.
- Output ONLY the generated image file. Do not include any text, explanation, or commentary.`
    };
    
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };
    
    const userTextPart = {
      text: "Generate a biometric passport photo based on the provided image.",
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
        if (error.message.includes('API key not valid')) {
            throw new Error(`Your API key is not valid. Please check it and try again.`);
        }
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}