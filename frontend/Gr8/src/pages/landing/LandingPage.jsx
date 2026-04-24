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
import "./LandingPage.css";

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <Grid container spacing={2} className="landing-container">

            <Grid item xs={12} md={6} className="landing-picture">
                <Box className="landing-image-wrapper">
                    <img src={hold1} alt="Holding hands" className="landing-image" />
                </Box>
            </Grid>

            <Grid item xs={12} md={6} className="landing-page">

                <Box className="landing-content">
                    <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
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

                <Box component="img" src={heartRed} className="heart-red" />
                <Box component="img" src={heartPink} className="heart-pink" />
                <Box component="img" src={heartYellow} className="heart-yellow" />

            </Grid>
        </Grid>
    );
}
export default LandingPage;
