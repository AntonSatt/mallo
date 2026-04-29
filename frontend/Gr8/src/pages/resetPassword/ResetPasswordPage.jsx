import react, {useState} from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import PrimaryButton from "../../design/buttons/PrimaryButton";
import InputField from "../../design/input/InputField";
import InputAdornment from "@mui/material/InputAdornment";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import PasswordServices from "../../services/PasswordServices";

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!newPassword || !confirmPassword) {
            setError("Alla fält måste vara ifyllda.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Lösenorden matchar inte.");
            return;
        }

        try {
            await PasswordServices.resetPassword(token, newPassword);

            navigate('/login');
        } 
       
        catch (error) {
            setError("Ett fel uppstod vid återställning av lösenord.");
        }
    };

    if (!token) {
        return (
            <Grid container direction="column" spacing={2}>
                <Typography variant="h6">Ogiltig återställningslänk</Typography>
                <Typography variant="body1">Länken du följde är inte längre giltig.</Typography>
            </Grid>
        );
    }


    return (
        <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Typography variant="h6" align="center">
                        Ange ditt nya lösenord
                    </Typography>
                    <InputField
                        fullWidth
                        type="password"
                        label="Nytt lösenord"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <InputField
                        fullWidth
                        type="password"
                        label="Bekräfta nytt lösenord"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Grid>
                {error && (
                    <Grid item>
                        <Typography color="error">{error}</Typography>
                    </Grid>
                )}
                <Grid item>
                    <PrimaryButton type="submit" fullWidth>
                        Återställ lösenord
                    </PrimaryButton>
                </Grid>
            </Grid>
        </form>
    );
}

export default ResetPasswordPage;