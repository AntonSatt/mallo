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

    if (
      !formData.userName.trim() ||
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.ssn.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError("Alla fält måste vara ifyllda.");
      return;
    }

    if (formData.ssn.length !==8 || !(/^\d+$/.test(formData.ssn)))
      {
        setError("Personnummer måste ha 8 siffror.");
        return;
      }

    if (formData.password.length < 8) //TODO: add more password requirements
    {
      setError("Lösenord måste ha minst 8 tecken.");
      return;
    }

    if (!formData.email.includes("@"))
    {
      setError("Ogiltig e-post.");
      return;
    }

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registrering misslyckades. Försök igen.');
    }
  };
    
  return (
    <section>
      <h2>Skapa konto</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Personuppgifter</legend>
          <p>
            <label htmlFor="firstName">Förnamn </label>
            <input type="text" id="firstName" name="firstName" 
            value={formData.firstName} onChange={handleChange}/>
          </p>
          <p>
            <label htmlFor="lastName">Efternamn </label>
            <input type="text" id="lastName" name="lastName" 
            value={formData.lastName} onChange={handleChange}/>
          </p>
          <p>
            <label htmlFor="ssn">Personnummer </label>
            <input type="text" id="ssn" name="ssn" placeholder="ÅÅÅÅMMDD"  
            value={formData.ssn} onChange={handleChange}/>
          </p>
        </fieldset>

        <p>
          <label htmlFor="userName">Användarnamn </label>
          <input type="text" id="userName" name="userName" placeholder="Välj ett namn" 
          value={formData.userName} onChange={handleChange}/>
        </p>
        <p>
          <label htmlFor="password">Lösenord </label>
          <input type="password" id="password" name="password" placeholder="Välj ett lösenord" 
          value={formData.password} onChange={handleChange}/>
        </p>
        <p>
          <label htmlFor="email">Email </label>
          <input type="email" id="email" name="email" placeholder="exempel@exempel.com"  
          value={formData.email} onChange={handleChange}/>
        </p>

        {error && <p>{error}</p>}

        <Button type="submit" variant="contained" color="primary">Registrera dig</Button>
      </form>
    </section>
  );
};

export default RegisterForm;
