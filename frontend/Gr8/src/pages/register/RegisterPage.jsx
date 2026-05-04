import React from 'react'
import { useState } from "react";
import ProgressBar from "../../design/progressBar/ProgressBar";
import { Grid, Box, Typography } from "@mui/material";
import RegisterForm from "../../components/registerForm/RegisterForm";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";
import Step4 from "../../components/registerForm/steps/Step4";
import hold1 from "../../assets/images/hold1.png";
import hold2 from "../../assets/images/hold2.png";
import hold3 from "../../assets/images/hold3.png";
import groupPhoto from "../../assets/images/groupPhoto.png";


// Registration Page: A layout wrapper that manages step state, 
// dynamic image & title rendering, and navigation between form stages.
const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const stepTitles = ["Profil", "Personuppgifter", "Kontouppgifter"];

    const getImageForStep = (step) => {
        switch (step) {
            case 1: return hold1;
            case 2: return hold2;
            case 3: return hold3;
            default: return hold1;
        }
    };

    if (step === 4) {
        return (
            <Box className="success-page">
                <Step4 onContinue={() => navigate("/forum")} />
                <img src={groupPhoto} alt="Group of people holding eachother" className='group-photo' />
            </Box>
        );
    }

    return (
        <main>
            <Grid container className="register-container">

                <Grid item xs={12} md={6} className="register-picture">
                    <Box className="register-image-wrapper">
                        <img
                            src={getImageForStep(step)}
                            alt={`Step ${step}`}
                            className="register-image"
                        />
                    </Box>
                </Grid>
                <Grid className="register-page" item xs={12} md={6}>
                    <Box className="register-content">
                        <Typography variant="h4" >
                            Skapa konto
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2, color: "var(--color-text-main)" }}>
                            {stepTitles[step - 1]}
                        </Typography>
                        <ProgressBar activeStep={step - 1} onStepClick={(s) => setStep(s + 1)} sx={{ mt: 2 }} />

                        <RegisterForm step={step} setStep={setStep} />
                    </Box>
                </Grid>
            </Grid>
        </main>
    );
};

export default RegisterPage;