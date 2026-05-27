import './ProfileBar.css';
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useOnlineUsers } from "../../contexts/OnlineUsersContext";
import {
    Box,
    Paper,
    Typography,
    Button,
    InputAdornment,
    Dialog
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import SearchHeartButton from "../../assets/icons/searchHeartForum.svg";
import Avatar from "../avatar/avatar";
import InputField from '../../design/input/InputField.jsx';
import notificationButton from "../../assets/icons/notificationButton.svg";
import SidebarNotification from "../../components/layout/SidebarNotification.jsx";
import { useEffect } from "react";
import NotificationService from "../../services/NotificationService";

// this is the profile bar that appears at the top of the forum page. It shows the user's avatar and name,
// and has an optional "create post"
// input that looks like a text field but works as a button to open the post creation dialog. This input is
// only shown when the showCreate prop is true.
const ProfileBar = ({ showCreate = false, onCreatePost, onSearch }) => {
    const { currentUser } = useAuth();
    const { isUserOnline } = useOnlineUsers();
    const isOnline = isUserOnline(currentUser?.sub);

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await NotificationService.getAll();
                const list = Array.isArray(data)
                    ? data
                    : data.notifications
                    ?? data.data
                    ?? data.content
                    ?? [];

                setNotifications(list);
                setUnreadCount(list.filter(n => !n.isSeen).length);

            } catch (err) {
                console.error("Failed to load notifications", err);
            }
        };

        fetchNotifications();
    }, []);


    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        onSearch?.(e.target.value);
    };

    return (
        <Box className="profilebar-wrapper">
            <Paper className={`profilebar-container ${showCreate ? "forum-profilebar" : ""}`}>
                {showCreate === "true" ? (
                    <>
                        <Box className="profilebar-top-row">
                            <Box
                                sx={{
                                    position: "relative",
                                    width: 46,
                                    height: 46,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Avatar avatar={currentUser?.picture} size={46} />

                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: -2,
                                        right: -5,
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        backgroundColor: isOnline ? "#22C55E" : "#D9D9D9",
                                        border: "2px solid var(--color-bg-main)",
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box className="profilebar-create" sx={{ position: 'relative', flex: 1 }}>
                            <Button
                                fullWidth
                                onClick={onCreatePost}
                                sx={{
                                    height: 46,
                                    borderRadius: '999px',
                                    backgroundColor: 'var(--color-bg-muted)',
                                    justifyContent: 'flex-start',
                                    paddingLeft: '14px',
                                    color: 'var(--color-text-main)',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: 'var(--color-bg-muted)',
                                    }
                                }}
                                startIcon={<ControlPointIcon sx={{ color: 'var(--color-primary)', fontSize: '30px !important' }} />}
                            >
                                Skapa inlägg
                            </Button>

                            {searchOpen && (
                                <Box sx={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    zIndex: 10,
                                }}>
                                    <InputField
                                        autoFocus
                                        fullWidth
                                        placeholder="Sök inlägg..."
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => {
                                                            setSearchValue("");
                                                            onSearch?.("");
                                                            setSearchOpen(false);
                                                        }} sx={{ mr: -2 }}>
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>

                        <Button type="button" className="profilebar-search-button" aria-label="Sök"
                            onClick={() => setSearchOpen(true)}>
                            <img src={SearchHeartButton} alt="" className="profilebar-search-icon" />
                        </Button>

                        <Box sx={{ position: "relative" }}>
                            <Button
                                onClick={handleOpen}
                                aria-label="Notifikationer"
                                disableRipple
                                sx={{
                                    minWidth: 0,
                                    padding: 0,
                                    background: "transparent",
                                    boxShadow: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    "&:hover": { background: "transparent" },
                                    "&:focus": { outline: "none" },
                                    "&:focus-visible": { outline: "none" }
                                }}
                            >
                                <img src={notificationButton} alt="" className="notification-icon" />
                            </Button>

                            {unreadCount > 0 && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 2,
                                        right: 2,
                                        backgroundColor: "var(--color-primary-soft)",
                                        color: "#374957",
                                        borderRadius: "50%",
                                        width: 18,
                                        height: 18,
                                        fontSize: "0.7rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 600,
                                    }}
                                >
                                    {unreadCount}
                                </Box>
                            )}
                        </Box>

                        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                            <SidebarNotification onClose={handleClose} />
                        </Dialog>

                    </>
                ) : (
                    <>
                        <Box className="profilebar-left">
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "fit-content",
                                    flexShrink: 0,
                                }}
                            >
                                <Avatar avatar={currentUser?.picture} />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: -2,
                                        right: -5,
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        backgroundColor: isOnline ? "#22C55E" : "#D9D9D9",
                                        border: "2px solid var(--color-bg-main)",
                                    }}
                                />
                            </Box>
                            <Typography className="profile-name">
                                {currentUser?.preferred_username || currentUser?.email || "Användarnamn saknas"}
                            </Typography>
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default ProfileBar;