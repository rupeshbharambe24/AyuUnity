"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Send, X } from "lucide-react"

type Message = {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [language, setLanguage] = useState("en")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      let botResponse = ""

      if (input.toLowerCase().includes("appointment")) {
        botResponse =
          language === "en"
            ? "You can book an appointment from your dashboard. Would you like me to guide you through the process?"
            : "आप अपने डैशबोर्ड से अपॉइंटमेंट बुक कर सकते हैं। क्या आप चाहते हैं कि मैं आपको इस प्रक्रिया में मदद करूं?"
      } else if (input.toLowerCase().includes("symptom") || input.toLowerCase().includes("sick")) {
        botResponse =
          language === "en"
            ? "I can help you assess your symptoms. Please describe what you're experiencing in detail."
            : "मैं आपके लक्षणों का आकलन करने में आपकी मदद कर सकता हूं। कृपया विस्तार से बताएं कि आप क्या अनुभव कर रहे हैं।"
      } else if (input.toLowerCase().includes("prescription")) {
        botResponse =
          language === "en"
            ? "You can view and download your prescriptions from the Prescriptions section in your dashboard."
            : "आप अपने डैशबोर्ड के प्रिस्क्रिप्शन सेक्शन से अपने प्रिस्क्रिप्शन देख और डाउनलोड कर सकते हैं।"
      } else {
        botResponse =
          language === "en"
            ? "Thank you for your message. How else can I assist you today?"
            : "आपके संदेश के लिए धन्यवाद। मैं आपकी और किस प्रकार सहायता कर सकता हूं?"
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)

    // Add language change notification
    const notification: Message = {
      id: Date.now().toString(),
      text: value === "en" ? "Language changed to English" : "भाषा हिंदी में बदल दी गई है",
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, notification])
  }

  return (
    <>
      <Button className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <MessageCircle />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-6 w-80 sm:w-96 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 overflow-y-auto space-y-4 pr-2">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="flex w-full gap-2">
              <Input
                placeholder={language === "en" ? "Type a message..." : "संदेश टाइप करें..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
