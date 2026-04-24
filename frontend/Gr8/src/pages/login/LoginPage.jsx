import LoginForm from '../../components/loginform/LoginForm'
import { Grid, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import hold2 from "../../assets/images/hold2.png";
import "./LoginPage.css";
import SecondaryButton from '../../design/buttons/SecondaryButton';

const LoginPage = () => {
    const navigate = useNavigate();
    return (
        <Grid container className="login-page" spacing={2} >

            <Grid item className="login-header" xs={12} md={6}>
                <Box className="image-wrapper">
                    <img src={hold2} alt="Holding hands" />
                </Box>
            </Grid>

            <Grid item className="login-content" xs={12} md={6}>
                <Typography variant="h5" sx={{ mt: 5, mb: 4 }}>
                    Logga in med E-post
                </Typography>
                <LoginForm />

                <SecondaryButton
                    sx={{ maxWidth: 200, mt: 2, height: 40 }}
                    onClick={() => navigate("/")}
                >
                    Avsluta
                </SecondaryButton>

            </Grid>

        </Grid>
    )
}

export default LoginPage;