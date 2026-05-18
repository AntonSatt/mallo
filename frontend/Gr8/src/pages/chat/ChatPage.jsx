import ConversationList from "../../components/chat/conversationList/ConversationList.jsx";
import ChatService from "../../services/ChatService.jsx";
import ChatSignalrServices from "../../services/ChatSignalrServices.jsx";
import { useEffect, useState } from "react";

const ChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [error, setError] = useState("");
    const [newConversationUserId, setNewConversationUserId] = useState("");

    // useEffect hook to initialize the chat connection and fetch conversations when the component mounts.
    useEffect(() => {
        const initializeChat = async () => {
            try {
                await ChatSignalrServices.startConnection();

                ChatSignalrServices.onReceiveMessage((message) => {


                    setConversations((prevConversation) => {
                        const existingConversation = prevConversation.find((conversation) =>
                            conversation.otherUserId === message.senderId || conversation.otherUserId === message.receiverId
                        );

                        if (existingConversation) {
                            const updatedConversation = {
                                ...existingConversation,
                                lastMessage: message.content,
                                lastMessageAt: message.sendAt
                            };

                            const otherConversations = prevConversation.filter((conversation) =>
                                conversation.otherUserId !== existingConversation.otherUserId
                            );

                            return [
                                updatedConversation,
                                ...otherConversations
                            ];
                        }

                        return [
                            {
                                otherUserId: message.senderId,
                                activityId: message.activityId,
                                lastMessage: message.content,
                                lastMessageAt: message.sendAt,
                                hasUnreadMessage: true
                            },
                            ...prevConversation
                        ];

                    });
                });

                const conversationsData = await ChatService.getConversations();
                setConversations(conversationsData ?? []);

            } catch (error) {
                console.error("Failed to initialize chat:", error);
                setError(error.message || "Could not load chat.");
            }
        };

        initializeChat();

    }, []);

    // Function to start a new conversation with a specified user ID.
    const startNewConversation = () => {
        if (!newConversationUserId.trim()) {
            return;
        }

        setNewConversationUserId("");
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Chat</h2>

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
                <ConversationList conversations={conversations} />
            )}
        </div>
    )
};

export default ChatPage;