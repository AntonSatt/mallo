import "../home/HomePage.css";
import useViewport from "../../hooks/useViewport";
import ProfileBar from "../../components/layout/ProfileBar.jsx";
import ProfileHeader from "../../components/layout/ProfileHeader.jsx";
import SidebarCalendar from '../../components/layout/SidebarCalendar.jsx';
import SidebarNotification from "../../components/layout/SidebarNotification.jsx";
import { useState } from "react";
import { Stack, Box } from "@mui/material";
import Navbar from "../../components/layout/Navbar.jsx";
import ForumPage from "../forum/ForumPage.jsx";
import ChatPage from '../chat/chatPage/ChatPage';
import Settings from "../settings/SettingsPage.jsx";
import ConversationPage from '../chat/ConversationPage';

const Homepage = ({ page }) => {
    const { isDesktop } = useViewport();
    const [isOpen, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <div className="homepage-container">
            {isDesktop ? (
                <div className="desktop-layout-wrapper">
                    <aside className="sidebar-left">
                        <Stack spacing={2}>
                            <ProfileHeader />
                            <SidebarCalendar showCreate="true" onCreatePost={handleClickOpen}/>
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
                            {page === "settings" && (
                                <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
                                    <Settings />
                                </Box>
                            )}
                        </Stack>
                    </main>

                    <aside className="sidebar-right">
                        <SidebarNotification onSearch={setSearchQuery} />
                    </aside>
                </div>
            ) : (
                <div className="mobile-layout">
                    {page === "forum" && <ProfileBar showCreate="true" onCreatePost={handleClickOpen} onSearch={setSearchQuery} />}
                    {page === "message" && <ProfileBar showCreate="false" />}
                    {page === "conversation" && <ProfileBar showCreate="false" />}
                    {page === "settings" && <ProfileBar showCreate="false" />}
                    <Navbar />
                    {page === "forum" && <ForumPage openModal={isOpen} setOpenModal={setOpen} searchQuery={searchQuery} />}
                    {page === "message" && <ChatPage />}
                    {page === "conversation" && <ConversationPage />}
                    {page === "settings" && <Settings />}
                </div>
            )}
        </div>
    );
};

export default Homepage;