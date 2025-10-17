import {google} from "@ai-sdk/google"
import {streamText} from 'ai'
import { NextResponse } from "next/server"

export async function POST(){
    const prompt = "Create a list of three open-ended annd engaging questions formatted as a single string. Each question should be seperated by '||' . These questions are for an anonymous social messaging platform, like Qooh.me , and should be suitable for a diverse audience. Avoid personal or sensitive topics,focusing instead pn universal themes that encourage friendly interaction. FOr example , your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure , who would it be? || What's a simple thing that makes you happy?.' Ensure the questions are intriguing , foster curiosity , and contribute to a positive and welcoming conversational envrionemnt."

    try {
        const result = streamText({
            model: google('gemini-2.5-flash'),
            prompt: prompt,
        });

        const text = await result.text;
        return new NextResponse(text);
        
    } catch (error) {
        console.log("Error while generating a reply from Gemini", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}



