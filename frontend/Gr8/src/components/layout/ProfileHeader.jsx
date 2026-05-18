import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from "../avatar/avatar";
import { Icon, IconButton, Stack, Typography, ClickAwayListener, Box, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PrimaryButton from '../../design/buttons/PrimaryButton';

const ProfileHeader = () => {
    const { currentUser, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => { setMenuOpen((prev) => !prev) };
    const closeMenu = () => setMenuOpen(false);

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <Box className="profileheader-wrapper">
                <Stack
                    className='profileHeader-container'
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 },
                        paddingLeft: "20px"
                    }}
                >
                    <Avatar
                        avatar={currentUser?.picture}
                        className="header-avatar"
                        style={{ width: '70px', height: '70px', borderRadius: '50%' }}
                    />
                    <Typography
                        sx={{
                            fontSize: "1.8rem",
                            paddingTop: "10px"
                        }}
                    >
                        {currentUser?.preferred_username || name}
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={toggleMenu}
                        sx={{
                            color: "var(--color-primary)",
                            border: "1px solid var(--color-primary)",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            top: "22px",
                            zIndex: "9999",
                            pointerEvents: "auto"
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
                            position: "fixed",
                            top: "106px",
                            left: "20px",
                            width: "285px",
                            backgroundColor: "var(--color-bg-surface)",
                            borderRadius: "8px",
                            border: "1px solid var(--color-border-light)",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0,1)",
                            padding: "16px",
                            zIndex: 10000
                        }}
                    >
                        <Stack>
                            <PrimaryButton
                                onClick={logout}
                                startIcon={<LogoutOutlinedIcon />}
                                sx={{
                                    color: "var(--color-bg-muted)",
                                }}
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