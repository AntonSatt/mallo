import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import PrimaryButton from "../../../design/buttons/PrimaryButton";
import SecondaryButton from "../../../design/buttons/SecondaryButton";
import ageValidation from "../../../assets/images/ageValidation.png"
import { useNavigate } from "react-router-dom";
import InputField from "../../../design/input/InputField";
import InputAdornment from "@mui/material/InputAdornment";
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import {
    Dialog,
    DialogContent,
    DialogContentText,
    IconButton,
} from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// Step 2 of registration: Handles user verification by collecting full name and SSN, 
// ensuring the user meets the 18+ age requirement.
const Step2 = ({ formData, handleChange, onNext, error }) => {
    const navigate = useNavigate();
    const [openAlert, setOpenAlert] = useState(false);

    /**
     * Calculates age from SSN and triggers an alert if the user is under 18.
     * Otherwise, proceeds to the next step.
     */
    const handleValidateAge = () => {
        const cleanSsn = formData.ssn.replace(/\D/g, '');

        // Extract year, month, and day from the cleaned string (expects YYYYMMDD...)
        const year = parseInt(cleanSsn.substring(0, 4));
        const month = parseInt(cleanSsn.substring(4, 6)) - 1;
        const day = parseInt(cleanSsn.substring(6, 8));

        const birthDate = new Date(year, month, day);
        const today = new Date();

        //Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            setOpenAlert(true);
        } else {
            onNext();
        }
    };

    return (
        <Box container className="register-step2" spacing={0}>

            <Typography variant="body1" sx={{ mb: 3 }}>I vårt community är alla {" "}
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>verifierade</span>{" "}
                för att skapa en tryggare plats
            </Typography>

            <Typography variant="body2" sx={{ mt: 0 }}>Fullständigt namn</Typography>

            <InputField
                fullWidth
                id="fullName"
                placeholder="Förnamn Efternamn"
                value={formData.fullName}
                onChange={handleChange}
                error={!!error.fullName}
                helperText={error.fullName}
                sx={{
                    "& .MuiOutlinedInput-input": {
                        textAlign: "center",
                        paddingLeft: "40px",
                    },
                    "& .MuiOutlinedInput-root": {
                        height: 40,
                        borderRadius: 20,
                    },

                }}
            />

            <Typography variant="body2" sx={{ mt: 2 }}>Personnummer</Typography>

            <InputField
                fullWidth
                id="ssn"
                placeholder="ÅÅÅÅMMDD"
                value={formData.ssn}
                onChange={handleChange}
                error={!!error.ssn}
                helperText={error.ssn}
                sx={{
                    "& .MuiOutlinedInput-input": {
                        textAlign: "center",
                        paddingLeft: "40px",
                    },
                    "& .MuiOutlinedInput-root": {
                        height: 40,
                        borderRadius: 20,
                    },

                }}
            />

            <Typography variant="body2" sx={{ mt: 1 }}>Varför efterfrågas dessa uppgifter?</Typography>
            <Typography variant="body2" sx={{ mb: 1 }} style={{ fontWeight: 700 }}>
                Läs mer om verifieringen {" "}
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>här</span>{" "}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, width: "100%", mt: 3 }}>

                <SecondaryButton onClick={() => navigate("/")}>
                    Avsluta
                </SecondaryButton>

                <PrimaryButton onClick={handleValidateAge} startIcon={<VerifiedOutlinedIcon sx={{ color: "white" }} />}>
                    Verifiera
                </PrimaryButton>

            </Box>
            <Dialog
                open={openAlert}
                onClose={() => setOpenAlert(false)}
                sx={{
                    "& .MuiPaper-root": {
                        borderRadius: "30px",
                        overflow: "hidden",
                        padding: "10px"
                    }
                }}
            >
                <IconButton
                    onClick={() => setOpenAlert(false)}
                    sx={{
                        position: 'absolute',
                        right: 12,
                        top: 12,
                        color: 'var(--color-primary)',
                        zIndex: 1,
                    }}
                >
                    <CancelOutlinedIcon sx={{ fontSize: '30px' }} />
                </IconButton>
                <DialogContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}

                >
                    <img
                        src={ageValidation}
                        alt="Åldersgräns"
                        style={{ width: '60%', height: 'auto', marginBottom: '20px' }}
                    />
                    <DialogContentText>
                        Så fint att du vill vara med i vårt community! <br />
                        {" "}
                        <span style={{ fontWeight: 700 }}>Tyvärr har vi 18-års gräns.</span>{" "}
                    </DialogContentText>
                    <DialogContentText sx={{ mt: 1 }}>
                        Prata gärna med våran {" "}
                        <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>kundtjänst</span>{" "}<br />
                        om du har frågor.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Step2;