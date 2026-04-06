import React, {useState} from "react";
import UserServices from "../../services/UserServices";

const RegisterForm = () => {

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [socialNumber, setSocialNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (
      !userName.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !socialNumber.trim() ||
      !email.trim() ||
      !password
    ) {
      setError("Alla fält måste vara ifyllda.");
      return;
    }

    if (socialNumber.length !==8)
      {
        setError("Personnummer måste ha 8 siffror.");
        return;
      }

    if (password.length < 8)
    {
      setError("Lösenord måste ha minst 8 tecken.");
      return;
    }

    if (!email.includes("@"))
    {
      setError("Ogiltig e-post.");
      return;
    }

    // Create an object containing all input values to send to the backend API.
    const registerData = {
      userName,
      firstName,
      lastName,
      socialNumber,
      email,
      password
    };

    // Try to send the registration data to the backend API.
    // If successful, show success message and clear the form.
    try {
      await UserServices.register(registerData);
      setSuccessMessage("Registrering lyckades!");
      setUserName("");
      setFirstName("");
      setLastName("");
      setSocialNumber("");
      setEmail("");
      setPassword("");
    } catch (err) { 
      // If the API request fails, show an error message to the user.
      console.error(err);
      setError("Registrering misslyckades. Försök igen.");
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
            value={firstName} onChange={(event) => setFirstName(event.target.value)}/>
          </p>
          <p>
            <label htmlFor="lastName">Efternamn </label>
            <input type="text" id="lastName" name="lastName" 
            value={lastName} onChange={(event) => setLastName(event.target.value)}/>
          </p>
          <p>
            <label htmlFor="socialNumber">Personnummer </label>
            <input type="text" id="socialNumber" name="socialNumber" placeholder="ÅÅÅÅMMDD"  
            value={socialNumber} onChange={(event) => setSocialNumber(event.target.value)}/>
          </p>
        </fieldset>

        <p>
          <label htmlFor="userName">Användarnamn </label>
          <input type="text" id="userName" name="userName" placeholder="Välj ett namn" 
          value={userName} onChange={(event) => setUserName(event.target.value)}/>
        </p>
        <p>
          <label htmlFor="password">Lösenord </label>
          <input type="password" id="password" name="password" placeholder="Välj ett lösenord" 
          value={password} onChange={(event) => setPassword(event.target.value)}/>
        </p>
        <p>
          <label htmlFor="email">Email </label>
          <input type="email" id="email" name="email" placeholder="exempel@exempel.com"  
          value={email} onChange={(event) => setEmail(event.target.value)}/>
        </p>

        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}

        <button type="submit">Registrera dig</button>
      </form>
    </section>
  );
};

export default RegisterForm;
