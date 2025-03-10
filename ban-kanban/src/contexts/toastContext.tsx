'use client'

import { createContext, useContext, useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"

import { MdCheckCircleOutline, MdOutlineCancel, MdOutlineInfo } from "react-icons/md"

interface Toast {
    message: string;
    type?: "success" | "error" | "warning";
    timeout?: number;
}

interface ToastContextType {
    toasts: Toast[];
    toast: (message: string, type: "success" | "error" | "warning") => void;
    remove: (id: number) => void;
}
const toastIcons = {
    success: <MdCheckCircleOutline size={20} className="text-green-500" />,
    error: <MdOutlineCancel size={20} className="text-red-500" />,
    warning: <MdOutlineInfo size={20} className="text-yellow-500" />
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children } : { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = useCallback((message: string, type: "success" | "error" | "warning", timeOut: number = 3000) => {
        setToasts((prevToasts) => [
            ...prevToasts,
            { message, type }
        ])

        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((_, index) => index !== prevToasts.length - 1))
        }, timeOut)
    }, [])

    const remove = useCallback((id: number) => {
        setToasts((prevToasts) => prevToasts.filter((_, index) => index !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, toast, remove }}>
            {children}
            <div className="fixed z-50 inset-0 flex flex-col items-center p-4 space-y-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.2 }}
                            className={`flex gap-2 items-center py-3 px-4 rounded-lg shadow-md pointer-events-auto bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100`}
                        >
                            {toast.type && toastIcons[toast.type]}
                            {toast.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }

    return context
}