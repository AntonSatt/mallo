import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@mui/material"

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    ssn: "",
    userName: "",
    password: "",
    email: ""
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <section>
      <h2>Skapa konto</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Personuppgifter</legend>
          <p>
            <label htmlFor="firstName">Förnamn </label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
          </p>
          <p>
            <label htmlFor="lastName">Efternamn </label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
          </p>
          <p>
            <label htmlFor="ssn">Personnummer </label>
            <input type="text" id="ssn" name="ssn" value={formData.ssn} onChange={handleChange} placeholder="ÅÅMMDD" />
          </p>
        </fieldset>

        <p>
          <label htmlFor="userName">Användarnamn </label>
          <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} placeholder="Välj ett namn" />
        </p>
        <p>
          <label htmlFor="password">Lösenord </label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Välj ett lösenord" />
        </p>
        <p>
          <label htmlFor="email">Email </label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="exempel@exempel.com" />
        </p>

        <Button type="submit" variant="contained" color="primary">Registrera dig</Button>
      </form>
    </section>
  );
};

export default RegisterForm;