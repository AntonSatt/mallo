import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '../../assets/icons/home.svg'
import MapIcon from '../../assets/icons/map.svg'
import MessageIcon from '../../assets/icons/message.svg'
import UserIcon from '../../assets/icons/user.svg'
import useViewport from '../../hooks/useViewport';

const NavIcon = ({ src, alt }) => (
    <div className="icon-container">
        <div className="icon-ball">
            <img src={src} alt={alt} />
        </div>
    </div>
);
const Navbar = () => {
    const navigate = useNavigate();
    const { isDesktop } = useViewport();
    const { pathname } = useLocation();

    const desktopSxStyle = {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "secondary.main",
        borderRadius: "0px 0px 20px 20px",
        overflow: "visible",
        border: "1px solid var(--color-border-light)",
        maxWidth: "var(--content-width-desktop)",
        width: "100%",
        margin: "0 auto",
    }

    const mobileSxStyle = {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "secondary.main",
        borderRadius: "20px 20px 0 0",
        overflow: "visible",
        border: "1px solid var(--color-border-light)",
    }

    return (

        <Paper
            component="nav"
            elevation={0}
            sx={isDesktop ? desktopSxStyle : mobileSxStyle}
        >

            <BottomNavigation
                showLabels={false}
                value={pathname}
                sx={{
                    backgroundColor: "transparent",
                    height: "var(--protected-nav-height)",
                    borderRadius: "35px"
                }}
                onChange={(event, newValue) => navigate(newValue)}>
                <BottomNavigationAction
                    className="navbar-items"
                    value="/forum"
                    icon={<NavIcon src={HomeIcon} alt="home" />}
                />
                <BottomNavigationAction
                    className="navbar-items"
                    key="maps"
                    value="/maps"
                    icon={<NavIcon src={MapIcon} alt="map" />}
                />
                <BottomNavigationAction
                    className="navbar-items"
                    key="message"
                    value="/message"
                    icon={<NavIcon src={MessageIcon} alt="message" />}
                />
                <BottomNavigationAction
                    className="navbar-items"
                    key="settings"
                    value="/settings"
                    icon={<NavIcon src={UserIcon} alt="user" />}
                />
            </BottomNavigation>
        </Paper>
    )
}

export default Navbar;
