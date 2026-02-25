import { streamText} from "ai";
import { logger } from "../../../lib/logger";
import { apiError } from "../../../lib/apiError";
import { createGroq } from '@ai-sdk/groq';

export async function POST() {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?.' Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

    const groq = createGroq({
        apiKey: process.env.GROQ_API_KEY,
    });

    try {
        const result = streamText({
            model: groq('llama-3.1-8b-instant'),
            prompt,
        });

        return result.toUIMessageStreamResponse()
    } catch (error) {
        logger.error("Error suggesting messages", error);
        return apiError(500, "Internal Server Error in generating messages");
    }
}