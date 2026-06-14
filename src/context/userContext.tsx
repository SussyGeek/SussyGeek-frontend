import { getMe } from "@/api/services/userService";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type UserContextType = {
    username: string | null;
    isContributing: boolean;
    isReady: boolean;
    refreshAuth: () => Promise<void> | void;
    markContributingActive: () => void;
    markContributingInactive: () => void;
};

const UserContext = createContext<UserContextType>({
    username: null,
    isContributing: false,
    isReady: false,
    refreshAuth: () => undefined,
    markContributingActive: () => { },
    markContributingInactive: () => { }
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

    const markContributingActive = () => {
        if (username && isReady)
            setIsContributing(true);
    }

    const markContributingInactive = () => {
        if (username && isReady)
            setIsContributing(false);
    }

    useEffect(() => {
        if (!isReady) resolveAuth();
    }, [isReady]);



    return (
        <UserContext.Provider value={{
            username,
            isContributing,
            isReady,
            refreshAuth: resolveAuth,
            markContributingActive,
            markContributingInactive
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