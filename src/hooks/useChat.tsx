import { ChatContext } from "@/context/chatContext";
import { useContext } from "react";

export function useChat() {
    const context = useContext(ChatContext);
    if (!context)
        throw new Error("useAuth hook must be used within context provider");
    return context;
};