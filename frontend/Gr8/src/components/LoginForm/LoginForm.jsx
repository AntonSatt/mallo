import React from "react";

const LoginForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Inloggning lyckades!");
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
