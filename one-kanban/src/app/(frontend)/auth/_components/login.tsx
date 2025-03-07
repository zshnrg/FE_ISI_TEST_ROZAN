'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Button } from "@/components/ui/buttton";

export default function Login() {

    const [ isVisible, setIsVisible ] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submit');
    }

    return (
        <form 
            className="flex flex-col gap-12"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-4">
                <Input type="email" id="email" name="email" placeholder="Email" />
                <Input 
                    type={ isVisible ? "text" : "password" }
                    id="password"
                    name="password"
                    placeholder="Password"
                    leadingIcon={ isVisible ? <LuEyeClosed /> : <LuEye /> } 
                    onLeadingIconClick={() => setIsVisible(!isVisible)}
                />
            </div>
            <div className="flex gap-4">
                <Button 
                    className="shrink-0"
                    type="button" 
                    buttonType="secondary" 
                    onClick={() => router.push('/auth#register')}
                >
                    Register
                </Button>
                <Button 
                    className="w-full"
                    type="submit" 
                    buttonType="primary"
                >
                    Login
                </Button>
            </div>
        </form>
    )
}