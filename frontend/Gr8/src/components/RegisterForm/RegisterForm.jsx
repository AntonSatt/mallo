import React from "react";
import Button from "@mui/material/Button";

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
            <input type="text" id="firstName" name="firstName" />
          </p>
          <p>
            <label htmlFor="lastName">Efternamn </label>
            <input type="text" id="lastName" name="lastName" />
          </p>
          <p>
            <label htmlFor="ssn">Personnummer </label>
            <input type="text" id="ssn" name="ssn" placeholder="ÅÅMMDD" />
          </p>
        </fieldset>

        <p>
          <label htmlFor="username">Användarnamn </label>
          <input type="text" id="username" name="username" placeholder="Välj ett namn" />
        </p>
        <p>
          <label htmlFor="password">Lösenord </label>
          <input type="text" id="password" name="password" placeholder="Välj ett lösenord" />
        </p>
        <p>
          <label htmlFor="email">Email </label>
          <input type="text" id="email" name="email" placeholder="exempel@exempel.com" />
        </p>

        <Button type="submit" variant="contained" color="primary">Registrera dig</Button>
      </form>
    </section>
  );
};

export default RegisterForm;