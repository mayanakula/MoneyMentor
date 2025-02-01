import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCwcw-sxmfhScUojROZgkuFVXzO_RK_vdc');

export async function getChatResponse(message: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `You are MoneyMentor, a friendly and knowledgeable financial advisor chatbot. 
    Provide helpful, concise financial advice based on this query: ${message}
    Keep responses clear and actionable, focusing on practical financial guidance.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}