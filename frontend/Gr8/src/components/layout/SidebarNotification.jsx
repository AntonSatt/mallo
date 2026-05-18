import { Box, InputBase, Stack } from "@mui/material"
import SearchHeartButton from "../../assets/icons/searchHeartForum.svg";
import NotificationRing from "../../assets/icons/notificationRing.svg";
import "./SidebarNotification.css";

const SidebarNotification = () => {

    return (
        <Stack className="notification-wrapper" spacing={2}>

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
                    <img src={NotificationRing} alt="" className="header-icon" />
                    Notifikationer
                </Box>
                <Box className="notification-card">
                    Inlägg
                </Box>
                <Box className="notification-card">
                    Aktiviteter
                </Box>
            </Stack>
        </Stack>

    )
};

export default SidebarNotification;