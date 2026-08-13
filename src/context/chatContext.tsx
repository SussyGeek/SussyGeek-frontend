import { ChatMessage } from "@/types/generic";
import {
    createContext,
    ReactNode,
    useRef,
    useEffect,
    useState
} from "react";

type ChatContextType = {
    socketRef: {
        current: WebSocket | null
    },
    messages: ChatMessage[],
    establishConnection: () => Promise<void> | void;
};

const WEBSOCKET_ENDPOINT = import.meta.env.VITE_WS_CHAT_ENDPOINT;
if (!WEBSOCKET_ENDPOINT) {
    throw new Error("Websocket endpoint not defined");
}

export const ChatContext = createContext<ChatContextType>({
    socketRef: { current: null },
    establishConnection: () => { },
    messages: []
});

export const ChatProvider = (
    { children }: { children: ReactNode }
) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const establishConnection = async () => {
        if (socketRef.current?.OPEN || socketRef.current?.CONNECTING)
            return;

        socketRef.current = new WebSocket(WEBSOCKET_ENDPOINT);

        // TODO: Remove. Kept for debugging purpose.
        socketRef.current.onopen = () => {
            console.log("Connection opened for chat.");
        }

        socketRef.current.onclose = () => {
            console.log("Connection closed");
        }

        socketRef.current.onerror = () => {
            console.log("Some error occcured");
        }
        // ---

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "chat_messages") {
                setMessages(prev => [
                    ...prev,
                    data.message
                ]);
            } else if (data.type === "chat_history") {
                setMessages(data.messages);
            }
        }
    };

    const pushMessage = (
        message: string
    ) => {

    }


    useEffect(() => {
        return () => {
            socketRef.current?.close();
            socketRef.current = null;
        };
    }, []);

    return (
        <ChatContext.Provider value={{
            // @ts-ignore
            socketRef,
            establishConnection,
            messages,
        }}>
            {children}
        </ChatContext.Provider>
    )
};