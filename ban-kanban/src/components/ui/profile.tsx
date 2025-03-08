export function UserProfileImage({
    full_name,
    bgColor,
    size
} : {
    full_name: string;
    bgColor: string;
    size: number;
}) {
    const names = full_name.split(" ").slice(0, 2);
    const initials = names.map((name) => name[0].toUpperCase());
    // Component to display user profile image with initials
    return (
        <div 
            className={`flex items-center justify-center rounded-full text-white`}
            style={{ backgroundColor: bgColor, width: size, height: size}}
        >
            <span 
                className="font-semibold"
                style={{ fontSize: size / 5 * 2 }}
            >{initials}</span>
        </div>
    );
}