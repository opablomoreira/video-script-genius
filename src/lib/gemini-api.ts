const API_KEY = "AIzaSyCkPXVlfWnXpQWg-DpT5Qluez_ijd5OCeU";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash";

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
    const prompt = `Crie um roteiro de vídeo sobre "${topic}" em formato de tabela com 3 colunas: CENA, ÁUDIO (locução off) e IMAGEM (ilustração/animação).
      
      Tom: ${tone}
      Duração alvo: ${duration} minutos
      ${additionalInstructions ? `Instruções adicionais: ${additionalInstructions}` : ""}
      
      Estruture o roteiro como uma tabela com os seguintes elementos:
      - Uma linha de cabeçalho com CENA | ÁUDIO (locução off) | IMAGEM (ilustração/animação)
      - Divida o conteúdo em cenas numeradas (1, 2, 3, etc.)
      - Para cada cena, indique o texto para locução na coluna ÁUDIO
      - Para cada cena, descreva o que deve aparecer na tela na coluna IMAGEM
      - O roteiro deve ter início, meio e fim claros
      - Inclua 5-8 cenas no total
      - Cada cena deve ser breve, permitindo que o roteiro inteiro caiba na duração especificada
      
      Importante: Responda em português do Brasil com o roteiro completo em formato de tabela.`;

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
    
    // Formata o roteiro como um título seguido de uma tabela
    const formattedScript = `${topic.toUpperCase()}
ROTEIRO v.1 / ${new Date().toLocaleDateString('pt-BR')} / Duração estimada: ${duration} minutos

${scriptContent}

---
Gerado por Rôterizei usando IA`;
    
    return {
      script: formattedScript,
    };
  } catch (error) {
    console.error("Erro ao gerar roteiro:", error);
    return {
      script: "",
      error: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
    };
  }
};
