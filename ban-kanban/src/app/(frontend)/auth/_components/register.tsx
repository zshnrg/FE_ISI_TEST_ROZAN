'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { Button } from "@/components/ui/buttton";

export default function Register() {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    // State untuk menyimpan nilai input
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirm_password: ""
    });

    // State untuk menyimpan error
    const [errors, setErrors] = useState<{ 
        full_name?: string;
        email?: string; 
        password?: string; 
        repeat_password?: string 
    }>({});

    const validate = (name: string, value: string) => {
        const newErrors = { ...errors };

        if (name === "email") {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                newErrors.email = "Email is not valid";
            } else {
                delete newErrors.email;
            }
        }

        if (name === "password") {
            // Length password, upper, lower, number
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value)) {
                newErrors.password = "Password must contain at least 8 characters of uppercase, lowercase, number";
            } else {
                delete newErrors.password;
            }
        }

        if (name === "confirm_password") {
            if (value !== formData.password) {
                newErrors.repeat_password = "Password does not match";
            } else {
                delete newErrors.repeat_password;
            }
        }

        setErrors(newErrors);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        validate(name, value);
    };

    // Handle submit form
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        Object.keys(formData).forEach((key) => validate(key, formData[key as keyof typeof formData]));

        // Check if full name is empty
        if (!formData.full_name) {
            setErrors((prev) => ({ ...prev, full_name: "Full name is required" }));
        } else {
            delete errors.full_name;
        }

        if (Object.keys(errors).length === 0) {
            // Call API register here
        }
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <div>
                    <Input
                        type="text"
                        id="full_name"
                        name="full_name"
                        placeholder="Full Name"
                        value={formData.full_name}
                        onChange={handleChange}
                    />
                    {errors.full_name && <p className="ml-4 mt-2 text-red-500 text-sm">{errors.full_name}</p>}
                </div>
                <div>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <p className="ml-4 mt-2 text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                    <Input
                        type={isVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        leadingIcon={isVisible ? <LuEyeClosed /> : <LuEye />}
                        onLeadingIconClick={() => setIsVisible(!isVisible)}
                        required
                    />
                    {errors.password && <p className="ml-4 mt-2 text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div>
                    <Input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                    />
                    {errors.repeat_password && <p className="ml-4 mt-2 text-red-500 text-sm">{errors.repeat_password}</p>}
                </div>
            </div>
            <div className="flex gap-4">
                <Button className="shrink-0" type="button" buttonType="secondary" onClick={() => router.push('/auth#login')}>
                    Back
                </Button>
                <Button className="w-full" type="submit" buttonType="primary">
                    Register
                </Button>
            </div>
        </form>
    );
}
