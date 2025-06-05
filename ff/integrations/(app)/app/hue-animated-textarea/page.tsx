
"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function HueAnimatedTextarea() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-background">
        <div className="w-full max-w-md space-y-4">
          <header className="text-center">
            <h1 className="text-3xl font-headline font-bold text-foreground">
              Hue Animated Textarea
            </h1>
            <p className="text-muted-foreground font-body">
              Experience a visually engaging textarea with dynamic effects.
            </p>
          </header>

          <div className="space-y-2">
            <Label
              htmlFor="hue-textarea"
              className="text-sm font-medium font-headline text-foreground"
            >
              Your Thoughts Here:
            </Label>
            <div className="glowing-textarea-wrapper rounded-md shadow-sm">
              <Textarea
                id="hue-textarea"
                placeholder="Type something beautiful..."
                className="w-full h-40 text-base font-body resize-none p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label="Hue animated textarea input field"
              />
            </div>
            <p className="text-xs text-muted-foreground font-body text-center pt-1">
              Hover over the textarea to activate the animated gradient glow.
            </p>
          </div>

          <footer className="text-center pt-4">
            <p className="text-xs text-muted-foreground font-body">
              Crafted with Shadcn UI & Tailwind CSS.
            </p>
          </footer>
        </div>
      </main>
      {/* Styles moved to src/app/page.tsx for component co-location, or can be global if this page is directly used */}
      {/* If this page is used independently, its styles should be here or in globals.css */}
      <style jsx global>{`
          /* Styles for Hue Animated Textarea */
          @keyframes rotateHue { /* For the ::before glow */
            0% {
              filter: hue-rotate(0deg) blur(var(--glow-blur));
            }
            100% {
              filter: hue-rotate(360deg) blur(var(--glow-blur));
            }
          }

          @keyframes rotateHueBorder { /* For the textarea border */
            0% {
              filter: hue-rotate(0deg);
            }
            100% {
              filter: hue-rotate(360deg);
            }
          }

          @keyframes white-border-splash {
            0% {
              opacity: 1;
              clip-path: circle(0% at 100% 100%);
            }
            50% {
              opacity: 1;
              clip-path: circle(150% at 100% 100%); /* Expands to cover the whole element */
            }
            100% {
              opacity: 0;
              clip-path: circle(150% at 100% 100%); /* Stays expanded while fading out */
            }
          }

          .glowing-textarea-wrapper {
            position: relative;
            display: block;
            width: 100%;
            --glow-blur: 12px; /* Controls the size of the glow */
          }

          /* Outer Glow */
          .glowing-textarea-wrapper::before {
            content: "";
            position: absolute;
            inset: -4px; /* Sits outside the border area, increased for a slightly thicker border appearance */
            z-index: 0; /* Behind textarea and splash */
            border-radius: calc(var(--radius) + 4px); /* Adjusted to match the new inset */
            background: conic-gradient(
              from 90deg,
              hsl(0, 100%, 65%), hsl(60, 100%, 65%), hsl(120, 100%, 65%),
              hsl(180, 100%, 65%), hsl(240, 100%, 65%), hsl(300, 100%, 65%),
              hsl(0, 100%, 65%)
            );
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            animation: rotateHue 4s linear infinite paused;
            filter: blur(var(--glow-blur));
          }

          /* White Splash Border */
          .glowing-textarea-wrapper::after {
            content: "";
            position: absolute;
            inset: 0; /* Covers the textarea element itself */
            z-index: 2; /* On top of the textarea"s own border, below the glow */
            border-radius: var(--radius); /* Match textarea"s border-radius */
            border: 2px solid white; /* The white splash */
            background: transparent; /* So only the border is visible */
            opacity: 0; /* Animation controls opacity */
            pointer-events: none; /* Allows clicks to pass through to the textarea */
            clip-path: circle(0% at 100% 100%); /* Initial clipped state at bottom-right */
          }

          .glowing-textarea-wrapper:hover::before {
            opacity: 0.7;
            animation-play-state: running;
          }

          .glowing-textarea-wrapper:hover::after {
            animation: white-border-splash 0.5s ease-out forwards;
          }

          .glowing-textarea-wrapper > textarea {
            position: relative;
            z-index: 1; /* Above the glow, below the splash */
            width: 100%;
            border-width: 2px; /* Default border width */
            /* Base styles are applied by Shadcn/Tailwind */
          }

          .glowing-textarea-wrapper:hover > textarea {
            border-color: transparent !important; /* Hide original border for gradient */
            background-image: linear-gradient(hsl(var(--background)), hsl(var(--background))),
                              conic-gradient(
                                from 90deg,
                                hsl(0, 100%, 65%), hsl(60, 100%, 65%), hsl(120, 100%, 65%),
                                hsl(180, 100%, 65%), hsl(240, 100%, 65%), hsl(300, 100%, 65%),
                                hsl(0, 100%, 65%)
                              );
            background-origin: border-box;
            background-clip: padding-box, border-box; /* Gradient only visible in border area */
            animation: rotateHueBorder 4s linear infinite;
          }
        `}</style>
    </>
  );
}

