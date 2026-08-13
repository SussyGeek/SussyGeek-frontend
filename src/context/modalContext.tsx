import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { login as loginService } from "@/api/services/userService";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export type ModalType = "username" | "active_session";
export type RequestType = "Hall of Fame" | "Live Chat";

type ModalContextType = {
    usernameModalOpen: boolean,
    activeSessionModalOpen: boolean,
    usernameInput: string,
    requestType: RequestType,
    setUsernameInput: Dispatch<SetStateAction<string>>,
    confirmUserModal: () => Promise<void>,
    openModal: (modalType: ModalType, requestType: RequestType) => void,
    closeModal: (modalType: ModalType) => void
};

export const ModalContext = createContext<ModalContextType>({
    usernameModalOpen: false,
    activeSessionModalOpen: false,
    usernameInput: "",
    requestType: "Hall of Fame",
    setUsernameInput: () => { },
    confirmUserModal: async () => { },
    openModal: () => { },
    closeModal: () => { }
});

export function ModalProvider({ children }: { children: ReactNode }) {
    const [usernameModalOpen, setUsernameModalOpen] = useState<boolean>(false);
    const [activeSessionModalOpen, setActiveSessionModalOpen] = useState<boolean>(false);
    const [usernameInput, setUsernameInput] = useState<string>("");
    const [requestType, setRequestType] = useState<RequestType>("Hall of Fame");
    const { toast } = useToast();
    const auth = useAuth();

    const openModal = (
        modalType: ModalType,
        requestType: RequestType
    ) => {
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
        setRequestType(requestType);
    }

    // Validates input, calls login service, refreshes auth, then closes the modal.
    // Self-contained so it can be triggered from any entry point (contribute, chat, etc).
    const confirmUserModal = async () => {
        if (!usernameInput.trim() || usernameInput.length > 24) {
            toast({
                variant: "destructive",
                title: "Username required",
                description: "Provided name unacceptable."
            });
            return;
        }
        try {
            const response = await loginService(usernameInput);
            if (response.success) {
                await auth?.refreshAuth();
            }
            setUsernameInput("");
            setUsernameModalOpen(false);
        } catch {
            toast({
                variant: "destructive",
                title: "Login failed.",
                description: "Server error. Try again later."
            });
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
        usernameInput,
        requestType,
        setUsernameInput,
        confirmUserModal,
        openModal,
        closeModal
    }}>
        {children}
    </ModalContext.Provider>
};
