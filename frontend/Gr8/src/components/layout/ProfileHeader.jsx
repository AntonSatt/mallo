import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOnlineUsers } from "../../contexts/OnlineUsersContext";
import { Icon, IconButton, Stack, Typography, ClickAwayListener, Box, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Avatar from "../avatar/avatar";
import PrimaryButton from '../../design/buttons/PrimaryButton';
import "./ProfileHeader.css"

const ProfileHeader = () => {
    const { currentUser, logout } = useAuth();
    const { isUserOnline } = useOnlineUsers();
    const isOnline = isUserOnline(currentUser?.sub);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => { setMenuOpen((prev) => !prev) };
    const closeMenu = () => setMenuOpen(false);

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <Box className="profileheader-wrapper">
                <Stack
                    className="profileHeader-container"
                    spacing={1}
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: "fit-content",
                            flexShrink: 0,
                        }}
                    >
                        <Avatar
                            className="header-avatar"
                            avatar={currentUser?.picture}
                        />
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

                    <Typography
                        className="header-username"
                    >
                        {currentUser?.preferred_username || name}
                    </Typography>

                    <IconButton
                        className="header-arrow-button"
                        onClick={toggleMenu}
                        sx={{
                            color: "var(--color-primary)",
                            border: "1px solid var(--color-primary)",
                        }}
                    >
                        <ExpandMoreIcon
                            sx={{
                                transition: "transform 0.3",
                                transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)"
                            }}
                        />
                    </IconButton>

                </Stack>
                {menuOpen && (
                    <Box
                        sx={{
                            position: "fixed"
                        }}
                    >
                        <Stack>
                            <PrimaryButton
                                className="logout-button"
                                onClick={logout}
                                startIcon={<LogoutOutlinedIcon />}
                            >
                                Logga ut
                            </PrimaryButton>
                        </Stack>
                    </Box>
                )}
            </Box>
        </ClickAwayListener>
    )
}
export default ProfileHeader;