import { Box, Typography } from "@mui/material";
import { useAuth } from "../../../hooks/useAuth";
import moment from "moment";

//components to display the chat window with messages.
const ChatWindow = ({ messages }) => {
    const { currentUser } = useAuth();
    const currentUserId = currentUser?.sub || currentUser.id || currentUser?.userId;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                py: 2,
            }}
        >
            {/* Loop through messages and display them with different styling based on whether they are sent by the current user or not. */}
            {messages.map((message, index) => {
                const isMine = message.senderId === currentUserId;

                return (
                    <Box
                        key={`${message.id}-${index}`}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: isMine ? "flex-end" : "flex-start",
                            px: 0.1
                        }}
                    >
                        <Typography
                                sx={{
                                    fontSize: "0.7rem",
                                    opacity: 0.6,
                                    mb: 0.5,
                                    mr: 1,
                                    textAlign: isMine ? "right" : "left",
                                }}
                                >
                                {moment(message.sendAt).format("HH:mm")}
                            </Typography>
                        
                        <Box
                            sx={{
                                maxWidth: "75%",
                                px: 2,
                                py: 1,
                                borderRadius: 4,
                                backgroundColor: isMine ? "var(--color-primary-soft)" : "var(--color-bg-surface)",
                                color: "var(--color-text-main)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.95rem",
                                    wordBreak: "break-word"
                                }}
                            >
                                {message.content}
                            </Typography>
                        </Box>
                    </Box>
                    
                );
            })}
            
        </Box>
        
    );
    
};

export default ChatWindow;