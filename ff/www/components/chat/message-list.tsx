import React, { useLayoutEffect, useRef, useState, useCallback, useEffect } from "react";
import { Message } from "../../types/chat";
import { ChatMessage } from "./chat-message";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useChatInputStore } from "../../store/chat-store";

interface MessageListProps {
  chatId: string | null;
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isThinking?: boolean;
  selectedAI?: string;
}

export function MessageList({
  chatId,
  messages,
  messagesEndRef,
  isThinking = false,
  selectedAI = "",
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>(messages);
  const [localShowThinking, setLocalShowThinking] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const previousScrollHeight = useRef<number>(0); // Track the previous scroll height
  
  // Access global thinking state from Zustand
  const { showThinking, setShowThinking } = useChatInputStore();

  // Improve the scrollToBottom function to ensure it scrolls all the way
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      // Use a larger value to ensure we go past the bottom
      containerRef.current.scrollTop = containerRef.current.scrollHeight + 2000;
      setShowScrollButton(false);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!nearBottom);
    }
  }, []);

  // Synchronize local state with prop and global state
  useEffect(() => {
    console.log("isThinking prop changed:", isThinking);
    console.log("Global showThinking state:", showThinking);
    
    // Use either the prop or global state (prioritize the prop if provided)
    const shouldShowThinking = isThinking || showThinking;
    
    if (shouldShowThinking) {
      setLocalShowThinking(true);
      setIsFadingOut(false);
      
      const lastMessage = messages[messages.length - 1];
      const needsThinkingIndicator = lastMessage && lastMessage.role === "user";
      
      if (needsThinkingIndicator) {
        setVisibleMessages([
          ...messages,
          {
            id: "thinking-placeholder",
            content: "thinking",
            role: "assistant",
            timestamp: Date.now().toString(),
          },
        ]);
      } else {
        setVisibleMessages([...messages]);
      }
    } else if (localShowThinking) {
      // Only trigger fade-out if we were previously showing thinking
      setIsFadingOut(true);
    } else {
      // Make sure visible messages are up to date
      setVisibleMessages([...messages]);
    }
  }, [isThinking, showThinking, messages, localShowThinking]);

  const handleTransitionEnd = useCallback(() => {
    if (isFadingOut) {
      console.log("Fade-out transition ended, removing thinking indicator");
      setLocalShowThinking(false);
      setIsFadingOut(false);
      setVisibleMessages([...messages]);
      
      // Also update the global state
      setShowThinking(false);
    }
  }, [isFadingOut, messages, setShowThinking]);

  // Scroll to bottom when visibleMessages or thinking state changes
  useLayoutEffect(() => {
    scrollToBottom();
  }, [visibleMessages, localShowThinking, scrollToBottom]);

  // Enhance the ResizeObserver to better handle image loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create a more responsive observer
    const observer = new ResizeObserver(() => {
      if (container) {
        const currentScrollHeight = container.scrollHeight;
        
        // Force scroll to bottom whenever height changes significantly
        if (currentScrollHeight > previousScrollHeight.current + 10) { // 10px threshold for meaningful changes
          console.log(`Height change detected: ${previousScrollHeight.current} → ${currentScrollHeight}`);
          
          // Use setTimeout to ensure the scroll happens after the render is complete
          setTimeout(() => {
            scrollToBottom();
            // Scroll again after a small delay to handle any additional rendering
            setTimeout(scrollToBottom, 100);
          }, 50);
        }
        previousScrollHeight.current = currentScrollHeight;
      }
    });

    observer.observe(container);

    // Initialize the previous scroll height
    previousScrollHeight.current = container.scrollHeight;

    return () => {
      observer.disconnect();
    };
  }, [scrollToBottom]);

  // Enhance the image load handler to be more robust
  useEffect(() => {
    // Create a more aggressive scroll function specifically for images
    const forceScrollToBottom = () => {
      if (containerRef.current) {
        // Force multiple scrolls with increasing delays to catch all layout changes
        containerRef.current.scrollTop = containerRef.current.scrollHeight + 5000;
        
        // Schedule multiple scrolls with increasing delays
        setTimeout(() => {
          if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight + 5000;
        }, 50);
        
        setTimeout(() => {
          if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight + 5000;
        }, 150);
        
        setTimeout(() => {
          if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight + 5000;
        }, 300);
        
        // Final scroll after AspectRatio and all possible layout calculations
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight + 5000;
            setShowScrollButton(false);
          }
        }, 500);
      }
    };

    // Enhanced image load handler
    const handleImageLoad = () => {
      console.log("Image loaded, force scrolling to bottom");
      forceScrollToBottom();
    };

    // Setup more comprehensive image load handling
    const setupImageLoadListeners = () => {
      if (containerRef.current) {
        // Select all images, including those inside AspectRatio components
        const images = containerRef.current.querySelectorAll("img");
        
        // Log how many images we"re tracking
        console.log(`Setting up load listeners for ${images.length} images`);
        
        images.forEach(img => {
          // For already loaded images, we still want to scroll
          if (img.complete) {
            console.log("Found complete image, scheduling scroll");
            setTimeout(forceScrollToBottom, 100);
          } else {
            // For images still loading, add the event listener
            img.addEventListener("load", handleImageLoad);
            console.log("Added load listener to image:", img.src);
          }
          
          // Also listen for error events to ensure we still scroll if an image fails
          img.addEventListener("error", handleImageLoad);
        });
      }
    };

    // Run initially and also set a timeout to catch any delayed image insertions
    setupImageLoadListeners();
    setTimeout(setupImageLoadListeners, 300);
    
    const currentContainer = containerRef.current;
    // Clean up function
    return () => {
      if (currentContainer) {
        const images = currentContainer.querySelectorAll("img");
        images.forEach(img => {
          img.removeEventListener("load", handleImageLoad);
          img.removeEventListener("error", handleImageLoad);
        });
      }
    };
  }, [messages]); // Keep only messages in the dependency array

  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return;
    ref.addEventListener("scroll", handleScroll);
    return () => ref.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleResize = () => setTimeout(scrollToBottom, 100);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [scrollToBottom]);

  return (
    <div
      ref={containerRef}
      className="message-list-container relative h-full flex-1 overflow-y-auto px-1 pb-32 pt-16 md:pb-14"
      style={{ scrollBehavior: "smooth" }}
    >
      <div className="w-full space-y-4 md:px-4 lg:mx-auto lg:w-[90%] lg:px-0 xl:w-1/2">
        {visibleMessages.map((message, index) => (
          <ChatMessage
            key={`${message.id || index}-${message.timestamp}`}
            message={message}
            chatId={chatId}
            index={index}
            isFadingOut={isFadingOut && message.content === "thinking"}
            onTransitionEnd={message.content === "thinking" ? handleTransitionEnd : undefined}
            selectedAI={selectedAI}
          />
        ))}
        <div ref={messagesEndRef} className="h-20 w-full" />
      </div>
    </div>
  );
}
