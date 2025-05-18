import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ChatMessage } from "./ChatMessage"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatWidget() {
  // widget/button states for animations
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // avoids doing animation for button component when pulsing timer resets
  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShouldAnimate(false)
      }, 300) // Match animation duration
      return () => clearTimeout(timer)
    }
  }, [shouldAnimate])

  // Start pulsing animation every 10 seconds when closed
  useEffect(() => {
    if (!isOpen) {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      const intervalId = setInterval(() => {
        setIsPulsing(true)
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => setIsPulsing(false), 1000)
      }, 10000)

      // cleanup both intervals when component unmounts
      return () => {
        clearInterval(intervalId)
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        setIsPulsing(false)
      }
    }
  }, [isOpen])

  // Handle animation timing for opening/closing
  useEffect(() => {
    if (isOpen) {
      setShouldAnimate(false)
      setIsVisible(true)
      setIsClosing(false)
    } else {
      setIsClosing(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setIsClosing(false)
        setIsMinimized(false)
        setShouldAnimate(true)
      }, 300) // Keep consistent animation duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch response")
      }

      const data = await response.json()

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    if (isMinimized) {
      // Close directly from minimized state
      setIsOpen(false)
    } else {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isVisible && (
        <Card
          className={cn(
            "w-80 md:w-96 shadow-lg mb-2 transition-all duration-300",
            {
            'animate-slide-in': isOpen && !isClosing,
            'animate-slide-out': !isOpen && isClosing,
            'h-14': isMinimized,
            'h-[450px]': !isMinimized,
            },
            "origin-bottom-right"
          )}
        >
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-medium text-sm">Chat</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent
                className={cn(
                  "p-3 overflow-y-auto flex flex-col gap-3",
                  "transition-all duration-300 ease-in-out",
                  isMinimized ? "opacity-0 h-0" : "opacity-100 h-[340px]"
                )}
              >
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-center">
                    <div className="flex space-x-1 items-center">
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              <CardFooter
                className={cn("p-3 pt-0 transition-all duration-300", isMinimized ? "opacity-0" : "opacity-100")}
              >
                <div className="flex w-full items-center space-x-2">
                  <div className="flex w-full items-center gap-2">
                        <div className="flex-grow">
                            <Input
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                className="w-full"
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    
      {!isVisible && (
        <Button
          className={cn(
            "rounded-full h-14 w-14 shadow-lg transition-all duration-300",
            shouldAnimate ? "animate-fade-in-up" : "",
            isPulsing && !isOpen ? "animate-pulse" : "",
          )}
          onClick={toggleChat}
      >
        <MessageSquare
          className={cn("h-6 w-6 transition-transform duration-300", isPulsing && !isOpen ? "scale-110" : "scale-100")}
        />
      </Button>
      )}
    </div>
  )
}
