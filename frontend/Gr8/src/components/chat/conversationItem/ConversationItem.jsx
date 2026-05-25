import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PersonRemoveAlt1Outlined } from "@mui/icons-material";
import { useOnlineUsers } from "../../../contexts/OnlineUsersContext";
import {
    Box,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import Avatar from "../../avatar/avatar.jsx";
import moment from "moment";
import useViewport from "../../../hooks/useViewport";

// component to display a single conversation between the user and another user.
const ConversationItem = ({ conversation, deleteConversation }) => {
    const navigate = useNavigate();

    const [showDelete, setShowDelete] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const { isDesktop } = useViewport();
    const { isUserOnline } = useOnlineUsers();
    const isOnline = isUserOnline(conversation.otherUserId);

    const hasUnreadMessage = conversation.hasUnreadMessage;

    return (
        <>
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
                <Box
                    onClick={(event) => {
                        event.stopPropagation();
                        setShowDelete((prev) => !prev);
                    }}
                    sx={{
                        position: "relative",
                        flexShrink: 0,
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
                            avatar={conversation.avatarId}
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
                                border: "2px solid var(--color-bg-surface)",
                            }}
                        />
                    </Box>

                    {showDelete && (
                        <Box
                            onClick={(event) => {
                                event.stopPropagation();
                                setOpenDeleteDialog(true);
                            }}
                            sx={{
                                position: "absolute",
                                top: 65,
                                left: 0,
                                zIndex: 20,
                                backgroundColor: "#f53e3e",
                                color: "#fff",
                                borderRadius: 999,
                                px: 2,
                                py: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <PersonRemoveAlt1Outlined fontSize="small" />
                            Radera konversation
                        </Box>
                    )}
                </Box>

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

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle
                    sx={{
                        textAlign: "center",
                        minWidth: 220,
                    }}
                >
                    Radera konversation
                </DialogTitle>

                <DialogContent>
                    <Typography
                        sx={{
                            textAlign: "center",
                            minWidth: 220,
                        }}
                    >
                        Är du säker?
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        justifyContent: "center",
                        gap: 2,
                        pb: 2,
                    }}
                >
                    <Button
                        onClick={() => {
                            setOpenDeleteDialog(false);
                            setShowDelete(false);
                        }}
                    >
                        Nej
                    </Button>

                    <Button
                        onClick={() => {
                            deleteConversation(conversation.otherUserId);
                            setOpenDeleteDialog(false);
                            setShowDelete(false);
                        }}
                        sx={{
                            color: "var(--button-danger-bg)"
                        }}
                    >
                        Ja
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ConversationItem;