import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store key in `.env`
});

export const getAIResponse = async (userMessage) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // or "gpt-4"
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};
