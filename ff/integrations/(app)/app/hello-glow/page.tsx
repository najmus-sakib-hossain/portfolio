
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HelloGlowProps {
  className?: string;
  spanCount?: number;
}

export default function HelloGlow({ className, spanCount = 25 }: HelloGlowProps) {
  return (
    <>
      <motion.div
        className={cn(
          "hello transition-all h-64 w-[90%] mx-auto mt-4",
          className
        )}
        style={{ '--span-count': spanCount } as React.CSSProperties}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {Array.from({ length: spanCount }).map((_, i) => (
          <span
            key={i}
            className={i === 0 ? "start" : i === (spanCount - 1) ? "end" : ""}
            style={{ "--i": i + 1 } as React.CSSProperties}
          />
        ))}
      </motion.div>
      <style jsx global>{`
        .hello {
          position: relative;
          display: grid;
          grid-template-columns: repeat(var(--span-count, 25), 1fr);
          min-height: 25px; /* Default height for the glow area if container has no height */
        }

        .hello span {
          position: relative;
          /* Spans will take full height of their grid row and 1/Nth of container width */
        }

        .hello span::after {
          content: "";
          position: absolute;
          animation: hello-glow 13s linear infinite;
          animation-delay: calc(var(--i)*0.1s);
          background: #48ff00;
          box-shadow: 0 0 5px #48ff00, 0 0 15px #48ff00, 0 0 30px #48ff00;

          top: 0; 
          bottom: 0;
          left: -5px; /* Increased overlap to remove gaps */
          right: -5px; /* Increased overlap to remove gaps */
          filter: blur(5px);
        }

        .hello span.start::after,
        .hello span.end::after {
          border-radius: var(--radius);
        }

        @keyframes hello-glow {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            background: #48ff00;
            box-shadow: 0 0 5px #48ff00, 0 0 15px #48ff00, 0 0 30px #48ff00, 0 0 40px #48ff00;
            filter: hue-rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
