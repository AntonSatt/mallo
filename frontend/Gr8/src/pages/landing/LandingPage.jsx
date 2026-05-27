import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import heartRed from "../../assets/icons/heartRed.svg";
import heartPink from "../../assets/icons/heartPink.svg";
import heartYellow from "../../assets/icons/heartYellow.svg";
import PrimaryButton from "../../design/buttons/PrimaryButton";
import SecondaryButton from "../../design/buttons/SecondaryButton";
import useViewport from "../../hooks/useViewport";
import heartMiniRed from "../../assets/icons/heartMiniRed.svg";
import heartPinkRight from "../../assets/icons/heartPinkRight.svg";
import heartRedBottom from "../../assets/icons/heartRedBottom.svg";
import hold1 from "../../assets/images/hold1.png";
import holdingHands2 from "../../assets/images/holdingHands2.png";
import Header from "../../components/header/Header";
import "./LandingPage.css";

const LandingPage = () => {
    const navigate = useNavigate();
    const { isDesktop } = useViewport();

    return (
        <>
            <Header mobileImage={hold1} desktopImage={holdingHands2} />

            <Grid container direction='column' className="landing-container">
                <Grid className="landing-page">
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

                        <Typography variant="body2" sx={{ mt: 3 }}>
                            Har du redan ett konto?
                        </Typography>

                        <PrimaryButton
                            sx={{ maxWidth: 280, mt: 1 }}
                            onClick={() => navigate("/login")}
                        >
                            Logga in med E-post
                        </PrimaryButton>

                        <Typography variant="body2" sx={{ mt: 2 }}>
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
                        <Box component="img" src={heartMiniRed} className="heart" id="heart-red-desktop-right-small" />
                        <Box component="img" src={heartPinkRight} className="heart" id="heart-pink-desktop-right-edge" />
                        <Box component="img" src={heartRedBottom} className="heart" id="heart-red-desktop-bottom-left" />
                        <Box component="img" src={heartPink} className="heart" id="heart-pink-desktop-left-mid" />
                        <Box component="img" src={heartYellow} className="heart" id="heart-yellow-desktop-left-low" />
                        <Box component="img" src={heartPink} className="heart" id="heart-pink-desktop-right-small" />
                        <Box component="img" src={heartYellow} className="heart" id="heart-yellow-desktop-right-mid" />
                    </>
                ) : (
                    <>
                        <Box component="img" src={heartRed} className="heart" id="heart-red-mobile-left" />
                        <Box component="img" src={heartPink} className="heart" id="heart-pink-mobile-left-mid" />
                        <Box component="img" src={heartYellow} className="heart" id="heart-yellow-mobile-left-low" />
                    </>
                )}
            </Grid>
        </>
    );
}
export default LandingPage;
