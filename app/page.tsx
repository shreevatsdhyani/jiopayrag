"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Bot, Send, User } from "lucide-react";
import { useCallback, useState } from "react";

// Define the Message type
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    title: string;
    url: string;
    content: string;
  }>;
};

type Source ={
  section_title: string;
  source_url: string;
  content?: string;
  url:string;
}


export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content: "Hello! I'm the JioPay support assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      setIsLoading(true);

      try {
        // Add user message to the chat
        const userMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: input,
        };
        setMessages((prev) => [...prev, userMessage]);

        // Call the FastAPI backend


        const CHAT_LINK = process.env.NEXT_PUBLIC_CHAT_LINK;

        if (!CHAT_LINK) {
          throw new Error("NEXT_PUBLIC_CHAT_LINK is not defined in environment variables");
        }

        const response = await fetch(CHAT_LINK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: input }),
        });

        if (!response.ok) throw new Error("Failed to get response");

        const data = await response.json();

        // Add assistant response to the chat
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.response,
          sources: data.sources?.map((source: Source) => ({
            title: source.section_title,
            url: source.source_url,
            content: source.content || "", // Add content if available
          })),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error(error);

        // Add error message to the chat
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting to the support system. Please try again later.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setInput(""); // Clear input field
      }
    },
    [input, isLoading]
  );

  return (
    <div className="flex flex-col min-h-[100dvh] p-4 md:p-8 bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto mb-6 flex items-center justify-center">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
          <div className="h-8 w-8 rounded-full bg-jio-blue flex items-center justify-center">
            <span className="text-white font-bold">J</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-jio-blue via-jio-red to-jio-orange bg-clip-text text-transparent">
            JioPay Support
          </h1>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="w-full max-w-4xl mx-auto flex flex-col h-[80vh] border-jio-blue/20 shadow-lg">
        <CardHeader className="px-6 border-b border-jio-blue/10 bg-gradient-to-r from-jio-blue/5 to-jio-lightBlue/5">
          <CardTitle className="flex items-center gap-2 text-jio-blue">
            <Bot className="h-6 w-6 text-jio-blue" />
            JioPay Support Assistant
          </CardTitle>
          <CardDescription>Ask any questions about JioPay services, features, or troubleshooting</CardDescription>
        </CardHeader>

        {/* Chat Messages */}
        <CardContent className="flex-1 px-6 overflow-hidden pt-6">
          <ScrollArea className="h-full pr-4">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {/* Loading Skeleton */}
              {isLoading && (
                <div className="flex items-start gap-3 text-left">
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-jio-blue text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Chat Input */}
        <CardFooter className="px-6 pb-6 pt-4 border-t border-jio-blue/10">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              placeholder="Ask a question about JioPay..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border-jio-blue/20 focus-visible:ring-jio-blue/30"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-jio-blue hover:bg-jio-lightBlue transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

// ChatMessage Component
interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className="flex items-start gap-3 text-left">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
          isUser ? "bg-jio-orange text-white" : "bg-jio-blue text-white"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex-1">
        <div className={cn("prose dark:prose-invert max-w-none", isUser ? "text-jio-orange/90" : "text-jio-blue/90")}>
          {message.content}
        </div>

        {/* Display Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-jio-blue mb-2">Sources:</p>
            <div className="space-y-2">
              {message.sources.map((source, index) => (
                <div
                  key={index}
                  className="rounded-md border border-jio-blue/10 p-3 text-sm bg-gradient-to-r from-jio-blue/5 to-transparent"
                >
                  <div className="font-medium text-jio-blue">{source.title}</div>
                  <div className="text-muted-foreground text-xs mt-1 mb-2">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-jio-red hover:underline"
                    >
                      {source.url}
                    </a>
                  </div>
                  <div className="text-xs line-clamp-2">{source.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}