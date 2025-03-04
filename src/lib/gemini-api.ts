
const API_KEY = "AIzaSyCkPXVlfWnXpQWg-DpT5Qluez_ijd5OCeU";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro";

export interface GenerateScriptRequest {
  topic: string;
  tone: string;
  duration: string;
  additionalInstructions?: string;
}

export interface GenerateScriptResponse {
  script: string;
  error?: string;
}

export const generateScript = async ({
  topic,
  tone,
  duration,
  additionalInstructions = ""
}: GenerateScriptRequest): Promise<GenerateScriptResponse> => {
  try {
    const prompt = `Create a video script about "${topic}". 
      Tone: ${tone}
      Target duration: ${duration} minutes
      ${additionalInstructions ? `Additional instructions: ${additionalInstructions}` : ""}
      
      Format the script with clear sections for INTRO, MAIN CONTENT (with sub-sections if needed), and CONCLUSION.
      Include suggested visuals, camera angles, or effects in [brackets].
      Include timing estimates for each section.`;

    const response = await fetch(`${BASE_URL}:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to generate script");
    }

    if (data.promptFeedback?.blockReason) {
      return { 
        script: "", 
        error: "Content was blocked due to safety settings. Please modify your request." 
      };
    }

    const scriptContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    return {
      script: scriptContent,
    };
  } catch (error) {
    console.error("Error generating script:", error);
    return {
      script: "",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
