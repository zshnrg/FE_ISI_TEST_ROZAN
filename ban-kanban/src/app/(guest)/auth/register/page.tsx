'use client'

import { useSearchParams } from "next/navigation";

import RegisterForm from "./register-form";
import SuccessCode from "./success";

export default function Register() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type")

    return type === "success" ? (
        <SuccessCode />
    ) : (
        <RegisterForm />
    );
}