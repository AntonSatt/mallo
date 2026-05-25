import { Box, Typography } from "@mui/material";
import PrimaryButton from "../../../design/buttons/PrimaryButton";
import SecondaryButton from "../../../design/buttons/SecondaryButton";
import { useNavigate } from "react-router-dom";
import InputField from "../../../design/input/InputField";
import InputAdornment from "@mui/material/InputAdornment";
import AvatarSlider from "../../../components/avatar/avatarSlider.jsx"
import useViewport from "../../../hooks/useViewport";

// Step 1 of registration: User selects an avatar and sets a username.
const Step1 = ({ formData, handleChange, onNext, error }) => {
    const navigate = useNavigate();
    const { isDesktop } = useViewport();

    return (
        <Box className="register-step1">

            <AvatarSlider formData={formData} handleChange={handleChange} mt={isDesktop ? 2.5 : 5} mb={2} />

            <Typography variant="body2" sx={{ mb: 1 }}>Välj ett användarnamn</Typography>

            <InputField
                fullWidth
                id="userName"
                placeholder="Exempelnamn..."
                value={formData.userName}
                onChange={handleChange}
                error={!!error.userName}
                helperText={error.userName}
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

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, width: "100%", mt: 3 }}>

                <SecondaryButton onClick={() => navigate("/")}>
                    Avsluta
                </SecondaryButton>

                <PrimaryButton onClick={onNext} disabled={!formData.avatar || formData.avatar === 0}>
                    Nästa
                </PrimaryButton>

            </Box>
        </Box>
    );
};

export default Step1;