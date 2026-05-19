import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";
import Avatar from "../../avatar/avatar.jsx";

// component to display a single conversation between the user and another user.
const ConversationItem = ({ conversation }) => {
    const navigate = useNavigate();

    return (
        <Paper
            onClick={() => navigate(`/message/${conversation.otherUserId}`)}
            elevation={0}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                mb: 1.5,
                borderRadius: 4,
                backgroundColor: "var(--color-bg-surface)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
        >
            <Avatar className="post-avatar" avatar={conversation.avatarId} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    sx={{
                        fontWeight: 700,
                        color: "var(--color-text-main)",
                    }}
                >
                    {conversation.otherUserFullName}
                </Typography>

                <Typography
                    sx={{
                        color: "var(--color-text-main)",
                        opacity: 0.75,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "0.9rem",
                    }}
                >
                    {conversation.lastMessage || "Ingen meddelandehistorik ännu"}
                </Typography>
            </Box>
        </Paper>
    );
};

export default ConversationItem;