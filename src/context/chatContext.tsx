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
    pushMessage: (message: string) => void,
    establishConnection: () => Promise<void> | void;
};

// TODO: To be moved to dedicated chat config.
const WEBSOCKET_ENDPOINT = import.meta.env.VITE_WS_CHAT_ENDPOINT;
if (!WEBSOCKET_ENDPOINT) {
    throw new Error("Websocket endpoint not defined");
}

export const ChatContext = createContext<ChatContextType>({
    socketRef: { current: null },
    establishConnection: () => { },
    pushMessage: () => { },
    messages: []
});

export const ChatProvider = (
    { children }: { children: ReactNode }
) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const establishConnection = async () => {
        if (
            socketRef.current?.readyState === WebSocket.OPEN ||
            socketRef.current?.readyState === WebSocket.CONNECTING
        ) return;

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

            if (data.type === "chat_message") {
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
        if (
            !socketRef.current ||
            socketRef.current.readyState === WebSocket.CLOSED ||
            socketRef.current.readyState === WebSocket.CLOSING
        ) {
            // TODO: Introduce proper development logs for this. Will be hard to diagnose later.
            return;
        }
        const isBadMessage = message.length > 120;
        if (isBadMessage) {
            return;
        }

        socketRef.current.send(JSON.stringify({
            type: "send_message",
            id: localStorage.getItem("sessionId"),
            message,
        }));
    }


    useEffect(() => {
        return () => {
            socketRef.current?.close();
            socketRef.current = null;
        };
    }, []);

    return (
        <ChatContext.Provider value={{
            socketRef,
            establishConnection,
            pushMessage,
            messages,
        }}>
            {children}
        </ChatContext.Provider>
    )
};