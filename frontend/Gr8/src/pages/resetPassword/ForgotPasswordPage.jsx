import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import PrimaryButton from "../../design/buttons/PrimaryButton";
import InputField from "../../design/input/InputField";
import InputAdornment from "@mui/material/InputAdornment";
import PasswordServices from "../../services/PasswordServices";
import Header from "../../components/header/Header";
import holdingHands2 from "../../assets/images/holdingHands2.png";
import hold2 from "../../assets/images/hold2.png";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("E-post måste vara ifylld.");
            return;
        }

        try {
            await PasswordServices.forgotPassword(email);
            setStatus("sent");
        }

        catch {
            setError("Något gick fel, försök igen.");
        }
    };

    return (
        <>
            <Header mobileImage={hold2} desktopImage={holdingHands2} />

            <form onSubmit={handleSubmit}>
                <Grid container direction="column" spacing={2} sx={{ mt: 4 }}>
                    <Grid>
                        <Typography variant="h6" align="center">
                            Ange din e-postadress
                        </Typography>
                        <InputField
                            fullWidth
                            placeholder="Exempel@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-input": { textAlign: "center", paddingLeft: "40px" },
                                "& .MuiOutlinedInput-root": { height: 40, borderRadius: 20 },
                            }}
                        />
                    </Grid>

                    {error && (
                        <Grid>
                            <Typography color="error">{error}</Typography>
                        </Grid>
                    )}

                    {status === "sent" && (
                        <Grid>
                            <Typography align="center" sx={{ color: "var(--color-primary)" }}>
                                Om en användare med den e-postadressen finns har en återställningslänk skickats.
                            </Typography>
                        </Grid>
                    )}

                    <Grid>
                        <PrimaryButton type="submit" sx={{ height: 40, mt: 2 }}>
                            Skicka återställningslänk
                        </PrimaryButton>
                    </Grid>

                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ cursor: "pointer", color: "var(--color-border-light)", mt: 1 }}
                        onClick={() => navigate('/login')}
                    >
                        Tillbaka till inloggning
                    </Typography>
                </Grid>
            </form>
        </>
    );
};

export default ForgotPasswordPage;