"use client"

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react"
import { useCategorySidebar } from "../layout/sidebar/category-sidebar"
import { useSubCategorySidebar } from "../layout/sidebar/subcategory-sidebar"
import { useAutoResizeTextarea } from "../../hooks/use-auto-resize-textarea"
import { ChatInput } from "./chat-input"
import { useQueryClient } from "@tanstack/react-query"
import type { Message } from "../../types/chat"
import { cn, lt } from "../../lib/utils"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { authClient } from "@/lib/auth/auth-client"
import { db } from "@/lib/db"
import { chats as chatsTable } from "@/lib/db/schema"
import { toast } from "sonner"
import { useAIModelStore } from "../../store/ai-model-store"
import { useChatInputStore } from "../../store/chat-store"
import { googleGenAIService } from "../../lib/services/google-genai-service"


// Update the ChatState interface to match the one in chat-input.tsx
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

interface AiInputProps {
  onInputChange?: (value: string) => void;
  onSubmit?: () => void;
}

// Define the ref type for external value updates
export interface AiInputRef {
  setValue: (value: string) => void;
}

const MIN_HEIGHT = 48
const MAX_HEIGHT = 164

export const AiInput = forwardRef<AiInputRef, AiInputProps>(function AiInput(
  { onInputChange, onSubmit },
  ref
) {
  const queryClient = useQueryClient()
  const { statecategorysidebar } = useCategorySidebar()
  const { statesubcategorysidebar } = useSubCategorySidebar()
  const router = useRouter()
  const { currentModel, setModel } = useAIModelStore()

  // Better Auth user state management
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Use Zustand stores instead of local state
  const {
    showSearch,
    showResearch,
    showThinking,
    value,
    imagePreview,
    setValue,
    setImagePreview
  } = useChatInputStore()
  const [isMaxHeight, setIsMaxHeight] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const sessionData = await authClient.getSession()
        setUser(sessionData?.data)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserData()
  }, [])

  // Expose the setValue method through ref
  useImperativeHandle(ref, () => ({
    setValue: (newValue: string) => {
      setValue(newValue);
      // When value is set externally, make sure to update height
      setTimeout(() => {
        handleAdjustHeight();
      }, 0);
    }
  }));
  const handleLogin = async () => {
    try {
      setIsLoggingIn(true)
      // Redirect to Better Auth sign-in page
      router.push("/sign-in")
    } catch (error) {
      console.error("Error redirecting to login:", error)
      toast.error("Failed to redirect to login page")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  })

  // Add new state to track input height
  const [inputHeight, setInputHeight] = useState(MIN_HEIGHT)

  // Update handleAdjustHeight to track current input height
  const handleAdjustHeight = useCallback((reset = false) => {
    if (!textareaRef.current) return

    if (reset) {
      textareaRef.current.style.height = `${MIN_HEIGHT}px`
      setInputHeight(MIN_HEIGHT)
      return
    }

    const scrollHeight = textareaRef.current.scrollHeight
    const newHeight = Math.min(scrollHeight, MAX_HEIGHT)
    textareaRef.current.style.height = `${newHeight}px`;
    setInputHeight(newHeight)
  }, [textareaRef])

  // Remove local state - now handled by Zustand stores
  // const [showSearch, setShowSearch] = useState(false)
  // const [showResearch, setShowReSearch] = useState(false)
  // const [showThinking, setShowThinking] = useState(false)
  // const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Add chat state management
  const [chatState, setChatState] = useState<ChatState>({
    messages: [], // Ensure this is always an array
    isLoading: false,
    error: null,
  })

  // Debounce input changes to avoid too many updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onInputChange) {
        onInputChange(value);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onInputChange]);
  // Update setValue function to be simpler since we debounce above
  const handleValueChange = (newValue: string) => {
    setValue(newValue); // This now uses Zustand's setValue
  };
  // Add URL analysis handler
  const handleUrlAnalysis = (urls: string[], prompt: string) => {
    if (!user || !user.user) {
      toast.error("Authentication required", {
        description: "Please sign in to analyze URLs",
        action: {
          label: isLoggingIn ? "Signing in..." : "Sign In",
          onClick: handleLogin,
        },
        duration: 5000,
      });
      return;
    }

    // Combine URLs and prompt
    const fullPrompt = `${prompt}: ${urls.join(", ")}`;
    handleValueChange(fullPrompt);

    // Auto-submit if desired
    // handleSubmit();
  }

  const handleSubmit = async () => {
    if (!value.trim() || chatState.isLoading) return;

    // Notify parent component about submission
    if (onSubmit) {
      onSubmit();
    }    // Check if user is authenticated
    if (!user || !user.user) {
      toast.error("Authentication required", {
        description: "Please sign in to chat with Friday AI",
        action: {
          label: isLoggingIn ? "Signing in..." : "Sign In",
          onClick: handleLogin,
        },
        duration: 5000, // Show for 5 seconds
      });
      return;
    }

    try {
      const chatId = uuidv4()
      const trimmedValue = value.trim()

      // Create initial message
      const initialMessage = {
        id: uuidv4(),
        content: trimmedValue,
        role: "user",
        timestamp: new Date().toISOString()
      }      // Create initial chat data matching Drizzle schema
      const chatData = {
        id: chatId,
        title: trimmedValue.slice(0, 50) + (trimmedValue.length > 50 ? "..." : ""),
        messages: JSON.stringify([initialMessage]), // JSON string for Drizzle
        model: currentModel,
        visibility: "public" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creatorUid: user.user.id, // Use Better Auth user ID
        reactions: JSON.stringify({ // JSON string for Drizzle
          likes: {},
          dislikes: {}
        }),
        participants: JSON.stringify([user.user.id]), // JSON string for Drizzle
        views: 0,
        uniqueViewers: JSON.stringify([]), // JSON string for Drizzle
        isPinned: false
      }

      // Store chat data in Drizzle/Turso database
      await db.insert(chatsTable).values(chatData)
      sessionStorage.setItem("initialPrompt", trimmedValue)
      sessionStorage.setItem("selectedAI", currentModel)
      sessionStorage.setItem("chatId", chatId)
      sessionStorage.setItem("autoSubmit", "true")

      // Navigate to the new chat page
      router.push(`/chat/${chatId}`)
    } catch (error) {
      console.error("Error:", error)
      setChatState(prev => ({
        ...prev,
        error: "Failed to create chat"
      }))
      toast.error("Failed to create chat", {
        description: "Please try again later"
      });
    }
  }

  // Add AI generation function using Google GenAI service  
  const generateAIResponse = async (prompt: string, messages: any[] = []) => {
    try {
      setChatState(prev => ({ ...prev, isLoading: true }));

      // Convert messages to Google GenAI format
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.content }]
      }));

      // const formattedMessages = messages.map((msg) => ({
      //   role: msg.role === 'user' ? 'user' : 'model',
      //   parts: [{ text: msg.content }]
      // }));
      // Add current prompt
      formattedMessages.push({
        role: 'user',
        parts: [{ text: prompt }]
      });      // Use Google GenAI service for streaming response

      const response = await googleGenAIService.generateContentStream(
        currentModel,
        formattedMessages
      );

      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      setChatState(prev => ({
        ...prev,
        error: 'Failed to generate AI response. Please try again.',
        isLoading: false
      }));
      throw error;
    } finally {
      setChatState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Export the AI generation function for use by parent components
  const handleAIGenerate = async (prompt: string, messages: any[] = []) => {
    return await generateAIResponse(prompt, messages);
  };

  return (
    <div className={cn(
      "relative flex w-full flex-col items-center justify-center transition-[left,right,width,margin-right] duration-200 ease-linear",
    )}>
      <ChatInput
        value={value}
        chatState={chatState}
        setChatState={setChatState}
        imagePreview={imagePreview}
        inputHeight={inputHeight}
        textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
        onSubmit={handleSubmit}
        onChange={handleValueChange}
        onHeightChange={handleAdjustHeight}
        onUrlAnalysis={handleUrlAnalysis}
        onAIGenerate={handleAIGenerate}
        onImageChange={(file) =>
          file ? setImagePreview(URL.createObjectURL(file)) : setImagePreview(null)
        }
      />
    </div>
  )
})

export default AiInput;
