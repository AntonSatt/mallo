import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Användarnamn" />
          </p>

          <p>
            <label htmlFor="password">Lösenord </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Lösenord" />
          </p>

          <button type="submit">Logga in</button>
        </fieldset>
      </form>

      <h3>Glömt ditt lösenord?</h3>
      <button onClick={handleForgotPassword}>Klicka här</button>
    </section>
  );
};

export default LoginForm;
