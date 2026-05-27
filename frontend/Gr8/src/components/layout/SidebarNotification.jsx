import { useEffect, useState } from 'react';
import { Box, Stack, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SearchHeartButton from "../../assets/icons/searchHeartForum.svg";
import NotificationRing from "../../assets/icons/notificationRing.svg";
import "./SidebarNotification.css";
import NotificationService from "../../services/NotificationService";
import moment from "moment";
import "moment/locale/sv";

const SidebarNotification = ({ onSearch, isForumPage = false }) => {
    const [postAlignment, setPostAlignment] = useState("all");
    const [activityAlignment, setActivityAlignment] = useState("all");

    const [notifications, setNotifications] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const [showAllPosts, setShowAllPosts] = useState(false);
    const [showAllActivities, setShowAllActivities] = useState(false);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        onSearch?.(value);
    };

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
            await NotificationService.markAsSeen(notificationId);
            setNotifications(prevNotifications =>
                prevNotifications.map(n =>
                    n.id === notificationId ? { ...n, isSeen: true } : n
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const postNotifications = notifications.filter(n => {
        if (n.type === "activity_attended") return false;
        if (postAlignment === "unread") return !n.isSeen;
        return true;
    });

    const visiblePosts = showAllPosts ? postNotifications : postNotifications.slice(0, 3);

    const activityNotifications = notifications
        .filter(n => {
            if (n.type !== "activity_attended") return false;
            if (activityAlignment === "unread") return !n.isSeen;

            if (n.title.includes("börjar om -")) {
                const match = n.title.match(/börjar om -(\d+)/);
                if (match) {
                    const passedMinutes = parseInt(match[1], 10);
                    if (passedMinutes > 60) {
                        return false;
                    }
                }
            }
            return true;
        })
        .map(n => {
            let updatedTitle = n.title;

            if (n.title.includes("börjar om -")) {
                const parts = n.title.split(" börjar ");
                updatedTitle = `${parts[0]} börjar Pågår nu`;
            }

            return {
                ...n,
                title: updatedTitle
            };
        });

    const visibleActivities = showAllActivities ? activityNotifications : activityNotifications.slice(0, 3);

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
                            isSeen: notification.isSeen ?? notification.seen ?? false,
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
                <img
                    src={SearchHeartButton}
                    alt="Sök"
                    className="search-icon"
                />
                <input
                    type="text"
                    placeholder="Sök"
                    className="search-input"
                    value={searchValue}
                    onChange={handleSearchChange}
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
                        {visiblePosts.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-item ${notification.isSeen ? 'seen' : 'unread'}`}
                                onClick={() => handleNotificationClick(notification.id)}
                            >
                                {!notification.isSeen ? <span className="dot" /> : <div className="dot-placeholder" />}

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

                    {postNotifications.length > 3 && (
                        <Typography
                            className="show-all-btn"
                            onClick={() => setShowAllPosts(!showAllPosts)}
                            sx={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                            {showAllPosts ? "Visa färre" : "Visa alla"}
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
                        {visibleActivities.map((notification) => {
                            const parts = notification.title.split(" börjar ");
                            const activityName = parts[0];
                            const restOfText = parts[1] ? ` börjar ${parts[1]}` : "";

                            return (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.isSeen ? 'seen' : 'unread'}`}
                                    onClick={() => handleNotificationClick(notification.id)}
                                >
                                    {!notification.isSeen ? <span className="dot" /> : <div className="dot-placeholder" />}
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography
                                            className="notification-text"
                                            sx={{
                                                fontSize: '0.95rem',
                                                color: notification.isSeen ? '#718096' : '#2D3748',
                                                fontWeight: notification.isSeen ? 400 : 550,
                                                lineHeight: 1.3
                                            }}
                                        >
                                            <span className="highlight">{activityName}</span>
                                            {restOfText.includes("Pågår nu") ? (
                                                <span style={{ fontWeight: 400, color: notification.isSeen ? '#718096' : '#2D3748' }}> pågår nu</span>
                                            ) : (
                                                <span style={{ fontWeight: 400 }}>{restOfText}</span>
                                            )}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#A0AEC0', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {moment(notification.createdAt).fromNow()}
                                        </Typography>
                                    </Box>
                                </div>
                            );
                        })}
                    </Box>

                    {activityNotifications.length > 3 && (
                        <Typography
                            className="show-all-btn"
                            onClick={() => setShowAllActivities(!showAllActivities)}
                            sx={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                            {showAllActivities ? "Visa färre" : "Visa alla"}
                        </Typography>
                    )}
                </Box>
            </Stack>
        </Stack>
    );
};

export default SidebarNotification;