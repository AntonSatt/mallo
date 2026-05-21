import ConversationList from "../../components/chat/conversationList/ConversationList.jsx";
import ChatService from "../../services/ChatService.jsx";
import ChatSignalrServices from "../../services/ChatSignalrServices.jsx";
import ProfileBar from "../../components/layout/ProfileBar.jsx";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

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
        <Box
            sx={{
                height: "calc(100dvh - var(--protected-nav-height))",
                backgroundColor: "var(--color-bg-main)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
            }}
        >
            <Box sx={{ flexShrink: 0 }}>
                <ProfileBar />
            </Box>

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    backgroundColor: "var(--color-bg-main)",
                    px: 2,
                    py: 3,
                    pb: "calc(24px + var(--protected-nav-height))"
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        textAlign: "center",
                        fontWeight: 700,
                        color: "var(--color-text-main)",
                        mb: 4,
                    }}
                >
                    Chattar
                </Typography>

                {error && <p>{error}</p>}

                <Box sx={{ mb: 3 }}>
                    <Typography
                        sx={{
                            mb: 1,
                            fontWeight: 600,
                            color: "var(--color-text-main)",
                        }}
                    >
                        Starta ny chat
                    </Typography>

                    <input
                        type="text"
                        placeholder="Skriv användarens ID"
                        value={newConversationUserId}
                        onChange={(e) => setNewConversationUserId(e.target.value)}
                    />

                    <button onClick={startNewConversation}>
                        Starta chat
                    </button>
                </Box>

                <ConversationList conversations={conversations} />
            </Box>
        </Box>
    );
};

export default ChatPage;