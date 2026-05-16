import ChatService from "../../services/ChatService.jsx";
import ChatSignalrServices from "../../services/ChatSignalrServices.jsx";
import { useEffect, useState } from "react";

const ChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const initializeChat = async () => {
            try {
                await ChatSignalrServices.startConnection();

                ChatSignalrServices.onReceiveMessage((message) => {
                    console.log("Received message:", message);

                    setMessages((prevMessages) => {
                        const alreadyExists = prevMessages.some((m) => m.id === message.id);

                        if (alreadyExists) {
                            return prevMessages;
                        }

                        return [...prevMessages, message];
                    });
                });

                setIsConnected(true);

                const conversationsData = await ChatService.getConversations();
                setConversations(conversationsData ?? []);

            } catch (error) {
                console.error("Failed to initialize chat:", error);
                setError(error.message || "Could not load chat.");
            }
        };

        initializeChat();

    }, []);

    return (
        <div style={{padding: "2rem"}}>
            <h2>Chat</h2>

            <p>Status: {isConnected ? "Connected" : "Not connected"}</p>

            {error && <p>{error}</p>}

            <h3>Konversationer</h3>

            {conversations.length === 0 ? (
                <p>Inga konversationer ännu.</p>
            ):(
                conversations.map((conversation) => (
                    <div key={conversation.otherUserId}>
                        <strong>{conversation.otherUserId}</strong>
                        <p>{conversation.lastMessage}</p>
                    </div>
                ))
            )}

            <h3>Senaste meddelanden</h3>

            {messages.map((message, index) => (
                <div key={`${message.id}-${index}`}>
                    <strong>{message.senderId}</strong>: {message.content}
                </div>
            ))}
        </div>
    )
}

export default ChatPage;