import { SignUp } from "@/components/auth/sign-up";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create Your Account",
};

export default function SignUpPage() {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <SignUp />
        </div>
    );
}
