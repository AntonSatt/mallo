import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from "../avatar/avatar";
import { Icon, IconButton, Stack, Typography, ClickAwayListener, Box, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PrimaryButton from '../../design/buttons/PrimaryButton';
import "./ProfileHeader.css"

const ProfileHeader = () => {
    const { currentUser, logout } = useAuth();
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
                    <Avatar
                        className="header-avatar"
                        avatar={currentUser?.picture}
                    />
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