import { useState } from "react";
import UserServices from "../../services/UserServices";

const LoginForm = () => {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => { //TODO: Change to useeffect? Usestate?
    event.preventDefault();
    UserServices.login(userName, password);
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
