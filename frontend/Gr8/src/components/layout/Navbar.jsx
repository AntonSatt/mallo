import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import {Paper, BottomNavigation, BottomNavigationAction} from '@mui/material';
import HomeIcon from '../../assets/icons/home.svg'
import MapIcon from '../../assets/icons/map.svg'
import MessageIcon from '../../assets/icons/message.svg'
import UserIcon from '../../assets/icons/user.svg'

const NavIcon = ({src, alt}) => (
    <div className="icon-container">
        <div className="icon-ball">
            <img src={src} alt={alt}/>
        </div>
    </div>
);
const Navbar = () => {
    const navigate = useNavigate();

    const [value, setValue] = useState(0);


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
                value={value}
                sx={{
                    backgroundColor: "transparent",
                    height: "70px",
                    borderRadius: "35px"
                }}
                onChange={(event, newValue) => (
                    setValue(newValue)
                   
                )}>
                <BottomNavigationAction
                    className="navbar-items"
                    icon={<NavIcon src={HomeIcon} alt="home" />} 
                    onClick={() => navigate("/forum")}
                />
                <BottomNavigationAction
                    className="navbar-items"
                    key="maps"
                    icon={<NavIcon src={MapIcon} alt="map" />}
                    onClick={() => navigate("/maps")}
                />
                <BottomNavigationAction
                    className="navbar-items"
                    key="message"
                    icon={<NavIcon src={MessageIcon} alt="message"/>}
                    onClick={() => navigate("/message")}
                />
                <BottomNavigationAction
                    className="navbar-items"
                    key="settings"
                    icon={<NavIcon src={UserIcon} alt="user"/>}
                    onClick={() => navigate("/settings")}
                />
            </BottomNavigation>
        </Paper>
    )
}

export default Navbar;