import { Box, Grid } from "@mui/material";
import useViewport from "../../hooks/useViewport";
import "./Header.css";

const Header = ({ desktopImage, mobileImage }) => {
    const { isMobile } = useViewport();
    const imageSrc = isMobile ? mobileImage : desktopImage;

    return (
        <Grid className="header-picture">
            <Box className="header-image-wrapper">
                <img src={imageSrc} alt="Holding hands" className="header-image" />
            </Box>
        </Grid>
    );
}

export default Header;
