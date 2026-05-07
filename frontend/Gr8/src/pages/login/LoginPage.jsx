import LoginForm from '../../components/loginform/LoginForm'
import { Grid, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import SecondaryButton from '../../design/buttons/SecondaryButton';
import holdingHands2 from "../../assets/images/holdingHands2.png";
import hold2 from "../../assets/images/hold2.png";
import Header from "../../components/header/Header";

const LoginPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <Header mobileImage={hold2} desktopImage={holdingHands2} />

            <Grid container className="login-page" spacing={0} >
                <Grid item className="login-content" xs={12} md={6}>
                    <Typography variant="h5" sx={{ mt: 0, mb: 4 }}>
                        Logga in
                    </Typography>
                    <LoginForm />

                    <SecondaryButton
                        sx={{ maxWidth: 200, mt: 3, height: 40 }}
                        onClick={() => navigate("/")}
                    >
                        Avsluta
                    </SecondaryButton>
                </Grid>
            </Grid>
        </>
    )
}

export default LoginPage;