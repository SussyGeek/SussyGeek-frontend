import { getMe } from "@/api/services/userService";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type UserContextType = {
    username: string | null;
    isContributing: boolean;
    isReady: boolean;
    refreshAuth: () => Promise<void> | void;
};

const UserContext = createContext<UserContextType>({
    username: null,
    isContributing: false,
    isReady: false,
    refreshAuth: () => undefined
});

export const UserProvider = (
    { children }: { children: ReactNode }
) => {
    const [username, setUsername] = useState<string | null>(null);
    const [isContributing, setIsContributing] = useState<boolean>(false);
    const [isReady, setIsReady] = useState<boolean>(false);

    const resolveAuth = async () => {
        const user = await getMe();
        setUsername(user?.username ?? null);
        setIsContributing(user?.isActive ?? false);
        setIsReady(true);
    }

    useEffect(() => {
        if (!isReady) resolveAuth();
    }, [isReady]);

    return (
        <UserContext.Provider value={{
            username,
            isContributing,
            isReady,
            refreshAuth: resolveAuth
        }}>
            {children}
        </UserContext.Provider>
    )
};

export function useAuth() {
    const context = useContext(UserContext);
    if (!context)
        throw new Error("useAuth hook must be used within context provider");
    return context;
};