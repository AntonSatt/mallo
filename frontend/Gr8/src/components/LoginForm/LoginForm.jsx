import React, {useState} from "react";
import UserServices from "../../services/UserServices";

const LoginForm = () => {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setError("");

    if (!userName.trim() || !password) 
    {
      setError("Användarnamn och lösenord måste vara ifyllda.")
      return;
    }

    try {
      await UserServices.login(userName, password);
    } catch(err){
      console.error(err)
      setError("Fel användarnamn eller lösenord.");
    }
  };

  return (
    <section>
      <h2>Logga in</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <p>
            <label htmlFor="userName">Användarnamn </label>
            <input type="text" id="userName" name="userName"
            value={userName} onChange={(event) => setUserName(event.target.value)} /> {/* controlled inputs*/}
          </p>

          <p>
            <label htmlFor="password">Lösenord </label>
            <input type="password" id="password" name="password" 
            value={password} onChange={(event) => setPassword(event.target.value)}/>
          </p>

          {error && <p>{error}</p>} 

          <button type="submit">Logga in</button>
        </fieldset>

        <h3>Glömt ditt lösenord?</h3>
        <button type="button">Klicka här</button>
      </form>
    </section>
  );
};

export default LoginForm;
