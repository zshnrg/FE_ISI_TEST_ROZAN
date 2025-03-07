import { useEffect, useState } from "react";

export const useLoadedState = (dependency: unknown) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, [dependency]);

    return isLoaded;
};
