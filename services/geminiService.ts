import { GoogleGenAI, Chat, Content } from "@google/genai";
import { Exam, Message, Role } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;
let currentExam: Exam | null = null;

const initializeChat = (exam: Exam) => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    // Force a new chat session if the exam type changes or if the chat is not initialized
    if (exam !== currentExam || !chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
            // Start with a clean history for each new session
            history: [],
        });
        currentExam = exam;
        console.log(`New chat session started for ${exam}`);
    }
};

export const getChatResponse = async (
    prompt: string, 
    history: Message[],
    exam: Exam
): Promise<string> => {
    
    initializeChat(exam);

    if (!chat) {
        throw new Error("Chat session not initialized");
    }

    try {
        const result = await chat.sendMessage({ message: prompt });
        return result.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        // Reset chat session on error to allow for a fresh start
        chat = null;
        currentExam = null;
        throw new Error("Failed to get response from Gemini API.");
    }
};
