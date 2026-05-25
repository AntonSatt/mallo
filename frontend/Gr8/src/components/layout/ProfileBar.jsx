import './ProfileBar.css';
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useOnlineUsers } from "../../contexts/OnlineUsersContext";
import {
    Box,
    Paper,
    Typography,
    Button,
    ClickAwayListener,
    InputAdornment
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import EventIcon from '@mui/icons-material/Event';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import SearchHeartButton from "../../assets/icons/searchHeartForum.svg";
import HamburgerMenu from './HamburgerMenu';
import PrimaryButton from "../../design/buttons/PrimaryButton";
import SecondaryButton from "../../design/buttons/SecondaryButton";
import Avatar from "../avatar/avatar";
import InputField from '../../design/input/InputField.jsx';

// this is the profile bar that appears at the top of the forum page. It shows the user's avatar and name, 
// and has a hamburger menu on the right side. The hamburger menu contains options for viewing badges, 
// activities, gifts, saved posts, and logging out. The profile bar also has an optional "create post" 
// input that looks like a text field but works as a button to open the post creation dialog. This input is 
// only shown when the showCreate prop is true.
const ProfileBar = ({ showCreate = false, onCreatePost, onSearch }) => {
    const { currentUser, logout } = useAuth();
    const { isUserOnline } = useOnlineUsers();
    const isOnline = isUserOnline(currentUser?.sub);

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        onSearch?.(e.target.value);
    };

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <Box className="profilebar-wrapper">
                <Paper className={`profilebar-container ${showCreate ? "forum-profilebar" : ""}`}>
                    {showCreate === "true" ? (
                        <>
                            <Box className="profilebar-top-row">
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

                            <Box className="profilebar-right">
                                <HamburgerMenu
                                    open={menuOpen}
                                    onToggle={toggleMenu}
                                />
                            </Box>
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

                            <Box className="profilebar-right">
                                <HamburgerMenu
                                    open={menuOpen}
                                    onToggle={toggleMenu}
                                />
                            </Box>
                        </>
                    )}
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