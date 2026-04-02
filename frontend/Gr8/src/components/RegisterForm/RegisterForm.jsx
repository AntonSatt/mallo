import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    ssn: "",
    username: "",
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
            <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} />
          </p>
          <p>
            <label htmlFor="lastName">Efternamn </label>
            <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} />
          </p>
          <p>
            <label htmlFor="ssn">Personnummer </label>
            <input type="text" id="ssn" value={formData.ssn} onChange={handleChange} placeholder="ÅÅMMDD" />
          </p>
        </fieldset>

        <p>
          <label htmlFor="username">Användarnamn </label>
          <input type="text" id="username" value={formData.username} onChange={handleChange} placeholder="Välj ett namn" />
        </p>
        <p>
          <label htmlFor="password">Lösenord </label>
          <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="Välj ett lösenord" />
        </p>
        <p>
          <label htmlFor="email">Email </label>
          <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="exempel@exempel.com" />
        </p>

        <button type="submit">Registrera dig</button>
      </form>
    </section>
  );
};

export default RegisterForm;
