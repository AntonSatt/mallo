import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '../../assets/icons/home.svg'
import MapIcon from '../../assets/icons/map.svg'
import MessageIcon from '../../assets/icons/message.svg'
import UserIcon from '../../assets/icons/user.svg'

const NavIcon = ({ src, alt }) => (
    <div className="icon-container">
        <div className="icon-ball">
            <img src={src} alt={alt} />
        </div>
    </div>
);
const Navbar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (

        <Paper
            className="navbar-paper"
            component="nav"
            elevation={0}
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: "secondary.main",
                borderRadius: "15px 15px 0 0",
                overflow: "visible",
                borderTop: "1px solid var(--color-border-light)",

            }}
        >

            <BottomNavigation
                showLabels={false}
                value={pathname}
                sx={{
                    backgroundColor: "transparent",
                    height: "70px",
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