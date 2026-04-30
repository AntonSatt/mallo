import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    ClickAwayListener,
    InputAdornment
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
import Avatar from "../avatar/avatar";
import InputField from '../../design/input/InputField.jsx';
import ControlPointIcon from "@mui/icons-material/ControlPoint";

// this is the profile bar that appears at the top of the forum page. It shows the user's avatar and name, 
// and has a hamburger menu on the right side. The hamburger menu contains options for viewing badges, 
// activities, gifts, saved posts, and logging out. The profile bar also has an optional "create post" 
// input that looks like a text field but works as a button to open the post creation dialog. This input is 
// only shown when the showCreate prop is true.
const ProfileBar = ({ showCreate = false, onCreatePost }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { currentUser, logout } = useAuth();

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <Box className="profilebar-wrapper">
                <Paper className="profilebar-container">
                    <Box className="profilebar-left">
                        <Avatar avatar={currentUser?.picture} />
                    </Box>

                    {/* Render a "create post" input (looks like a text field but works as a button).
                    Clicking it calls onCreatePost to open the post creation dialog.
                    Only shown when showCreate is true.*/}
                    {showCreate ? (
                        <Box className="profilebar-create">
                            <InputField
                                fullWidth
                                placeholder="Skapa..."
                                onClick={onCreatePost}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ControlPointIcon className="profilebar-create-icon" />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Box>
                    ) : (
                        <Typography className="profile-name">
                            {currentUser?.preferred_username || currentUser?.email || "Användarnamn saknas"}
                        </Typography>
                    )}

                    <Box className="profilebar-right">
                        <HamburgerMenu
                            open={menuOpen}
                            onToggle={toggleMenu}
                        />
                    </Box>
                </Paper>

                {/* this is the menu that opens when clicking the hamburger menu. It contains options for viewing badges, 
                activities, gifts, saved posts, and logging out. The menu is styled as a grid with two columns, 
                and it becomes visible when menuOpen is true. Each option is a button with an icon and text. 
                The logout button calls the logout function from the useAuth hook when clicked. */} 
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