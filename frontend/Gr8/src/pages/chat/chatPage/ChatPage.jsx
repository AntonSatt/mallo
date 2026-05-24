import ConversationList from "../../../components/chat/conversationList/ConversationList.jsx";
import ChatService from "../../../services/ChatService.jsx";
import ChatSignalrServices from "../../../services/ChatSignalrServices.jsx";
import ProfileBar from "../../../components/layout/ProfileBar.jsx";
import useViewport from "../../../hooks/useViewport.js";
import './ChatPage.css';
import { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";

const ChatPage = () => {
    const { isDesktop } = useViewport();
    const scrollAreaRef = useRef(null);

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

    // Global scroll handler to allow scrolling the chat window when the mouse is outside of it on desktop.
    useEffect(() => {
        if (!isDesktop) {
            return;
        }

        const handleWheel = (event) => {
            const scrollArea = scrollAreaRef.current;

            if (!scrollArea || !event.deltaY) {
                return;
            }

            const targetInScrollArea =
                event.target instanceof Node &&
                scrollArea.contains(event.target);

            if (targetInScrollArea) {
                return;
            }

            scrollArea.scrollTop += event.deltaY;
            event.preventDefault();
        };

        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => window.removeEventListener("wheel", handleWheel);
    }, [isDesktop]);

    const deleteConversation = async (otherUserId) => {
        try {
            await ChatSignalrServices.deleteConversation(otherUserId);

            setConversations((prevConversations) =>
                prevConversations.filter(
                    (conversation) => conversation.otherUserId !== otherUserId
                )
            );
        } catch (error) {
            console.error("Failed to delete conversation", error);
            setError("Could not delete conversation.");
        }
    };

    // Function to start a new conversation with a specified user ID.
    const startNewConversation = () => {
        if (!newConversationUserId.trim()) {
            return;
        }

        setNewConversationUserId("");
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                <Box className="scrollbar"
                    ref={scrollAreaRef}
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: "auto",
                        backgroundColor: "var(--color-bg-main)",
                        px: 2,
                        py: 3,
                        pb: isDesktop ? 0 : "calc(24px + var(--protected-nav-height))"
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

                    <ConversationList
                        conversations={conversations}
                        deleteConversation={deleteConversation}
                    />
                </Box>
            </div>
        </div>
    );
};

export default ChatPage;