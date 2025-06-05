import { Message } from "../../types/chat";
import { cn } from "../../lib/utils";
import { Sparkles, Play, Pause, Volume2, ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { authClient } from "@/lib/auth/auth-client";
import React, { useState, useEffect, useRef, memo } from "react";
import AiMessage from "./ai-message-actions";
import UserMessage from "./user-message-actions";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MarkdownPreview } from "./markdown-preview";
import AnimatedGradientText from "../ui/animated-gradient-text";
import ImageGen from "../image";
import { ReasoningPreview } from "./reasoning-preview";

interface ChatMessageProps {
  message: Message;
  chatId: string | null;
  index: number;
  className?: string;
  isFadingOut?: boolean;
  onTransitionEnd?: () => void;
  selectedAI?: string;
}

export const ChatMessage = memo(
  ({
    message,
    chatId,
    index,
    className,
    isFadingOut,
    onTransitionEnd,
    selectedAI = "",
  }: ChatMessageProps) => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const isAssistant = message.role === "assistant";
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const contentHash = useRef<string>("");

    const userImage = user?.image;
    const userName = user?.name;
    const userEmail = user?.email;
    const fallbackInitial = userName?.[0] || userEmail?.[0]?.toUpperCase() || "U";

    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    const isImageGenerationMessage =
      message.model_used === "gemini-2.0-flash-exp-image-generation" ||
      (message.image_urls && message.image_urls.length > 0);

    // Helper function to check if content has reasoning structure
    const hasReasoningStructure = (content: string): boolean => {
      // Look for common section headers that might indicate the answer part
      const answerPatterns = [
        /#{1,6}\s*Answer:?/i,
        /^\s*Answer:?/im,
        /#{1,6}\s*Conclusion:?/i,
        /^\s*Conclusion:?/im,
        /#{1,6}\s*Final Answer:?/i,
        /^\s*Final Answer:?/im,
      ];
      
      // Check if any of the answer patterns are found in the content
      return answerPatterns.some(pattern => pattern.test(content));
    };

    // Check both model type and content structure
    const isReasoningMessage =
      message.model_used === "gemini-2.5-pro-exp-03-25" ||
      message.model_used === "gemini-2.0-flash-thinking-exp-01-21" ||
      hasReasoningStructure(message.content);

    const handleWordIndexUpdate = (index: number) => {
      setCurrentWordIndex(index);
    };

    const handlePlayStateChange = (playing: boolean, audioElement: HTMLAudioElement | null = null) => {
      setIsPlaying(playing);
      if (audioElement) {
        setAudio(audioElement);
        audioRef.current = audioElement;

        if (playing) {
          setIsPopoverOpen(false);
          if (audioElement) {
            audioElement.ontimeupdate = () => {
              if (audioElement.duration) {
                setProgress(audioElement.currentTime / audioElement.duration);
              }
            };
            audioElement.onended = () => {
              setIsPlaying(false);
              setProgress(0);
            };
          }
        }
      }
    };

    const handlePlayPauseClick = () => {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    };

    useEffect(() => {
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }, []);

    return (
      <div className={cn("flex w-full", isAssistant ? "justify-start" : "justify-end", className)}>
        {!isAssistant && (
          <div className="flex w-full flex-row items-start justify-end gap-2">
            <div className="hover:bg-primary-foreground hover:text-primary relative flex items-center justify-center rounded-xl rounded-tr-none border p-2 font-mono text-sm">
              <MarkdownPreview content={message.content} currentWordIndex={currentWordIndex} />
            </div>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger>
                <Avatar className="size-9">
                  <AvatarImage src={userImage ?? undefined} alt={userName || userEmail || "User"} />
                  <AvatarFallback>{fallbackInitial}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent align="end" className="size-min w-min border-none p-0 shadow-none">
                <UserMessage
                  content={message.content}
                  reactions={message.reactions}
                  onWordIndexUpdate={handleWordIndexUpdate}
                  onPlayStateChange={handlePlayStateChange}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        {isAssistant && (
          <div className="flex w-full flex-col items-start">
            <div
              className={cn(
                "hover:text-primary relative flex w-full items-center font-mono text-sm",
                isFadingOut && "fade-out" // Apply fade-out class conditionally
              )}
              onTransitionEnd={onTransitionEnd} // Ensure this fires when animation completes
            >
              {message.content === "thinking" ? (
                <div className="thinking-content">
                  <AnimatedGradientText text="AI is thinking..." />
                </div>
              ) : isImageGenerationMessage ? (
                <div className="min-w-full">
                  <ImageGen message={message} />
                </div>
              ) : isReasoningMessage ?
                (
                  <ReasoningPreview content={message.content} currentWordIndex={currentWordIndex} />
                )
                : (
                  <MarkdownPreview content={message.content} currentWordIndex={currentWordIndex} />
                )}
            </div>
            <AiMessage
              content={message.content}
              reactions={message.reactions}
              onWordIndexUpdate={handleWordIndexUpdate}
              onPlayStateChange={handlePlayStateChange}
            />
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: re-render only if meaningful props change
    return (
      prevProps.message === nextProps.message &&
      prevProps.chatId === nextProps.chatId &&
      prevProps.index === nextProps.index &&
      prevProps.isFadingOut === nextProps.isFadingOut &&
      prevProps.selectedAI === nextProps.selectedAI
    );
  }
);

// Add display name to resolve the ESLint error
ChatMessage.displayName = "ChatMessage";
