import { Box, Typography } from "@mui/material";
import PrimaryButton from "../../../design/buttons/PrimaryButton";
import SecondaryButton from "../../../design/buttons/SecondaryButton";
import { useNavigate } from "react-router-dom";
import InputField from "../../../design/input/InputField";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import InputAdornment from "@mui/material/InputAdornment";

// Step 1 of registration: User selects an avatar and sets a username.

const Step1 = ({ formData, handleChange, onNext }) => {
    const navigate = useNavigate();
    return (
        <Box container className="register-step1" spacing={0}>

            <Typography variant="h5" sx={{ mb: 13, mt: 13 }}>Här ska man välja en avatar</Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>Välj ett användarnamn</Typography>

            <InputField
                fullWidth
                id="userName"
                placeholder="Exempelnamn..."
                value={formData.userName}
                onChange={handleChange}
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
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <CreateOutlinedIcon sx={{ color: "var(--color-primary)" }} />
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, width: "100%", mt: 3 }}>

                <SecondaryButton onClick={() => navigate("/")}>
                    Avsluta
                </SecondaryButton>

                <PrimaryButton onClick={onNext}>
                    Nästa
                </PrimaryButton>

            </Box>
        </Box>
    );
};

export default Step1;