import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Grid, Typography, Box } from "@mui/material"
import PrimaryButton from "../../design/buttons/PrimaryButton";
import InputField from "../../design/input/InputField";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';


const LoginForm = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!userName.trim() || !password) {
      setError("Användarnamn och lösenord måste vara ifyllda.")
      return;
    }

    try {
      await login({ userName, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Fel användarnamn eller lösenord.');
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
  };

  const handleRememberMe = () => {
    // Handle remember me logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" spacing={2}>

        <Grid item>
          <Typography variant="h6" align="center">
            E-post
          </Typography>

          <InputField
            fullWidth
            placeholder="Exempel@email.com"
            sx={{
              "& .MuiOutlinedInput-input": {
                textAlign: "center",
                paddingLeft: "40px"
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
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Grid>

        <Grid item>
          <Typography variant="h6" align="center">
            Lösenord
          </Typography>

          <InputField
            fullWidth
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        </Grid>

        {error && (
          <Grid item>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}

        <Typography variant="h9" align="center" sx={{ cursor: "pointer", color: "var(--color-border-light)", fontWeight: 540 }} onClick={handleForgotPassword}>
          Glömt ditt lösenord?
        </Typography>

        <Box
          onClick={handleRememberMe}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mt: 1,
            cursor: "pointer",
          }}
        >
          <CheckCircleOutlinedIcon fontSize="small" sx={{ color: "var(--color-primary)" }} />
          <Typography variant="body2">
            Kom ihåg mina inloggningsuppgifter
          </Typography>
        </Box>

        <Grid item>
          <PrimaryButton type="submit" sx={{ height: 40, mt: 2 }}>
            Logga in
          </PrimaryButton>
        </Grid>

      </Grid>
    </form>
  );
};

export default LoginForm;
