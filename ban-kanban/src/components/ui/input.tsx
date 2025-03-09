export function Input({
    type,
    id,
    className,
    leadingIcon,
    onLeadingIconClick,
    ...props
}: Readonly<{
    type: string;
    id: string;
    className?: string;
    leadingIcon?: React.ReactNode;
    onLeadingIconClick?: () => void;
    [key: string]: unknown;
}>) {
    return (
        <div className={`py-4 px-6 bg-neutral-100 dark:bg-neutral-700/20 rounded-full has-focus:ring-2 has-focus:ring-indigo-900 has-focus:ring-opacity-50 flex items-center gap-4 ${className}`}>
            <input
                className="focus:outline-none w-full text-md text-neutral-800 dark:text-neutral-200"
                type={type}
                id={id}
                {...props}
            />
            {
                leadingIcon && <button type="button" onClick={onLeadingIconClick} className="text-neutral-800 dark:text-neutral-200">
                    {leadingIcon}
                </button>
            }
        </div>
    );
}

export function TextArea({
    id,
    className,
    ...props
}: Readonly<{
    id: string;
    className?: string;
    [key: string]: unknown;
}>) {
    return (
        <textarea
            className={`py-4 px-6 bg-neutral-100 dark:bg-neutral-700/20 rounded-4xl has-focus:ring-2 has-focus:ring-indigo-900 has-focus:ring-opacity-50 w-full text-md text-neutral-800 dark:text-neutral-200 ${className}`}
            id={id}
            {...props}
        />
    );
}