import { useEffect, useState } from "react";
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
            } catch (error) {
                console.error("Failed to load conversation", error);
                setError("Could not load conversation.");
            }
        };

        loadConversation();
    }, [userId]);

    // Listen for incoming messages through SignalR and update the chat window if the message belongs to the current conversation.
    useEffect(() => {

        ChatSignalrServices.onReceiveMessage((message) => {

            const currentConversation =
                message.senderId === userId || message.receiverId === userId;

            if (!currentConversation) {
                return;
            }

            setMessages((prevMessages) => {

                const alreadyExists = prevMessages.some((m) => m.id === message.id);

                if (alreadyExists) {
                    return prevMessages;
                }

                return [...prevMessages, message];
            });
        });

    }, [userId]);

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
        <div>
            <ProfileBar />
            <Box
                sx={{
                    height: "100vh",
                    backgroundColor: "var(--color-bg-main)",
                    display: "flex",
                    flexDirection: "column",
                    px: 1,
                    py: 2,
                    boxSizing: "border-box",
                }}
            >
                <Box
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}>

                    <IconButton onClick={() => navigate("/message")}>
                        <ArrowBackIosNewIcon />
                    </IconButton>

                    <Typography
                        sx={{
                            fontWeight: 700,
                            color: "var(--color-text-main)",
                        }}
                    >
                        Tillbaka
                    </Typography>
                </Box>

                <Box sx={{ textAlign: "center", mb: 1 }}>
                    <Avatar
                        className="post-avatar"
                        avatar={conversationInfo?.avatarId}
                    />

                    <Typography
                        sx={{ mt: 1, color: "var(--color-text-main)", fontWeight: 600, }}>
                        {conversationInfo?.otherUserName || userId}
                    </Typography>
                </Box>

                {error && (
                    <Typography sx={{ color: "red", mb: 1 }}>
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
                        mb: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                >
                    <ChatWindow messages={messages} />
                </Paper>

                <Box
                    sx={{
                        pt: 1,
                        flexShrink: 0,
                        backgroundColor: "var(--color-bg-main)"
                    }}>

                    <MessageInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        sendMessage={sendMessage}
                    />
                </Box>
            </Box>
        </div>
    );
};

export default ConversationPage;