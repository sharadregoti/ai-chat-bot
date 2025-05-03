import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { type Message } from "@/components/ui/chat-message";

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// Define the shape of our context
interface ChatContextType {
  messages: Message[];
  status: 'ready' | 'submitted' | 'streaming' | 'error';
  controller: AbortController | null;
  append: (message: { role: "user" | "assistant"; content: string }) => Message;
  updateLastAssistantMessage: (content: string) => void;
  setStatus: React.Dispatch<React.SetStateAction<'ready' | 'submitted' | 'streaming' | 'error'>>;
  setController: React.Dispatch<React.SetStateAction<AbortController | null>>;
  setMessages: (newMessages: Message[]) => void;
}

// Create the context with a default value
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setLocalMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<'ready' | 'submitted' | 'streaming' | 'error'>('ready');
  const [controller, setController] = useState<AbortController | null>(null);

  // Custom append function to add messages to our local state
  const append = useCallback((message: { role: "user" | "assistant"; content: string }) => {
    const newMessage: Message = {
      id: generateId(),
      role: message.role,
      content: message.content,
      createdAt: new Date(),
    };
    
    setLocalMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Function to update the content of the last assistant message
  const updateLastAssistantMessage = useCallback((content: string) => {
    setLocalMessages(prev => {
      const lastAssistantIndex = [...prev].reverse().findIndex(m => m.role === "assistant");
      if (lastAssistantIndex === -1) return prev;
      
      const actualIndex = prev.length - 1 - lastAssistantIndex;
      const updated = [...prev];
      updated[actualIndex] = {
        ...updated[actualIndex],
        content
      };
      return updated;
    });
  }, []);

  // Function to set messages that matches the expected type
  const setMessages = useCallback((newMessages: Message[]) => {
    setLocalMessages(newMessages);
  }, []);

  // Create the context value
  const contextValue: ChatContextType = {
    messages,
    status,
    controller,
    append,
    updateLastAssistantMessage,
    setStatus,
    setController,
    setMessages,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use the chat context
export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
