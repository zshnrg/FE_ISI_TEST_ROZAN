export function Input({
    type,
    id,
    leadingIcon,
    onLeadingIconClick,
    ...props
}: Readonly<{
    type: string;
    id: string;
    leadingIcon?: React.ReactNode;
    onLeadingIconClick?: () => void;
    [key: string]: unknown;
}>) {
    return (
        <div className="py-4 px-6 bg-neutral-100 dark:bg-neutral-700/20 rounded-full has-focus:ring-2 has-focus:ring-indigo-900 has-focus:ring-opacity-50 flex items-center gap-4">
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