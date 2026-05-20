import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";
import Avatar from "../../avatar/avatar.jsx";
import moment from "moment";

// component to display a single conversation between the user and another user.
const ConversationItem = ({ conversation }) => {
    const navigate = useNavigate();

    const hasUnreadMessage = conversation.hasUnreadMessage;

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
                        opacity: hasUnreadMessage ? 1 : 0.75,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "0.9rem",
                        fontWeight: hasUnreadMessage ? 700 : 400
                    }}
                >
                    {conversation.lastMessage || "Ingen meddelandehistorik ännu"}
                </Typography>
            </Box>

            <Typography
                sx={{
                    fontSize: "0.7rem",
                    opacity: 0.55,
                    color: "var(--color-text-main)",
                    flexShrink: 0,
                    alignSelf: "center"
                }}
            >
                {conversation.lastMessageAt ? moment(conversation.lastMessageAt).format("HH:mm") : ""}

            </Typography>
        </Paper>
    );
};

export default ConversationItem;