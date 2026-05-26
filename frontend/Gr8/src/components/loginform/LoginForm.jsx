import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Grid, Typography, Box } from "@mui/material"
import PrimaryButton from "../../design/buttons/PrimaryButton";
import InputField from "../../design/input/InputField";
import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

// Handles user login: Manages state for credentials and "Remember Me" preference, 
// validates input, and redirects the user to the forum upon successful authentication.
const LoginForm = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError({});

    let newError = {};
    if (!userName.trim()) {
      newError.userName = "Användarnamn/E-post krävs.";
    }
    if (!password) {
      newError.password = "Lösenord krävs.";
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    try {
      await login({ userName, password });
      navigate('/forum');
    } catch (err) {

      if (err.response && err.response.status === 401) {
        setError({
          userName: " ",
          password: "Fel användarnamn eller lösenord."
        });
      } else {
        setError({
          general: "Kunde inte ansluta till servern. Försök igen senare."
        });
      }
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" spacing={2}>
        {error.general && (
          <Grid>
            <Typography color="error" align="center">{error.general}</Typography>
          </Grid>
        )}

        <Grid>
          <Typography variant="h6" align="center">
            Användarnamn
          </Typography>

          <InputField
            fullWidth
            placeholder="Användarnamn"
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
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Grid>

        <Grid>
          <Typography variant="h6" align="center">
            Lösenord
          </Typography>

          <InputField
            fullWidth
            type="password"
            placeholder="********"
            value={password}
            error={!!error.password}
            helperText={error.password}
            onChange={(e) => setPassword(e.target.value)}
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
        </Grid>

        {error.general && (
          <Grid>
            <Typography color="error" align="center">
              {error.general}
            </Typography>
          </Grid>
        )}

        <Typography variant="h9" align="center" sx={{ cursor: "pointer", color: "var(--color-border-light)", fontWeight: 540 }} onClick={handleForgotPassword}>
          Glömt ditt lösenord?
        </Typography>

        <Grid>
          <PrimaryButton type="submit" sx={{ height: 40, mt: 2 }}>
            Logga in
          </PrimaryButton>
        </Grid>

      </Grid>
    </form>
  );
};

export default LoginForm;
