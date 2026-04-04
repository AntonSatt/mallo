import React from "react";
import UserServices from "../../services/UserServices";
import {Button} from "@mui/material"

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
            <input type="text" id="userName" name="userName"/>
          </p>

          <p>
            <label htmlFor="password">Lösenord </label>
            <input type="password" id="password" name="password"/>
          </p>

          <Button type="submit" variant="contained" color="primary">
            Logga in
          </Button>
        </fieldset>

        <h3>Glömt ditt lösenord?</h3>
        <Button type="button" variant="outlined" color="secondary">Klicka här</Button>
      </form>
    </section>
  );
};

export default LoginForm;