import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import PrimaryButton from "../../../design/buttons/PrimaryButton";
import SecondaryButton from "../../../design/buttons/SecondaryButton";
import notificationBell from "../../../assets/icons/notificationBell.svg"
import { useNavigate } from "react-router-dom";
import InputField from "../../../design/input/InputField";
import InputAdornment from "@mui/material/InputAdornment";
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

// Step 3 of registration: Finalizes account creation by collecting email, password, 
// and handling user consent for terms, privacy policy, and notifications.
const Step3 = ({ formData, handleChange, onNext, error }) => {

    const navigate = useNavigate();
    const [allowNotifications, setAllowNotifications] = useState(false);
    const [approveTerms, setApproveTerms] = useState(false);

    return (
        <Box container className="register-step3" spacing={0}>

            <Typography variant="body2" sx={{ mt: 3 }}>E-post</Typography>

            <InputField
                fullWidth
                id="email"
                placeholder="Exempel@epost.se"
                value={formData.email}
                onChange={handleChange}
                error={!!error.email}
                helperText={error.email}
                sx={{
                    "& .MuiOutlinedInput-input": {
                        textAlign: "center"
                    },
                    "& .MuiOutlinedInput-root": {
                        height: 40,
                        borderRadius: 20,
                    },

                }}
            />

            <Typography variant="body2" sx={{ mt: 2 }}>Lösenord</Typography>

            <InputField
                fullWidth
                id="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                error={!!error.password}
                helperText={error.password}
                type="password"
                sx={{
                    "& .MuiOutlinedInput-input": {
                        textAlign: "center"
                    },
                    "& .MuiOutlinedInput-root": {
                        height: 40,
                        borderRadius: 20,
                    },

                }}
            />

            <Typography variant="body2" sx={{ mt: 2 }}>Bekräfta lösenord</Typography>

            <InputField
                fullWidth
                id="confirmPassword"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!error.confirmPassword}
                helperText={error.confirmPassword}
                type="password"
                sx={{
                    "& .MuiOutlinedInput-input": {
                        textAlign: "center",
                    },
                    "& .MuiOutlinedInput-root": {
                        height: 40,
                        borderRadius: 20,
                    },
                }}
            />
            <Box
                onClick={() => setApproveTerms(!approveTerms)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    cursor: "pointer",
                    userSelect: "none"
                }}
            >
                {approveTerms ? (
                    <CheckCircleIcon sx={{ color: "var(--color-primary)", fontSize: "16px" }} />
                ) : (
                    <CircleOutlinedIcon sx={{ color: "var(--color-primary)", fontSize: "16px", mt: 0.5 }} />
                )}

                <Typography variant="caption" sx={{ mt: 1, mb: 0.5 }}>
                    Jag godkänner {" "}
                    <span style={{ color: "var(--color-primary)" }}>användarvillkoren</span>{" "}
                    och
                    {" "}
                    <span style={{ color: "var(--color-primary)" }}> integritetspolicyn</span>{" "}
                </Typography>
            </Box>

            <Box
                onClick={() => setAllowNotifications(!allowNotifications)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                {allowNotifications ? (
                    <CheckCircleIcon sx={{ color: "var(--color-primary)", fontSize: "16px" }} />
                ) : (
                    <CircleOutlinedIcon sx={{ color: "var(--color-primary)", fontSize: "16px", mb: 0.3 }} />
                )}

                <Typography variant="caption" sx={{ mt: 1, mb: 1 }}>

                    Tillåt notiser i appen
                    <img
                        src={notificationBell}
                        alt=""
                        style={{ verticalAlign: 'middle', marginLeft: '6px', width: '13px', marginBottom: '5px' }}
                    />
                </Typography>
            </Box>


            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, width: "100%", mt: 3 }}>

                <SecondaryButton onClick={() => navigate("/")}>
                    Avsluta
                </SecondaryButton>

                <PrimaryButton onClick={onNext} startIcon={<ControlPointOutlinedIcon sx={{ color: "white" }} />}>
                    Skapa konto
                </PrimaryButton>

            </Box>
        </Box>
    );
};

export default Step3;