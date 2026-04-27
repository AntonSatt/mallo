import { useState } from "react";
import {
    Box,
    Paper,
    Avatar,
    Typography,
    Button,
    ClickAwayListener,
} from "@mui/material";

import HamburgerMenu from './HamburgerMenu';
import './ProfileBar.css';
import PrimaryButton from "../../design/buttons/PrimaryButton";
import SecondaryButton from "../../design/buttons/SecondaryButton";
import EventIcon from '@mui/icons-material/Event';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAuth } from "../../hooks/useAuth";

const ProfileBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { currentUser, logout } = useAuth();

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <Box className="profilebar-wrapper">
                <Paper className="profilebar-container">
                    <Box className="profilebar-left">
                        <Avatar />
                        <Typography>{currentUser?.preferred_username || currentUser?.email || "Användarnamn saknas"}</Typography>
                    </Box>

                    <HamburgerMenu
                        open={menuOpen}
                        onToggle={toggleMenu}
                    />
                </Paper>

                <Box
                    className={`profilebar-menu ${menuOpen ? "open" : ""}`}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "0.8fr 1.2fr",
                        gap: 2,
                        px: 4,
                        pt: 4,
                        pb: 4,
                        mt: 1.5
                    }}
                >
                    <SecondaryButton type="submit" sx={{
                        height: 40,
                    }}>
                        <Typography
                            variant="body2"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                            <ShieldOutlinedIcon fontSize="small" sx={{ color: 'var(--button-primary-bg)' }} />
                            Badges
                        </Typography>
                    </SecondaryButton>
                    <SecondaryButton type="submit" sx={{ height: 40, minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                            <EventIcon fontSize="small" sx={{ color: 'var(--button-primary-bg)' }} />
                            Dina aktiviteter
                        </Typography>
                    </SecondaryButton>
                    <SecondaryButton type="submit" sx={{
                        height: 40,
                    }}>
                        <Typography
                            variant="body2"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                            <RedeemOutlinedIcon fontSize="small" sx={{ color: 'var(--button-primary-bg)' }} />
                            Gåvor
                        </Typography>
                    </SecondaryButton>
                    <SecondaryButton type="submit" sx={{ height: 40, minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                            <BookmarkOutlinedIcon fontSize="small" sx={{ color: 'var(--button-primary-bg)' }} />
                            Sparade inlägg
                        </Typography>
                    </SecondaryButton>
                    <PrimaryButton
                        sx={{
                            gridColumn: "1 / -1",
                            height: 40
                        }}
                        onClick={logout}
                    >
                        <Typography
                            variant="body2"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                            <LogoutOutlinedIcon fontSize="small" sx={{ color: 'var(--button-primary-text)' }} />
                            Logga ut
                        </Typography>
                    </PrimaryButton>
                </Box>
            </Box>
        </ClickAwayListener>
    );
};

export default ProfileBar;