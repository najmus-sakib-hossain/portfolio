"use client";

import { lt, preloadCurrentLocale } from "@/lib/utils";
import { useEffect, useState } from "react";

export function LtDemo() {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Preload the locale data
    preloadCurrentLocale().then(() => {
      setLoaded(true);
    });
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">lt() Function Demo</h3>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">
        lt() Function Demo {!loaded && "(Loading...)"}{" "}
      </h3>
      <div className="space-y-2 text-sm">
        <div>
          <code className="bg-muted px-2 py-1 rounded">lt("home")</code>
          <p className="mt-1">→ {lt("home")}</p>
        </div>
        <div>
          <code className="bg-muted px-2 py-1 rounded">lt("about")</code>
          <p className="mt-1">→ {lt("about")}</p>
        </div>
        <div>
          <code className="bg-muted px-2 py-1 rounded">lt("headline")</code>
          <p className="mt-1">→ {lt("headline")}</p>
        </div>
        <div>
          <code className="bg-muted px-2 py-1 rounded">lt("now-description")</code>
          <p className="mt-1">→ {lt("now-description")}</p>
        </div>
        <div className="mt-4 p-2 bg-muted/50 rounded text-xs">
          <div>
            Current locale:{" "}
            {typeof window !== "undefined"
              ? window.location.pathname.split("/")[1] || "en"
              : "unknown"}
          </div>
        </div>
      </div>
    </div>
  );
}
