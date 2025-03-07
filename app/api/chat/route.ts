import { NextResponse } from "next/server";

// Define the expected response type from your FastAPI backend
type FastAPIResponse = {
  response: string;
  sources?: Array<{
    section_title: string;
    source_url: string;
    content?: string;
  }>;
};

// Define the expected request body type
type RequestBody = {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
};

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages }: RequestBody = await req.json();

    // Get the last user message
    const lastMessage = messages[messages.length - 1].content;
    const CHAT_LINK = process.env.NEXT_PUBLIC_CHAT_LINK;

    if (!CHAT_LINK) {
      throw new Error("NEXT_PUBLIC_CHAT_LINK is not defined in environment variables");
    }
    // Forward the request to your FastAPI backend
    const response = await fetch(CHAT_LINK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any required headers from your FastAPI
      },
      body: JSON.stringify({ query: lastMessage }),
    });

    // Handle non-OK responses
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the FastAPI response
    const data: FastAPIResponse = await response.json();

    // Format the response for the frontend
    return NextResponse.json({
      id: Date.now().toString(), // Unique ID for the message
      content: data.response, // The chatbot's response
      role: "assistant", // Role of the message
      sources: data.sources?.map((source) => ({
        title: source.section_title, // Title of the source
        url: source.source_url, // URL of the source
        content: source.content || "", // Content of the source (if available)
      })),
    });
  } catch (error) {
    console.error("[CHAT_ERROR]", error);

    // Return an error response
    return NextResponse.json(
      {
        id: Date.now().toString(),
        content: "Sorry, I'm having trouble connecting to the support system. Please try again later.",
        role: "assistant",
      },
      { status: 500 }
    );
  }
}