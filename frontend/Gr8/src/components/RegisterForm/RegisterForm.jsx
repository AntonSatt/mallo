import React from "react";

const RegisterForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Registrering skickat!");
  };

  return (
    <section>
      <h2>Skapa konto</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Personuppgifter</legend>
          <p>
            <label htmlFor="firstName">Förnamn </label>
            <input type="text" id="firstName" />
          </p>
          <p>
            <label htmlFor="lastName">Efternamn </label>
            <input type="text" id="lastName" />
          </p>
          <p>
            <label htmlFor="ssn">Personnummer </label>
            <input type="text" id="ssn" placeholder="ÅÅMMDD" />
          </p>
        </fieldset>

        <p>
          <label htmlFor="username">Användarnamn </label>
          <input type="text" id="username" placeholder="Välj ett namn" />
        </p>
        <p>
          <label htmlFor="password">Lösenord </label>
          <input type="text" id="password" placeholder="Välj ett lösenord" />
        </p>
        <p>
          <label htmlFor="email">Email </label>
          <input type="text" id="email" placeholder="exempel@exempel.com" />
        </p>

        <button type="submit">Registrera dig</button>
      </form>
    </section>
  );
};

export default RegisterForm;
