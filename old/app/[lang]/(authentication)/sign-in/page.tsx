import { SignIn } from "@/components/auth/sign-in";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your account",
};

export default function SignInPage() {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <SignIn />
        </div>
    );
}
