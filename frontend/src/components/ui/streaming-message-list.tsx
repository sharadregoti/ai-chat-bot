import React from "react"
import {
  ChatMessage,
  type ChatMessageProps,
  type Message,
} from "@/components/ui/chat-message"
import { TypingIndicator } from "@/components/ui/typing-indicator"
import { Spinner } from "@/components/ui/spinner"

type AdditionalMessageOptions = Omit<ChatMessageProps, keyof Message>

interface StreamingMessageListProps {
  messages: Message[]
  showTimeStamps?: boolean
  isTyping?: boolean
  isStreaming?: boolean
  messageOptions?:
    | AdditionalMessageOptions
    | ((message: Message) => AdditionalMessageOptions)
}

export function StreamingMessageList({
  messages,
  showTimeStamps = true,
  isTyping = false,
  isStreaming = false,
  messageOptions,
}: StreamingMessageListProps) {
  return (
    <div className="space-y-4 overflow-visible">
      {messages.map((message, index) => {
        const additionalOptions =
          typeof messageOptions === "function"
            ? messageOptions(message)
            : messageOptions

        // Determine if this is the last assistant message
        const isLastAssistantMessage = 
          message.role === "assistant" && 
          index === messages.length - 1;

        return (
          <div key={index} className="flex flex-col">
            <ChatMessage
              showTimeStamp={showTimeStamps}
              {...message}
              {...additionalOptions}
            />
            
            {/* Show spinner below the last assistant message when streaming */}
            {isLastAssistantMessage && isStreaming && (
              <div className="mt-2 ml-2">
                <Spinner size="small" show={true} />
              </div>
            )}
          </div>
        )
      })}
      {isTyping && <TypingIndicator />}
    </div>
  )
}
