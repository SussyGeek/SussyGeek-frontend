import { UserContext } from "@/context/userContext";
import { useContext } from "react";

export function useAuth() {
    const context = useContext(UserContext);
    if (!context)
        throw new Error("useAuth hook must be used within context provider");
    return context;
};