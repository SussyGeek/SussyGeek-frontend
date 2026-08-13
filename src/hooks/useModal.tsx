import { ModalContext } from "@/context/modalContext";
import { useContext } from "react";

export function useModal() {
    const context = useContext(ModalContext);
    if (!context)
        throw new Error("useAuth hook must be used within context provider");
    return context;
};