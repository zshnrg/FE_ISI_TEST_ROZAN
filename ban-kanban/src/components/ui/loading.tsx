export function Loading() {
    return (
        <div className="flex items-center justify-center h-2 gap-2">
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-[bounce_800ms_100ms_infinite]"></div>
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-[bounce_800ms_200ms_infinite]"></div>
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-[bounce_800ms_300ms_infinite]"></div>
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-[bounce_800ms_400ms_infinite]"></div>
        </div>
    );
}