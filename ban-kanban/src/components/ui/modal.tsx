import React, { useEffect, useState } from "react";
import useWindowDimensions from "@/hooks/useWindowDimensions";

import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";

const sizes = {
    xs: "w-xs",
    sm: "w-sm",
    md: "w-md",
    lg: "w-lg",
    xl: "w-xl",
    "2xl": "w-2xl",
    "3xl": "w-3xl",
    "4xl": "w-4xl",
    "5xl": "w-5xl",
    "6xl": "w-6xl",
    full: "w-full h-full",
};

const placements = {
    auto: "inset-0 flex items-center justify-center",
    top: "fixed top-0 left-1/2 transform -translate-x-1/2",
    bottom: "fixed bottom-0 left-1/2 transform -translate-x-1/2",
    center: "inset-0 flex items-center justify-center",
    right: "fixed right-0 top-1/2 transform -translate-y-1/2",
    "right-full": "fixed right-0 top-0 h-screen",
    left: "fixed left-0 top-1/2 transform -translate-y-1/2",
    "left-full": "fixed left-0 top-0 h-screen",
};

interface ModalProps {
    title: React.ReactNode | string;
    isOpen: boolean;
    onOpenChange: () => void;
    children: React.ReactNode;
    size?: keyof typeof sizes;
    placement?: keyof typeof placements;
}

export function Modal({ title, isOpen, onOpenChange, children, size = "md", placement = "auto" }: ModalProps) {
    const [position, setPosition] = useState(placement);
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (placement === "auto") {
            setPosition(width > 640 ? "center" : "bottom");
        } else {
            setPosition(placement);
        }
    }, [placement, width]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key={title as string}
                    className="fixed inset-0 bg-black/40 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onOpenChange}
                    style={{ zIndex: 1100 }}
                >
                    <motion.div
                        className={
                            "bg-neutral-50 dark:bg-neutral-900 shadow-lg rounded-2xl p-4 flex flex-col " + sizes[size] + " " + placements[position] + " max-w-full max-h-full"
                        }
                        initial={{
                            opacity: 0,
                            x: placement === "right" ? 50 : placement === "left" ? -50 : 0,
                            y: placement === "bottom" ? 50 : placement === "top" ? -50 : 0
                        }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{
                            opacity: 0,
                            x: placement === "right" ? 50 : placement === "left" ? -50 : 0,
                            y: placement === "bottom" ? 50 : placement === "top" ? -50 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <div className="relative w-full flex items-start justify-between p-1">
                            <h3 className="text-lg font-semibold text-left text-neutral-900 dark:text-neutral-50">{title}</h3>
                            <button onClick={onOpenChange} className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50">
                                <MdClose size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-auto max-h-[80vh] mt-6 w-full p-1">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
