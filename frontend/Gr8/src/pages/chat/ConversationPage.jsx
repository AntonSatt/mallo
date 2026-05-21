import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ChatService from "../../services/ChatService";
import ChatSignalrServices from "../../services/ChatSignalrServices";
import ChatWindow from "../../components/chat/chatWindow/ChatWindow";
import MessageInput from "../../components/chat/messageInput/MessageInput";
import ProfileBar from "../../components/layout/ProfileBar.jsx";
import Avatar from "../../components/avatar/avatar.jsx";

const ConversationPage = () => {

    const { userId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState("");
    const [conversationInfo, setConversationInfo] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    const typingTimeoutRef = useRef(null);
    const messageEndRef = useRef(null);

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
                setError("Could not load conversation.");
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
                setError("Could not connect to chat.");
            }
        };

        setupSignalR();

        return () => {
            clearTimeout(typingTimeoutRef.current);
        };
    }, [userId]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView();
    }, [messages]);

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
            setError("Could not send message.");
        }
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
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    px: 2,
                    pt: 0,
                    pb: 1
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
                        textAlign: "center"
                    }}
                >
                    <Avatar
                        className="post-avatar"
                        avatar={conversationInfo?.avatarId}
                    />

                    <Typography
                        sx={{
                            mt: 0.5,
                            color: "var(--color-text-main)",
                            fontWeight: 300
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
    );
};

export default ConversationPage;