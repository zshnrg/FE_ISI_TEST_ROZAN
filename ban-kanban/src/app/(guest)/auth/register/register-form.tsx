'use client'

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Button } from "@/components/ui/buttton";

import { register } from "@/lib/actions/auth";
import { RegisterFormState } from "@/lib/definitions/auth";

export default function RegisterForm() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    // Store form data in state
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [state, action, pending] = useActionState<RegisterFormState, FormData>(async (prevState: RegisterFormState, formData: FormData) => {
        return await register(prevState, formData);
    }, undefined);

    const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <form 
            className="flex flex-col gap-6" 
            action={action} // Calls action inside a transition
        >
            <div className="flex flex-col gap-4">
                <div>
                    <Input
                        type="text"
                        id="full_name"
                        name="full_name"
                        placeholder="Full Name"
                        maxLength={50}
                        value={formData.full_name}
                        onChange={HandleChange}
                        required
                    />
                    {state?.errors?.full_name && <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.full_name}</p>}
                </div>
                <div>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        maxLength={255}
                        value={formData.email}
                        onChange={HandleChange}
                        required
                    />
                    {state?.errors?.email && <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.email}</p>}
                </div>
                <div>
                    <Input
                        type={isVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Password"
                        leadingIcon={isVisible ? <LuEyeClosed /> : <LuEye />}
                        onLeadingIconClick={() => setIsVisible(!isVisible)}
                        maxLength={255}
                        required
                    />
                    {state?.errors?.password && (
                        <div className="ml-4 mt-2 text-red-500 text-sm">
                            <p>Password must:</p>
                            <ul>
                                {state.errors.password.map((error: string, index: number) => (
                                    <li key={index}>- {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    <Input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        placeholder="Confirm Password"
                        maxLength={255}
                        required
                    />
                    {state?.errors?.confirm_password && <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.confirm_password}</p>}
                </div>
            </div>
            <div className="flex gap-4">
                <Button className="shrink-0" type="button" buttonType="secondary" onClick={() => router.push('/auth/login')}>
                    Back
                </Button>
                <Button disabled={pending} className="w-full" type="submit" buttonType="primary">
                    Register
                </Button>
            </div>
        </form>
    );
}
