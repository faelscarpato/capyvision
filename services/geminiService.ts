
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GenerationConfig, AspectRatio, ImageSize, VideoResolution } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.ai = new GoogleGenAI({ apiKey });
  }

  private getImageFromResponse(response: GenerateContentResponse): string | null {
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const sizeKB = Math.round(part.inlineData.data.length / 1024);
        console.log(`Imagem recebida: ${sizeKB}KB`);
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  }

  private getTextFromResponse(response: GenerateContentResponse): string | null {
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.text) return part.text;
    }
    return null;
  }

  async generateImage(prompt: string, config: GenerationConfig): Promise<string> {
    let finalPrompt = prompt;
    if (config.style && config.style !== 'None') {
      finalPrompt = `${prompt}. Artistic Style: ${config.style}`;
    }

    try {
      console.log(`Iniciando geração (${config.imageSize})...`);
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-image-preview', 
        contents: {
          parts: [{ text: finalPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: config.aspectRatio,
            imageSize: config.imageSize
          },
        },
      });

      const imageUrl = this.getImageFromResponse(response);
      if (imageUrl) return imageUrl;
      
    } catch (error) {
      console.warn("Modo Pro indisponível. Alternando para Modo Básico.", error);
    }

    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: finalPrompt }] },
            config: {
                imageConfig: {
                    aspectRatio: config.aspectRatio
                }
            }
        });

        const imageUrl = this.getImageFromResponse(response);
        if (imageUrl) return imageUrl;

        const text = this.getTextFromResponse(response);
        if (text) throw new Error(text);

    } catch (error: any) {
        throw new Error(error.message || "Falha ao gerar imagem.");
    }

    throw new Error("Nenhum dado recebido.");
  }

  async editImage(prompt: string, base64Image: string, mimeType: string, maskBase64?: string | null): Promise<string> {
    const parts: any[] = [
      {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: mimeType,
        },
      }
    ];

    if (maskBase64) {
      parts.push({
        inlineData: {
          data: maskBase64.split(',')[1],
          mimeType: 'image/png',
        },
      });
      parts.push({
        text: `The second image provided is a highlight mask indicating the area to be edited. Please modify only the highlighted region according to this instruction: ${prompt}. Maintain the rest of the image exactly as it is.`
      });
    } else {
      parts.push({ text: prompt });
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
    });

    const imageUrl = this.getImageFromResponse(response);
    if (imageUrl) return imageUrl;

    const text = this.getTextFromResponse(response);
    if (text) throw new Error(text);

    throw new Error("Nenhum dado de edição recebido.");
  }

  async analyzeImage(prompt: string, base64Image: string, mimeType: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
          { text: prompt || "Analyze this image in detail." },
        ],
      },
    });

    return response.text || "Nenhuma análise fornecida.";
  }

  async generateVideo(prompt: string, base64Image?: string, mimeType?: string, aspectRatio?: string): Promise<string> {
    const videoConfig: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9'
      }
    };

    if (base64Image && mimeType) {
      videoConfig.image = {
        imageBytes: base64Image.split(',')[1],
        mimeType: mimeType
      };
    }

    let operation = await this.ai.models.generateVideos(videoConfig);

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await this.ai.operations.getVideosOperation({ operation: operation });
      if (operation.error) {
        throw new Error(`Falha: ${operation.error.message}`);
      }
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Sem URI.");

    const response = await fetch(`${downloadLink}&key=${this.apiKey}`);
    if (!response.ok) throw new Error("Erro no download.");
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
