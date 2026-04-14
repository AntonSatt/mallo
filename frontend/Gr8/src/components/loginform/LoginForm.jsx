import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@mui/material"


const LoginForm = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!userName.trim() || !password) 
    {
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

  return (
    <section>
      <h2>Logga in</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <p>
            <label htmlFor="userName">Användarnamn </label>
            <input type="text" id="userName" name="userName"
            value={userName} onChange={(event) => setUserName(event.target.value)} placeholder="Användarnamn" />
          </p>

          <p>
            <label htmlFor="password">Lösenord </label>
            <input type="password" id="password" name="password" 
            value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Lösenord" />
          </p>

          {error && <p>{error}</p>} 
          <Button type="submit" variant="contained" color="primary">
            Logga in
          </Button>
        </fieldset>

        <h3>Glömt ditt lösenord?</h3>
        <Button type="button" variant="outlined" color="secondary" onClick={handleForgotPassword}>
          Klicka här
        </Button>
      </form>
    </section>
  );
};

export default LoginForm;
