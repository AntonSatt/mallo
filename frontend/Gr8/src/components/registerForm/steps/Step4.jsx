import React from 'react';
import { Box, Grid, Typography } from "@mui/material";
import PrimaryButton from "../../../design/buttons/PrimaryButton";

// Step 4 of registration: Sucsess page that redirects you to the app
const Step4 = ({ onContinue }) => {
    return (
        <Grid container className="register-step4">
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: "var(--color-primary)", mb: 2, fontWeight: 700 }}>
                    Välkommen!
                </Typography>
                <Typography variant='h5'>
                    Du är nu en del av <br /> vårt community,<br /> en plats för {" "}
                    <span style={{ color: "var(--color-primary)", fontWeight: 700 }} >vänlighet</span>{" "}<br />
                    och {" "}
                    <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>trygghet</span>{" "}.
                </Typography>

                <PrimaryButton onClick={onContinue} sx={{ mt: 1, height: 50, width: 260 }}>
                    Visa mig appen!
                </PrimaryButton>
            </Box>
        </Grid>
    );
};

export default Step4;
