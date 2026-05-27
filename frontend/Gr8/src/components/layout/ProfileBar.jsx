import './ProfileBar.css';
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useOnlineUsers } from "../../contexts/OnlineUsersContext";
import {
    Box,
    Paper,
    Typography,
    Button,
    InputAdornment
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import SearchHeartButton from "../../assets/icons/searchHeartForum.svg";
import Avatar from "../avatar/avatar";
import InputField from '../../design/input/InputField.jsx';

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