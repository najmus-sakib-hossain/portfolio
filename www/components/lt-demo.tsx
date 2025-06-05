"use client";

import { lt } from "@/lib/utils";
import { useEffect, useState } from "react";

export function LtDemo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      <h3 className="font-semibold">lt() Function Demo</h3>
      <div className="space-y-2 text-sm">
        <div>
          <code className="bg-muted px-2 py-1 rounded">lt("friday.title")</code>
          <p className="mt-1">→ {lt("friday.title")}</p>
        </div>
        <div>
          <code className="bg-muted px-2 py-1 rounded">lt("navigation.home")</code>
          <p className="mt-1">→ {lt("navigation.home")}</p>
        </div>
        <div>
          <code className="bg-muted px-2 py-1 rounded">lt("friday.welcome")</code>
          <p className="mt-1">→ {lt("friday.welcome")}</p>
        </div>
        <div>
          <code className="bg-muted px-2 py-1 rounded">lt("navigation.settings")</code>
          <p className="mt-1">→ {lt("navigation.settings")}</p>
        </div>
        <div className="mt-4 p-2 bg-muted/50 rounded text-xs">
          <div>Current locale: {typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'unknown'}</div>
        </div>
      </div>
    </div>
  );
}
