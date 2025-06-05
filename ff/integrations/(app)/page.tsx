// "use client"

// import * as React from "react"
// import AiInput from '@/components/ai-input'
// import Friday from "@/components/friday/friday"
// import { useAuth } from "@/contexts/auth-context"
// import PersonaSelector from "@/components/persona-suggestion"
// import SearchSuggestions from "@/components/search-suggestions"
// import Chat from "@/components/chat"
// import RainbowMeshAnimation from '@/components/RainbowMeshAnimation';
// import MeshGenerator from '@/components/MeshGenerator';

// export default function Home() {
//   const { user } = useAuth()
//   const userName = user?.displayName || "friend"

//   // Using useState and useEffect to ensure client-side only rendering of time-based content
//   const [greeting, setGreeting] = React.useState("")
//   // Add state to track if input has been submitted
//   const [hasSubmitted, setHasSubmitted] = React.useState(false)
//   // Keep track of current input for search suggestions
//   const [currentInput, setCurrentInput] = React.useState("")

//   // Reference to the AiInput component
//   const aiInputRef = React.useRef<{ setValue: (value: string) => void } | null>(null)

//   React.useEffect(() => {
//     const hour = new Date().getHours()

//     if (hour >= 5 && hour < 12) {
//       setGreeting("Good morning")
//     } else if (hour >= 12 && hour < 18) {
//       setGreeting("Good afternoon")
//     } else {
//       setGreeting("Good evening")
//     }
//   }, [])

//   // Reset hasSubmitted when input is cleared
//   React.useEffect(() => {
//     if (!currentInput.trim()) {
//       setHasSubmitted(false);
//     }
//   }, [currentInput]);

//   // Handle suggestion selection
//   const handleSuggestionSelect = (suggestion: string) => {
//     // Update the input with the suggestion
//     if (aiInputRef.current) {
//       aiInputRef.current.setValue(suggestion);
//     }
//   };

//   return (
//     <div className="flex h-svh w-full flex-col items-center justify-center gap-4 py-4 pt-16">
//       <h1 className="bold w-full text-center font-sans text-3xl">
//         {greeting && `${greeting}, ${userName}.`}
//       </h1>
//       {/* <div className="w-full max-w-lg p-4">
//         <MeshGenerator />
//       </div> */}

//     </div>
//   )
// }

"use client";

import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";
// import { QuickCustomizer } from "@/components/theme/quick-customizer";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [betterauth, setBetterAuth] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await authClient.getSession();
      setUser(session?.data);
    };
    const fetchBetterAuth = async () => {
      const data = await authClient.listAccounts();
      setBetterAuth(data);
    };
    fetchSession();
    fetchBetterAuth();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center flex-col gap-4 p-4">
      Hello
      <div className="flex flex-col gap-4 w-full max-w-md">
        {user ? (
          <>
            {user.user.image && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto">
                <Image
                  src={user.user.image}
                  alt="Profile image"
                  layout="fill"
                  objectFit="cover"
                  unoptimized
                />
              </div>
            )}
            <h2 className="text-xl font-bold text-center">User Information</h2>
            <div className="grid gap-2">
              <span>
                <strong>Image:</strong> {user.user.image || "Not available"}
              </span>
              <span>
                <strong>Name:</strong> {user.user.name || "Not available"}
              </span>
              <span>
                <strong>Email:</strong> {user.user.email || "No email"}
              </span>
              <span>
                <strong>Email Verified:</strong>{" "}
                {user.user.emailVerified ? "Yes" : "No"}
              </span>
              <span>
                <strong>Is Anonymous:</strong>{" "}
                {user.user.isAnonymous ? "Yes" : "No"}
              </span>
              <span>
                <strong>User ID:</strong> {user.user.id || "Not available"}
              </span>
              <span>
                <strong>Account Created:</strong>{" "}
                {new Date(user.user.createdAt).toLocaleString() || "Not available"}
              </span>
              <span>
                <strong>Account Updated:</strong>{" "}
                {new Date(user.user.updatedAt).toLocaleString() || "Not available"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-center mt-4">
              Session Information
            </h2>
            <div className="grid gap-2">
              <span>
                <strong>Session ID:</strong> {user.session.id || "Not available"}
              </span>
              <span>
                <strong>Token:</strong> {user.session.token || "Not available"}
              </span>
              <span>
                <strong>Session Created:</strong>{" "}
                {new Date(user.session.createdAt).toLocaleString() ||
                  "Not available"}
              </span>
              <span>
                <strong>Session Updated:</strong>{" "}
                {new Date(user.session.updatedAt).toLocaleString() ||
                  "Not available"}
              </span>
              <span>
                <strong>Expires At:</strong>{" "}
                {new Date(user.session.expiresAt).toLocaleString() ||
                  "Not available"}
              </span>
              <span>
                <strong>IP Address:</strong>{" "}
                {user.session.ipAddress || "Not available"}
              </span>
              <span>
                <strong>User Agent:</strong>{" "}
                {user.session.userAgent || "Not available"}
              </span>
            </div>
            {betterauth && betterauth.data && betterauth.data.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-center mt-4">
                  Account Information
                </h2>
                {betterauth.data.map((account: any, index: number) => (
                  <div key={account.id} className="grid gap-2 mt-2">
                    <h3 className="text-lg font-semibold">
                      Account {index + 1}
                    </h3>
                    <span>
                      <strong>Account ID:</strong> {account.id || "Not available"}
                    </span>
                    <span>
                      <strong>Provider:</strong>{" "}
                      {account.provider || "Not available"}
                    </span>
                    <span>
                      <strong>Created At:</strong>{" "}
                      {new Date(account.createdAt).toLocaleString() ||
                        "Not available"}
                    </span>
                    <span>
                      <strong>Updated At:</strong>{" "}
                      {new Date(account.updatedAt).toLocaleString() ||
                        "Not available"}
                    </span>
                    <span>
                      <strong>Linked Account ID:</strong>{" "}
                      {account.accountId || "Not available"}
                    </span>
                    <span>
                      <strong>Scopes:</strong>{" "}
                      {account.scopes.length > 0
                        ? account.scopes.join(", ")
                        : "None"}
                    </span>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <div className="text-center">
            <span className="text-lg">Not logged in</span>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <Button
          onClick={async () => {
            const data = await authClient.listAccounts();
            setBetterAuth(data);
            toast.info("Accounts refreshed");
          }}
        >
          List Accounts
        </Button>
        <Button
          onClick={async () => {
            const session = await authClient.getSession();
            setUser(session?.data);
            toast.info("Session refreshed");
          }}
        >
          Refresh Session
        </Button>
        <Button
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  console.log("SignOut Successfully");
                  toast.info("Signed out");
                  setUser(null);
                },
              },
            });
          }}
        >
          Sign Out
        </Button>
      </div>
      <SignUp />
      <SignIn />
    </div>
  );
}