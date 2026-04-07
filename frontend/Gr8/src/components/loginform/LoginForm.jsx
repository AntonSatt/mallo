import { useState } from "react";
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
    try {
      await login({ userName, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
  };

  return (
    <section>
      <h2>Logga in</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <p>
            <label htmlFor="userName">Användarnamn </label>
            <input type="text" id="userName" name="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Användarnamn" />
          </p>

          <p>
            <label htmlFor="password">Lösenord </label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Lösenord" />
          </p>

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