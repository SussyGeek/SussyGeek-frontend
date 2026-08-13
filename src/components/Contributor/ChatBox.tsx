import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/types/generic";
import { Send, UsersRound } from "lucide-react";
import { useState } from "react";

const Chats = () => {
    const [message, setMessage] = useState("");
    const [messages] = useState<ChatMessage[]>([]);
    const chatterTool = useChat();

    const handleSend = () => {
        const trimmed = message.trim();
        if (!trimmed) return;
        console.log(trimmed);
        setMessage("");
    };

    return (
        <div className="flex flex-col min-h-[364px] h-[364px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full grid place-content-center text-center">
                        <UsersRound
                            className="mx-auto mb-1 size-12 text-muted-foreground opacity-10"
                        />
                        <div className="opacity-60">
                            <p className="text-sm font-semibold text-muted-foreground">
                                No messages yet.
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                                Be the first to yap.
                            </p>
                        </div>
                    </div>
                ) : (
                    messages.map((chat) => {
                        const isCurrentUser = chat.user === "You";
                        return (
                            <div
                                key={chat.id}
                                className={`flex items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                                        {chat.user.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                {/* Name + message */}
                                <div
                                    className={`min-w-0 max-w-[75%] sm:max-w-[65%] flex flex-col ${isCurrentUser ? "items-end" : "items-start"
                                        }`}
                                >
                                    <span className="text-[11px] text-muted-foreground mb-1 px-1">
                                        {chat.user}
                                    </span>
                                    <div
                                        className={`px-3 py-2 rounded-2xl text-sm break-words ${isCurrentUser
                                            ? "bg-primary text-primary-foreground rounded-br-sm"
                                            : "bg-muted rounded-bl-sm"
                                            }`}
                                    >
                                        {chat.message}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input */}
            <div className="border-t p-2 sm:p-3">
                <div className="flex items-center gap-2">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSend();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 min-w-0 h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="flex-shrink-0 h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chats;