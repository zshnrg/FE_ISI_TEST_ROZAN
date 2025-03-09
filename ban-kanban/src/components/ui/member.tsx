import { Member } from "@/lib/types/user"
import { UserProfileImage } from "./profile"
import { MdClose } from "react-icons/md"

export function MemberItem({
    member,
    showRemove,
    onRemove,
} : {
    member: Member
    showRemove: boolean
    onRemove: (userId: string) => void
}) {
    return (
        <div key={member.user_id} className="flex items-center justify-between mx-8">
            <div className="flex items-center gap-4">
                <UserProfileImage full_name={member.user_full_name} size={36} bgColor={member.user_color} />
                <div className="flex flex-col leading-3">
                    <p className="text-md font-semibold text-neutral-900 dark:text-neutral-50">{member.user_full_name}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{member.user_role.charAt(0).toUpperCase() + member.user_role.slice(1)}</p>
                </div>
            </div>
            {
                showRemove && (
                    <button
                        type="button"
                        onClick={() => onRemove(member.user_id)}
                        className="text-red-500"
                    >
                        <MdClose />
                    </button>
                )
            }

        </div>
    )
}