import React from "react";
import UserServices from "../../services/UserServices";

const LoginForm = () => {
  const handleSubmit = async (event) => { //TODO: Change to useeffect?
    event.preventDefault();
    UserServices.login(event.target.userName.value, event.target.password.value);
  };

  return (
    <section>
      <h2>Logga in</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <p>
            <label htmlFor="userName">Användarnamn </label>
            <input type="text" id="userName" />
          </p>

          <p>
            <label htmlFor="password">Lösenord </label>
            <input type="text" id="password" />
          </p>

          <button type="submit">Logga in</button>
        </fieldset>

        <h3>Glömt ditt lösenord?</h3>
        <button type="submit">Klicka här</button>
      </form>
    </section>
  );
};

export default LoginForm;
