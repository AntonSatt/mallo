import { useState } from 'react';
import { Box, Stack, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SearchHeartButton from "../../assets/icons/searchHeartForum.svg";
import NotificationRing from "../../assets/icons/notificationRing.svg";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import "./SidebarNotification.css";

const SidebarNotification = () => {
    const [postAlignment, setPostAlignment] = useState("all");
    const [activityAlignment, setActivityAlignment] = useState("all");

    const handleChange = (event, newAligment) => {
    if (newAligment) {
        setActivityAlignment(newAligment);
    }
};

    return (
        <Stack className="notification-wrapper">
            <Box className="search-bar">
                <img
                    src={SearchHeartButton}
                    alt="Sök"
                    className="search-icon"
                />
                <input
                    type="text"
                    placeholder="Sök"
                    className="search-input"
                />
            </Box>

            <Stack className="notification-box">
                <Box className="notification-header">
                    <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div className="notification-icon-wrapper">
                            <img src={NotificationRing} alt="" className="header-icon" />
                        </div>
                        <Typography className="header-title">Notifikationer</Typography>
                    </Box>
                    <MoreHorizIcon sx={{ color: "#ccc", cursor: "pointer" }} />
                </Box>
                
                <Box className="notification-card content-card">
                    <Box className="card-header-row">
                        <Typography className="card-title">Inlägg</Typography>
                        
                        <ToggleButtonGroup
                            value={postAlignment}
                            exclusive
                            onChange={handleChange}
                            className="card-toggle-group"
                        >
                            <ToggleButton value="all" className="card-toggle-btn">Alla</ToggleButton>
                            <ToggleButton value="unread" className="card-toggle-btn">Olästa</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box className="card-body-placeholder">
                        <div className="notification-item unread-item">
                            <span className="dot"></span>
                            <p>En ny kommentar på <span className="highlight">Min hund är rädd för...</span></p>
                        </div>
                    </Box>
                    
                    <Typography className="visa-alla-btn">Visa alla</Typography>
                </Box>

                <Box className="notification-card content-card">
                    <Box className="card-header-row">
                        <Typography className="card-title">Aktiviteter</Typography>
                        
                        <ToggleButtonGroup
                            value={activityAlignment}
                            exclusive
                            onChange={handleChange}
                            className="card-toggle-group"
                        >
                            <ToggleButton value="all" className="card-toggle-btn">Alla</ToggleButton>
                            <ToggleButton value="unread" className="card-toggle-btn">Olästa</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box className="card-body-placeholder">
                        <div className="notification-item">
                            <span className="dot"></span>
                            <p><span className="highlight">Loppis - Säljsugen?</span> börjar om 30 min</p>
                        </div>
                    </Box>

                    <Typography className="show-all-btn">Visa alla</Typography>
                </Box>
            </Stack>
        </Stack>
    );
};

export default SidebarNotification;