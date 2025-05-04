// Chat component with persistent state

"use client"

import { useCallback, useEffect } from "react"
import { useChat, type UseChatOptions } from "@ai-sdk/react"

import { cn } from "@/lib/utils"
// import { transcribeAudio } from "@/lib/utils/audio"
import { Chat } from "@/components/ui/chat"
import { type Message } from "@/components/ui/chat-message"
import { useChatContext } from "./ChatContext"

type ChatDemoProps = {
    initialMessages?: UseChatOptions["initialMessages"]
}

// Convert AI SDK message to our local Message type
const convertToLocalMessage = (message: any): Message => {
    return {
        id: message.id || Math.random().toString(36).substring(2, 10),
        role: message.role,
        content: message.content,
        createdAt: message.createdAt || new Date(),
        // Add other properties as needed
    }
}

// SSE API endpoint - use configuration if available
const SSE_API_URL = "http://localhost:3000/api/stream"

export function ChatDemo(props: ChatDemoProps) {
    // Get chat state from context
    const {
        messages,
        status,
        controller,
        append,
        updateLastAssistantMessage,
        setStatus,
        setController,
        setMessages
    } = useChatContext();

    // Use the original useChat hook for input management
    const {
        input,
        handleInputChange,
        stop,
    } = useChat({
        ...props,
        api: "/api/chat", // This won't be used in our implementation
        body: {},
    })

    // Initialize with any initial messages
    useEffect(() => {
        if (props.initialMessages && props.initialMessages.length > 0 && messages.length === 0) {
            const convertedMessages = props.initialMessages.map(convertToLocalMessage)
            setMessages(convertedMessages)
        }
    }, [props.initialMessages, messages.length, setMessages])

    // Function to stop the streaming response
    const stopStreaming = useCallback(() => {
        if (controller) {
            controller.abort()
            setController(null)
            setStatus('ready')
        }
    }, [controller, setController, setStatus])

    // Custom handleSubmit function to connect to SSE API
    const handleSubmit = useCallback((event?: { preventDefault?: () => void }) => {
        if (event?.preventDefault) {
            event.preventDefault()
        }

        if (!input.trim()) return

        // Add user message
        append({ role: "user", content: input })
        
        // Show submitted state
        setStatus('submitted')
        
        // Clear the input box
        handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement>)
        
        // Create empty assistant message that will be updated as stream comes in
        const assistantMessage = append({ 
            role: "assistant", 
            content: ""
        })
        
        // Set up headers for SSE
        const headers = new Headers({
            'Accept': 'text/event-stream',
            'Content-Type': 'application/json'
        })

        // Create abort controller for the fetch request
        const abortController = new AbortController()
        setController(abortController)
        const signal = abortController.signal

        // Format messages for the API
        const messageHistory = [
            ...messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            // Add the current user message
            { role: "user", content: input }
        ];

        // Connect to SSE API - change to streaming state once connection is established
        setStatus('submitted')
        fetch(SSE_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ messages: messageHistory }),
            signal: signal
        }).then(response => {
            if (!response.body) {
                throw new Error('Response body is null')
            }
            
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''
            let accumulatedText = ''
            
            // Change to streaming state once we start receiving data
            setStatus('streaming')

            function processStream() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        console.log('Stream complete')
                        setStatus('ready')
                        setController(null)
                        return
                    }

                    buffer += decoder.decode(value, { stream: true })
                    const lines = buffer.split('\n\n')
                    buffer = lines.pop() || ''

                    for (const line of lines) {
                        if (line.trim() === '') continue

                        const dataMatch = line.match(/^data: (.+)$/m)
                        if (!dataMatch) continue
                        const data = dataMatch[1]

                        if (data === '[DONE]') {
                            setStatus('ready')
                            setController(null)
                            return
                        }

                        try {
                            const parsedData = JSON.parse(data)
                            if (parsedData.text) {
                                accumulatedText += parsedData.text
                                updateLastAssistantMessage(accumulatedText)
                            }
                        } catch (error) {
                            console.error('Error parsing SSE data:', error)
                        }
                    }

                    processStream()
                }).catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error('Error reading from stream:', error)
                        updateLastAssistantMessage(accumulatedText || 'Sorry, something went wrong with the streaming connection.')
                    }
                    setStatus('error')
                    setController(null)
                })
            }

            processStream()
        }).catch(error => {
            if (error.name !== 'AbortError') {
                console.error('Error fetching stream:', error)
                updateLastAssistantMessage('Sorry, something went wrong with the streaming connection.')
            }
            setStatus('error')
            setController(null)
        })
    }, [input, append, updateLastAssistantMessage])

    // Override the stop function to abort the fetch request
    const handleStop = useCallback(() => {
        stopStreaming()
        stop?.() // Call the original stop function as well
    }, [stop, stopStreaming])

    return (
        <div className={cn("flex", "flex-col", "h-[500px]", "w-full")}>
            <Chat
                className="grow"
                messages={messages}
                handleSubmit={handleSubmit}
                input={input}
                handleInputChange={handleInputChange}
                isGenerating={status === 'submitted' || status === 'streaming'}
                stop={handleStop}
                append={append}
                suggestions={[]} // Add empty suggestions to satisfy the type
                setMessages={setMessages}
            // transcribeAudio={transcribeAudio}
            />
        </div>
    )
}
