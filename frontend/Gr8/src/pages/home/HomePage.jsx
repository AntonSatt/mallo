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

const Homepage = ({ page }) => {
    const { isDesktop } = useViewport();
    const [isOpen, setOpen] = useState(false);

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
                            <SidebarCalendar />
                        </Stack>
                    </aside>

                    <main className="main-content">
                        <Stack spacing={2} sx={{ height: "100%", minHeight: 0 }}>
                            <Navbar />
                            {page === "forum" && (
                                <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
                                    <ForumPage openModal={isOpen} setOpenModal={setOpen} />
                                </Box>
                            )}
                        </Stack>
                    </main>

                    <aside className="sidebar-right">
                        <SidebarNotification />
                    </aside>
                </div>
            ) : (
                <div className="mobile-layout">
                    {page === "forum" && <ProfileBar showCreate="true" onCreatePost={handleClickOpen} />}
                    {page === "message" && <ProfileBar showCreate="false" />}
                    <Navbar />
                    {page === "forum" && <ForumPage openModal={isOpen} setOpenModal={setOpen} />}
                </div>
            )}
        </div>
    );
};

export default Homepage;