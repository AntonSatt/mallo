import "../home/HomePage.css";
import useViewport from "../../hooks/useViewport";
import ProfileBar from "../../components/layout/ProfileBar.jsx";
import ProfileHeader from "../../components/layout/ProfileHeader.jsx";
import SidebarCalendar from '../../components/layout/SidebarCalendar.jsx';
import SidebarNotification from "../../components/layout/SidebarNotification.jsx";
import { useEffect, useState } from "react";
import { Stack, Box } from "@mui/material";
import Navbar from "../../components/layout/Navbar.jsx";
import ForumPage from "../forum/ForumPage.jsx";
import ChatPage from '../chat/chatPage/ChatPage';
import Settings from "../settings/SettingsPage.jsx";
import ConversationPage from '../chat/conversationPage/ConversationPage';
import ActivityPage from "../activity/ActivityPage.jsx";
import { useNavigate, useLocation } from 'react-router-dom';

const Homepage = ({ page }) => {
    const { isDesktop } = useViewport();
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const activityIdFromUrl = params.get('activityId');

    const [isOpen, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [markedDates, setMarkedDates] = useState([]);
    const [highlightedActivityId, setHighlightedActivityId] = useState(
        activityIdFromUrl ? parseInt(activityIdFromUrl) : null
    );

    const handleClickOpen = () => setOpen(true);

    const handleMarkedDayClick = (activityId) => {
        setHighlightedActivityId(activityId);
        if (page !== 'maps') {
            navigate(`/maps?activityId=${activityId}`);
        }
    };

    useEffect(() => {
        if (page !== "forum") {
            setSearchQuery("");
        }
    }, [page]);

    return (
        <div className="homepage-container">
            {isDesktop ? (
                <div className="desktop-layout-wrapper">
                    <aside className="sidebar-left">
                        <Stack spacing={2}>
                            <ProfileHeader />
                            <SidebarCalendar
                                showCreate={page === "forum" ? "true" : "false"}
                                onCreatePost={handleClickOpen}
                                markedDates={markedDates}
                                onMarkedDayClick={handleMarkedDayClick}
                            />
                        </Stack>
                    </aside>

                    <main className="main-content">
                        <Stack spacing={"34px"} sx={{ height: "100%", minHeight: 0, minWidth: "var(--content-width-desktop)" }}>
                            <Navbar />
                            {page === "forum" && (
                                <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
                                    <ForumPage openModal={isOpen} setOpenModal={setOpen} searchQuery={searchQuery} />
                                </Box>
                            )}
                            {page === "message" && (
                                <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
                                    <ChatPage />
                                </Box>
                            )}
                            {page === "conversation" && (
                                <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
                                    <ConversationPage />
                                </Box>
                            )}
                            {page== "maps" && (
                                <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
                                    <ActivityPage />
                                </Box>
                            )}
                            {page === "settings" && (
                                <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
                                    <Settings />
                                </Box>
                            )}
                            {page === "maps" && (
                                <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
                                    <ActivityPage
                                        markedDates={markedDates}
                                        onMarkedDatesChange={setMarkedDates}
                                        highlightedActivityId={highlightedActivityId}
                                    />
                                </Box>
                            )}
                        </Stack>
                    </main>

                    <aside className="sidebar-right">
                        <SidebarNotification
                            onSearch={page === "forum" ? setSearchQuery : undefined}
                            isForumPage={page === "forum"}
                        />
                    </aside>
                </div>
            ) : (
                <div className="mobile-layout">
                    {page === "forum" && <ProfileBar showCreate="true" onCreatePost={handleClickOpen} onSearch={setSearchQuery} />}
                    {page === "message" && <ProfileBar showCreate="false" />}
                    {page === "conversation" && <ProfileBar showCreate="false" />}
                    {page === "settings" && <ProfileBar showCreate="false" />}
                    {page === "maps" && <ProfileBar showCreate="false" />}
                    <Navbar />
                    {page === "forum" && <ForumPage openModal={isOpen} setOpenModal={setOpen} searchQuery={searchQuery} />}
                    {page === "message" && <ChatPage />}
                    {page === "conversation" && <ConversationPage />}
                    {page === "settings" && <Settings />}
                    {page === "maps" && (
                        <ActivityPage
                            markedDates={markedDates}
                            onMarkedDatesChange={setMarkedDates}
                            highlightedActivityId={highlightedActivityId}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Homepage;