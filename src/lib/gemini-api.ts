
const API_KEY = "AIzaSyCkPXVlfWnXpQWg-DpT5Qluez_ijd5OCeU";
const BASE_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro";

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
    const prompt = `Crie um roteiro de vídeo sobre "${topic}". 
      Tom: ${tone}
      Duração alvo: ${duration} minutos
      ${additionalInstructions ? `Instruções adicionais: ${additionalInstructions}` : ""}
      
      Formate o roteiro com seções claras para INTRODUÇÃO, CONTEÚDO PRINCIPAL (com subseções se necessário) e CONCLUSÃO.
      Inclua sugestões visuais, ângulos de câmera ou efeitos entre [colchetes].
      Inclua estimativas de tempo para cada seção.
      
      Importante: Responda em português do Brasil.`;

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
      throw new Error(data.error?.message || "Falha ao gerar roteiro");
    }

    if (data.promptFeedback?.blockReason) {
      return { 
        script: "", 
        error: "O conteúdo foi bloqueado devido às configurações de segurança. Por favor, modifique sua solicitação." 
      };
    }

    const scriptContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    return {
      script: scriptContent,
    };
  } catch (error) {
    console.error("Erro ao gerar roteiro:", error);
    return {
      script: "",
      error: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
    };
  }
};
