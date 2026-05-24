import './ConversationPage.css';
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { useOnlineUsers } from "../../../contexts/OnlineUsersContext.jsx";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ChatService from "../../../services/ChatService.jsx";
import ChatSignalrServices from "../../../services/ChatSignalrServices.jsx";
import ChatWindow from "../../../components/chat/chatWindow/ChatWindow.jsx";
import MessageInput from "../../../components/chat/messageInput/MessageInput.jsx";
import Avatar from "../../../components/avatar/avatar.jsx";
import useViewport from "../../../hooks/useViewport.js";

const ConversationPage = () => {

    const { isUserOnline } = useOnlineUsers();
    const { userId } = useParams();
    const navigate = useNavigate();
    const { isDesktop } = useViewport();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState("");
    const [conversationInfo, setConversationInfo] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    const typingTimeoutRef = useRef(null);
    const messageEndRef = useRef(null);
    const chatScrollRef = useRef(null);

    // Load the conversation info and chat history when the component mounts or when the userId changes.
    useEffect(() => {

        const loadConversation = async () => {
            try {
                const conversations = await ChatService.getConversations();
                const selectedConversation = conversations?.find(
                    (conversation) => conversation.otherUserId === userId
                );

                setConversationInfo(selectedConversation ?? null);

                const history = await ChatService.getChatHistory(userId);
                setMessages(history ?? []);

                await ChatSignalrServices.markConversationAsRead(userId);

            } catch (error) {
                console.error("Failed to load conversation", error);
                setError("Kunde inte ladda konversationen. Försök igen senare.");
            }
        };

        loadConversation();
    }, [userId]);

    // Set up SignalR connection and event handlers for receiving messages and typing notifications.
    useEffect(() => {
        const setupSignalR = async () => {
            try {
                await ChatSignalrServices.startConnection();

                ChatSignalrServices.onReceiveMessage((message) => {
                    const currentConversation =
                        message.senderId === userId || message.receiverId === userId;

                    if (!currentConversation) {
                        return;
                    }

                    setMessages((prevMessages) => {
                        const alreadyExists = prevMessages.some(
                            (m) => m.id === message.id
                        );

                        if (alreadyExists) {
                            return prevMessages;
                        }

                        return [...prevMessages, message];
                    });
                });

                // Listen for typing notifications from the other user and show "typing..."
                ChatSignalrServices.onUserTyping((senderId) => {
                    if (senderId !== userId) {
                        return;
                    }

                    setIsTyping(true);

                    clearTimeout(typingTimeoutRef.current);

                    typingTimeoutRef.current = setTimeout(() => {
                        setIsTyping(false);
                    }, 5000);
                });
            } catch (error) {
                console.error("Failed to setup SignalR", error);
                setError("Kunde inte ansluta till chatten. Försök igen senare.");
            }
        };

        setupSignalR();

        return () => {
            clearTimeout(typingTimeoutRef.current);
        };
    }, [userId]);

    // Scroll to the bottom of the chat window whenever new messages are received.
    useEffect(() => {
        messageEndRef.current?.scrollIntoView();
    }, [messages]);

    // Global scroll handler to allow scrolling the chat window when the mouse is outside of it on desktop.
    useEffect(() => {
        if (!isDesktop) {
            return;
        }

        const handleWheel = (event) => {
            const chatScroll = chatScrollRef.current;

            if (!chatScroll || !event.deltaY) {
                return;
            }

            const targetInChatScroll =
                event.target instanceof Node &&
                chatScroll.contains(event.target);

            if (targetInChatScroll) {
                return;
            }

            chatScroll.scrollTop += event.deltaY;
            event.preventDefault();
        };

        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => window.removeEventListener("wheel", handleWheel);
    }, [isDesktop]);

    // Handle changes to the message input and send typing notifications to the other user.
    const handleMessageChange = (value) => {
        setNewMessage(value);

        if (!value.trim()) {
            return;
        }

        ChatSignalrServices.sendTyping(userId).catch((error) => {
            console.error("Failed to send typing event", error);
        });
    };

    // Send a new message to the other user through SignalR and clear the input field.
    const sendMessage = async () => {

        if (!newMessage.trim()) {
            return;
        }

        try {
            await ChatSignalrServices.sendMessage({
                receiverId: userId,
                activityId: conversationInfo?.activityId ?? null,
                content: newMessage
            });

            setNewMessage("");

        } catch (error) {
            console.error("Failed to send message", error);
            setError("Kunde inte skicka meddelandet. Försök igen senare.");
        }
    };

    const isOnline = isUserOnline(conversationInfo?.otherUserId);

    return (
        <div className="conversation-page">
            <div className="conversation-container">
                <Box className="conversation-content"
                    sx={{
                        height: isDesktop
                            ? "calc(100dvh - var(--protected-nav-height) - 4px)"
                            : "calc(100dvh - (var(--protected-nav-height) * 2) - 4px)",
                        backgroundColor: "var(--color-bg-main)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        pb: isDesktop ? 1 : "calc(var(--protected-nav-height) - 55px)",
                    }}
                >
                    <Box
                        sx={{
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                            px: 2,
                            pt: isDesktop ? 2 : 0,
                            pb: isDesktop ? 2 : 1
                        }}
                    >
                        <IconButton
                            onClick={() => navigate("/message")}
                            sx={{
                                position: "absolute",
                                left: 5
                            }}
                        >
                            <ArrowBackIosNewIcon />
                        </IconButton>

                        <Box
                            sx={{
                                width: "100%",
                                textAlign: isDesktop ? "left" : "center",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: isDesktop ? "row" : "column",
                                gap: isDesktop ? 2 : 0,
                            }}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "fit-content",
                                    flexShrink: 0,
                                }}
                            >
                                <Avatar
                                    className="post-avatar"
                                    avatar={conversationInfo?.avatarId}
                                />

                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: isDesktop ? -5 : -2,
                                        right: isDesktop ? -5 : -5,
                                        width: isDesktop ? 14 : 12,
                                        height: isDesktop ? 14 : 12,
                                        borderRadius: "50%",
                                        backgroundColor: isOnline ? "#22C55E" : "#D9D9D9",
                                        border: "2px solid var(--color-bg-main)",
                                    }}
                                />
                            </Box>

                            <Typography
                                sx={{
                                    mt: isDesktop ? 0 : 0.5,
                                    color: "var(--color-text-main)",
                                    fontWeight: isDesktop ? 400 : 300,
                                    fontSize: isDesktop ? "1.5rem" : "1rem",
                                }}
                            >
                                {conversationInfo?.otherUserFullName}
                            </Typography>
                        </Box>
                    </Box>

                    {error && (
                        <Typography sx={{ color: "red", px: 2, mb: 1, flexShrink: 0 }}>
                            {error}
                        </Typography>
                    )}

                    <Paper
                        ref={chatScrollRef}
                        elevation={0}
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: "auto",
                            backgroundColor: "var(--color-bg-surface)",
                            borderRadius: 4,
                            px: 2,
                            py: 1,
                            mx: 1,
                            mb: 1,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                        }}
                    >
                        <ChatWindow messages={messages} />

                        {isTyping && (
                            <Typography
                                sx={{
                                    px: 0.2,
                                    pb: 0.5,
                                    fontSize: "0.80rem",
                                    opacity: 0.5,
                                    color: "var(--color-text-main)"
                                }}
                            >
                                {conversationInfo?.otherUserFullName} skriver...
                            </Typography>
                        )}

                        <div ref={messageEndRef} />
                    </Paper>

                    <Box
                        sx={{
                            flexShrink: 0,
                            px: 1,
                            pt: 0.5,
                            pb: 1,
                            backgroundColor: "var(--color-bg-main)"
                        }}
                    >
                        <MessageInput
                            newMessage={newMessage}
                            setNewMessage={handleMessageChange}
                            sendMessage={sendMessage}
                        />
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default ConversationPage;