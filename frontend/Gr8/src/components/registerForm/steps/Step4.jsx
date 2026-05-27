import React from 'react';
import { Box, Typography } from "@mui/material";
import PrimaryButton from "../../../design/buttons/PrimaryButton";
import mallo from "../../../assets/images/Mallo.png";
import groupPhoto from "../../../assets/images/groupPhoto.png";

const Step4 = ({ onContinue }) => {
    return (
        <Box 
            className="register-step4" 
            sx={{ 
                overflow: "hidden", 
                display: "flex", 
                justifyContent: "space-between", 
                pt: 2
            }}
        >
            <Box sx={{ 
                textAlign: "center", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                mt: -4 
            }}>
                <img 
                    src={mallo} 
                    alt="Mallo" 
                    style={{ 
                        width: "200px", 
                        height: "auto", 
                        marginBottom: "10px" 
                    }} 
                />

                <Typography variant="h4" sx={{ color: "var(--color-primary)", mb: 1, fontWeight: 700 }}>
                    Välkommen!
                </Typography>
                
                <Typography variant='h5' sx={{ px: 2, mb: 2 }}>
                    Du är nu en del av vårt community. <br />
                    Mallo är en plats för <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>vänlighet</span> och <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>trygghet</span>.
                </Typography>

                <PrimaryButton 
                    onClick={onContinue} 
                    sx={{ 
                        height: 50, 
                        width: 260, 
                        fontSize: "1.2rem", 
                        fontWeight: 600, 
                        textTransform: "none" 
                    }}
                >
                    Visa mig Mallo
                </PrimaryButton>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 0 }}>
                <img 
                    src={groupPhoto} 
                    alt="Community" 
                    style={{ 
                        width: "100%", 
                        maxWidth: "400px", 
                        height: "auto", 
                        display: "block" 
                    }} 
                />
            </Box>
        </Box>
    );
};

export default Step4;