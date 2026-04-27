import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import './HamburgerMenu.css';

const HamburgerMenu = ({ open, onToggle }) => {

    return (
        <IconButton onClick={onToggle} className="hamburger-button">
            {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
    );
};

export default HamburgerMenu;