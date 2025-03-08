'use client'

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Button } from "@/components/ui/buttton"
;
import { login } from "@/lib/actions/auth";
import { LoginFormState } from "@/lib/definitions/auth";

export default function Login() {

    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [state, action, pending] = useActionState<LoginFormState, FormData>(async (prevState: LoginFormState, formData: FormData) => {
        return await login(prevState, formData);
    }, undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <form 
            className="flex flex-col gap-12"
            action={action}
        >
            <div className="flex flex-col gap-4">
                <div>
                    <Input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Email"
                        onChange={handleChange}
                    />
                    {state?.errors?.email && <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.email}</p>}
                </div>
                <div>
                    <Input 
                        type={ isVisible ? "text" : "password" }
                        id="password"
                        name="password"
                        placeholder="Password"
                        leadingIcon={ isVisible ? <LuEyeClosed /> : <LuEye /> } 
                        onLeadingIconClick={() => setIsVisible(!isVisible)}
                        onChange={handleChange}
                    />
                    {state?.errors?.password && <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.password}</p>}
                </div>
                {state?.message && <p className="ml-4 mt-2 text-red-500 text-sm">{state.message}</p>}
            </div>
            <div className="flex gap-4">
                <Button 
                    className="shrink-0"
                    type="button" 
                    buttonType="secondary" 
                    onClick={() => router.push('/auth/register')}
                >
                    Register
                </Button>
                <Button 
                    disabled={pending}
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