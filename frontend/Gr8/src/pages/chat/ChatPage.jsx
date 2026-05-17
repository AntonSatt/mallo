import ChatService from "../../services/ChatService.jsx";
import ChatSignalrServices from "../../services/ChatSignalrServices.jsx";
import { useEffect, useState } from "react";

const ChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState("");
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [newConversationUserId, setNewConversationUserId] = useState("");

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

                    setConversations((prevConversation) => {
                        const existingConversation = prevConversation.find((c) => c.otherUserId === message.senderId || c.otherUserId === message.receiverId);

                        if (existingConversation) {
                            return prevConversation.map((conversation) => {

                                if (conversation.otherUserId === message.senderId || conversation.otherUserId === message.receiverId) {
                                    return { ...conversation, lastMessage: message.content };
                                }

                                return conversation;
                            });
                        }

                        return [{
                            otherUserId: message.senderId,
                            lastMessage: message.content
                        }, ...prevConversation];

                    });
                });

                setIsConnected(true);

                const conversationsData = await ChatService.getConversations();
                setConversations(conversationsData ?? []);
                console.log("Conversations from backend:", conversationsData);

            } catch (error) {
                console.error("Failed to initialize chat:", error);
                setError(error.message || "Could not load chat.");
            }
        };

        initializeChat();

    }, []);

    const openConversation = async (conversation) => {
        setSelectedConversation(conversation);

        const history = await ChatService.getChatHistory(conversation.otherUserId);
        setMessages(history ?? []);
    }

    const startNewConversation = () => {
        if (!newConversationUserId.trim()) {
            return;
        }

        setSelectedConversation({
            otherUserId: newConversationUserId,
            activityId: null,
            lastMessage: ""
        });

        setMessages([]);
        setNewConversationUserId("");
    };

    const sendMessage = async () => {
        if (!selectedConversation || !newMessage.trim()) {
            return;
        }

        try {
            await ChatSignalrServices.sendMessage({
                receiverId: selectedConversation.otherUserId,
                activityId: selectedConversation.activityId,
                content: newMessage
            });

            setNewMessage("");

        } catch (error) {
            console.error("Failed to send message", error);
            setError("Could not send message");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Chat</h2>

            <p>Status: {isConnected ? "Connected" : "Not connected"}</p>

            {error && <p>{error}</p>}

            <div style={{ marginTop: "1rem" }}>
                <h3>Starta ny chat</h3>

                <input
                    type="text"
                    placeholder="Skriv användarens ID"
                    value={newConversationUserId}
                    onChange={(e) => setNewConversationUserId(e.target.value)}
                />

                <button onClick={startNewConversation}>
                    Starta chat
                </button>
            </div>

            <h3>Konversationer</h3>

            {conversations.length === 0 ? (
                <p>Inga konversationer ännu.</p>
            ) : (
                conversations.map((conversation) => (
                    <div key={conversation.otherUserId} onClick={() => openConversation(conversation)}>
                        <strong>{conversation.otherUserId}</strong>
                        <p>{conversation.lastMessage}</p>
                    </div>
                ))
            )}

            {selectedConversation && (
                <div>
                    <h3>Vald konversation</h3>
                    <p>{selectedConversation.otherUserId}</p>
                </div>
            )}

            <h3>Senaste meddelanden</h3>

            {messages.map((message, index) => (
                <div key={`${message.id}-${index}`}>
                    <strong>{message.senderId}</strong>: {message.content}
                </div>
            ))}

            {selectedConversation && (
                <div style={{ marginTop: "1rem" }}>
                    <input type="text" placeholder="Skriv ett meddelande" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                    <button onClick={sendMessage}>Skicka</button>
                </div>
            )}
        </div>
    )
}

export default ChatPage;