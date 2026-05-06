import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import hold1 from "../../assets/images/hold1.png";
import heartRed from "../../assets/icons/heartRed.svg";
import heartPink from "../../assets/icons/heartPink.svg";
import heartYellow from "../../assets/icons/heartYellow.svg";
import PrimaryButton from "../../design/buttons/PrimaryButton";
import SecondaryButton from "../../design/buttons/SecondaryButton";
import HoldingHands2 from "../../assets/images/holdingHands2.png";
import useViewport from "../../hooks/useViewport";
import heartMiniRed from "../../assets/icons/heartMiniRed.svg";
import heartPinkRight from "../../assets/icons/heartPinkRight.svg";
import heartRedBottom from "../../assets/icons/heartRedBottom.svg";
import "./LandingPage.css";

const LandingPage = () => {
    const navigate = useNavigate();
    const { isMobile, isDesktop } = useViewport();

    return (
        <Grid container direction='column' className="landing-container">

            <Grid item xs={12} md={6} className="landing-picture">
                {isMobile ? (
                    <Box className="landing-image-wrapper">
                        <img src={hold1} alt="Holding hands" className="landing-image" />
                    </Box>
                ) : (
                    <Box>
                        <img src={HoldingHands2} alt="Holding hands" className="landing-image" />
                    </Box>
                )}
            </Grid>

            <Grid item xs={12} md={6} className="landing-page">

                <Box className="landing-content">
                    <Typography variant="h3" sx={{ mt: 0, mb: 1 }}>
                        Hej!
                    </Typography>

                    <Typography variant="h6">
                        Välkommen, vi är så <br />
                        glada att{" "}
                        <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>du</span>{" "}
                        är här!
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 5 }}>
                        Har du redan ett konto?
                    </Typography>

                    <PrimaryButton
                        sx={{ maxWidth: 280, mt: 1 }}
                        onClick={() => navigate("/login")}
                    >
                        Logga in med E-post
                    </PrimaryButton>

                    <Typography variant="body2" sx={{ mt: 5 }}>
                        Vill du också bli medlem i vårt community?
                    </Typography>

                    <SecondaryButton
                        startIcon={<ControlPointOutlinedIcon sx={{ color: "var(--color-primary)" }} />}
                        sx={{ maxWidth: 200, mt: 1 }}
                        onClick={() => navigate("/register")}
                    >
                        Skapa konto
                    </SecondaryButton>
                </Box>
            </Grid>

            {isDesktop ? (
                <>
                    <Box component="img" src={heartMiniRed} className="heart" id="mini-red-heart" />
                    <Box component="img" src={heartPinkRight} className="heart" id="heart-pink-right" />
                    <Box component="img" src={heartRedBottom} className="heart" id="heart-red-bottom" />
                    <Box component="img" src={heartPink} className="heart" id="heart-pink" />
                    <Box component="img" src={heartYellow} className="heart" id="heart-yellow" />
                    <Box component="img" src={heartPink} className="heart" id="heart-mini-pink-right" />
                    <Box component="img" src={heartYellow} className="heart" id="heart-yellow-right" />
                </>
            ) : (
                <>
                    <Box component="img" src={heartRed} className="heart" id="heart-red-left" />
                    <Box component="img" src={heartPink} className="heart" id="heart-pink" />
                    <Box component="img" src={heartYellow} className="heart" id="heart-yellow" />
                </>
            )}
        </Grid>
    );
}
export default LandingPage;
