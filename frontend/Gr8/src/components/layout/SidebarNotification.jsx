import { useEffect, useState } from 'react';
import { Box, Stack, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SearchHeartButton from "../../assets/icons/searchHeartForum.svg";
import NotificationRing from "../../assets/icons/notificationRing.svg";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import "./SidebarNotification.css";
import NotificationService from "../../services/NotificationService";
import moment from "moment";
import "moment/locale/sv";

const SidebarNotification = ({ onSearch }) => {
    const [postAlignment, setPostAlignment] = useState("all");
    const [activityAlignment, setActivityAlignment] = useState("all");

    const [notifications, setNotifications] = useState([]);
    const [showAllNotifications, setShowAllNotifications] = useState(false);

    const handleActivityChange = (event, newAligment) => {
        if (newAligment) {
            setActivityAlignment(newAligment);
        }
    };

    const handlePostChange = (event, newAlignment) => {
        if (newAlignment) {
            setPostAlignment(newAlignment);
        }
    };

    const handleNotificationClick = async (notificationId) => {
        try {
            setNotifications(prevNotifications =>
                prevNotifications.map(n =>
                    n.id === notificationId ? { ...n, isSeen: true } : n
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        if (postAlignment === "unread") {
            return !notification.isSeen;
        }
        return true;
    });

    const visibleNotifications = showAllNotifications ? filteredNotifications : filteredNotifications.slice(0, 3);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const notificationResult = await NotificationService.getAll();
                let allNotifications = [];

                if (Array.isArray(notificationResult)) {
                    allNotifications = notificationResult.map((notification) => {
                        return {
                            id: notification.id,
                            type: notification.type,
                            title: notification.title,
                            isSeen: false,
                            createdAt: notification.createdAt
                        };
                    });
                }
                setNotifications(allNotifications);
            }
            catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <Stack className="notification-wrapper">
            <Box className="search-bar">
                <img src={SearchHeartButton} alt="Sök" className="search-icon" />
                <input type="text" placeholder="Sök" className="search-input" />
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
                            onChange={handlePostChange}
                            className="card-toggle-group"
                        >
                            <ToggleButton value="all" className="card-toggle-btn">Alla</ToggleButton>
                            <ToggleButton value="unread" className="card-toggle-btn">Olästa</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box className="card-body-placeholder">
                        {visibleNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={"notification-item ${notification.isSeen ? 'seen' : 'unread'}"}
                                onClick={() => handleNotificationClick(notification.id)}
                            >
                                {!notification.isSeen ? (
                                    <span className="dot" />
                                ) : (
                                    <div className="dot-placeholder" />
                                )}

                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography
                                        className="notification-text"
                                        sx={{
                                            color: notification.isSeen ? '#718096' : '#2D3748',
                                            fontSize: '0.95rem',
                                            fontWeight: notification.isSeen ? 400 : 550,
                                            lineHeight: 1.3
                                        }}
                                    >
                                        {notification.type === "comment_created" && (
                                            <>En ny kommentar på <span className="highlight">{notification.title}</span></>
                                        )}
                                        {notification.type === "comment_hugged" && (
                                            <>Kommentaren på inlägg <span className="highlight">{notification.title}</span> har fått en kram</>
                                        )}
                                        {notification.type === "post_hugged" && (
                                            <><span className="highlight">{notification.title}</span> har fått en kram</>
                                        )}
                                    </Typography>

                                    <Typography variant="caption" sx={{ color: '#A0AEC0', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {moment(notification.createdAt).fromNow()}
                                    </Typography>
                                </Box>
                            </div>
                        ))}
                    </Box>

                    {filteredNotifications.length > 3 && (
                        <Typography
                            className="show-all-btn"
                            onClick={() => setShowAllNotifications(!showAllNotifications)}
                            sx={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                            {showAllNotifications ? "Visa färre" : "Visa alla"}
                        </Typography>
                    )}
                </Box>

                <Box className="notification-card content-card">
                    <Box className="card-header-row">
                        <Typography className="card-title">Aktiviteter</Typography>

                        <ToggleButtonGroup
                            value={activityAlignment}
                            exclusive
                            onChange={handleActivityChange}
                            className="card-toggle-group"
                        >
                            <ToggleButton value="all" className="card-toggle-btn">Alla</ToggleButton>
                            <ToggleButton value="unread" className="card-toggle-btn">Olästa</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box className="card-body-placeholder">
                        <div className="notification-item unread">
                            <span className="dot" />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ fontSize: '0.95rem', color: '#2D3748', fontWeight: 550 }}>
                                    <span className="highlight">Loppis - Säljsugen?</span> börjar om 30 min
                                </Typography>
                            </Box>
                        </div>
                    </Box>

                    <Typography className="show-all-btn">Visa alla</Typography>
                </Box>
            </Stack>
        </Stack>
    );
};

export default SidebarNotification;