import OpenAI from "openai";
import { openAIApiKey } from "../config";

const openai = new OpenAI({
  apiKey: openAIApiKey,
});

export type GPTChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function accessGPTChat({
  text,
  previousChatMessages = [],
}: {
  text: string;
  previousChatMessages?: GPTChatMessage[];
}): Promise<string | null> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      ...previousChatMessages,
      {
        role: "user",
        content: [{ type: "text", text }],
      },
    ],
  });
  return response.choices[0].message.content;
}
