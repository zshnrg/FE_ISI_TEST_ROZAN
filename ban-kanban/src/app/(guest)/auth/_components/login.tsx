'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Button } from "@/components/ui/buttton";

export default function Login() {

    const [ isVisible, setIsVisible ] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState<{ 
        email?: string; 
        password?: string 
    }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.email) {
            setErrors({ ...errors, email: "Email is required" });
        } else {
            delete errors.email;
        }

        if (!formData.password) {
            setErrors({ ...errors, password: "Password is required" });
        } else {
            delete errors.password;
        }

        if (Object.keys(errors).length === 0) {
            console.log(formData);
        }
    }

    return (
        <form 
            className="flex flex-col gap-12"
            onSubmit={handleSubmit}
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
                    {errors.email && <p className="ml-4 mt-2 text-red-500 text-sm">{errors.email}</p>}
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
                    {errors.password && <p className="ml-4 mt-2 text-red-500 text-sm">{errors.password}</p>}
                </div>
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