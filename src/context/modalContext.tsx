import { toast, useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export type ModalType = "username" | "active_session";

type ModalContextType = {
    usernameModalOpen: boolean,
    activeSessionModalOpen: boolean,
    usernameInput: string,
    setUsernameInput: Dispatch<SetStateAction<string>>,
    confirmUserModal: () => void,
    openModal: (modalType: ModalType) => void,
    closeModal: (modalType: ModalType) => void
};

export const ModalContext = createContext<ModalContextType>({
    usernameModalOpen: false,
    activeSessionModalOpen: false,
    usernameInput: "",
    setUsernameInput: () => { },
    confirmUserModal: () => { },
    openModal: () => { },
    closeModal: () => { }
});

export function ModalProvider({ children }: { children: ReactNode }) {
    const [usernameModalOpen, setUsernameModalOpen] = useState<boolean>(false);
    const [activeSessionModalOpen, setActiveSessionModalOpen] = useState<boolean>(false);
    const [usernameInput, setUsernameInput] = useState<string>("");
    const { toast } = useToast();
    const auth = useAuth();

    const openModal = (modalType: ModalType) => {
        if (usernameModalOpen || activeSessionModalOpen)
            return;
        if (modalType === "username") {
            if (auth?.username)
                return;
            setUsernameModalOpen(true);
        } else {
            if (!auth?.username)
                return;
            setActiveSessionModalOpen(true);
        }
    }

    const confirmUserModal = () => {
        if (!usernameInput.trim() || usernameInput.length > 24) {
            toast({
                variant: "destructive",
                title: "Username required",
                description: "Provided name unacceptable."
            });
            return;
        }
    }

    const closeModal = (modalType: ModalType) => {
        if (modalType === "username") {
            setUsernameModalOpen(false);
        } else {
            setActiveSessionModalOpen(false);
        }
    }

    return <ModalContext.Provider value={{
        usernameModalOpen,
        activeSessionModalOpen,
        setUsernameInput,
        confirmUserModal,
        usernameInput,
        openModal,
        closeModal
    }}>
        {children}
    </ModalContext.Provider>
};
