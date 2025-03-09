const buttonTypes = {
    primary: 'bg-indigo-900 text-neutral-50 hover:bg-indigo-800 dark:bg-indigo-800 dark:text-neutral-50 dark:hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-400 disabled:cursor-not-allowed',
    secondary: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600 disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400 disabled:cursor-not-allowed',
};

export function Button({
    children,
    onClick,
    className,
    buttonType = 'primary',
    ...props
}: Readonly<{
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    buttonType: 'primary' | 'secondary';
    [key: string]: unknown;
}>) {

    return (
        <button
            onClick={onClick}
            className={` ${className} ${buttonTypes[buttonType]} py-4 px-6 text-md rounded-full transition-colors cursor-pointer`}
            {...props}
        >
            {children}
        </button>
    );
}