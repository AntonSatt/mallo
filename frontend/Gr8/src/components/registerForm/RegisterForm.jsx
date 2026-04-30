import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";

// Main container for the multi-step registration process. 
// Manages form state, handles step-specific validation, and executes the final registration call.
const RegisterForm = ({ step, setStep }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    ssn: "",
    userName: "",
    password: "",
    confirmPassword: "",
    email: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  //  update fields in formData state on change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Step validations functions - returns or sets error if invalid, otherwise returns true and clears error.

  const validateStep1 = () => {
    if (!formData.userName.trim()) {
      setError("Användarnamn måste vara ifyllt.");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!formData.fullName.trim() || !formData.ssn.trim()) {
      setError("Alla fält måste vara ifyllda.");
      return false;
    }

    if (!formData.fullName.trim().includes(" ")) {
      setError("Vänligen ange både för- och efternamn.");
      return false;
    }

    if (formData.ssn.length !== 8 || !/^\d+$/.test(formData.ssn)) {
      setError("Personnummer måste vara 8 siffror.");
      return false;
    }

    setError("");
    return true;
  };

  const validateStep3 = () => {
    if (!formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError("Alla fält måste vara ifyllda.");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Ogiltig e-post.");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Lösenord måste vara minst 8 tecken.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Lösenorden matchar inte.");
      return false;
    }

    setError("");
    return true;
  };

  // Final submit function - calls register from useAuth, if successful moves to step 4 (success screen)
  // otherwise sets error message.
  const handleSubmit = async () => {
    try {
      setError("");

      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      const dataToSubmit = {
        userName: formData.userName,
        firstName: firstName,
        lastName: lastName || " ",
        ssn: formData.ssn,
        email: formData.email,
        password: formData.password
      };

      await register(dataToSubmit);
      setStep(4); // success screen 

    } catch (err) {
      setError(err?.message || "Registrering misslyckades.");
    }
  };

  console.log("Current step is:", step);

  return (
    <section>
      {error && <p>{error}</p>}

      {step === 1 && (
        <Step1
          formData={formData}
          handleChange={handleChange}
          onNext={() => {
            if (!validateStep1()) return;
            setStep(2);
          }}
        />
      )}


      {step === 2 && (
        <Step2
          formData={formData}
          handleChange={handleChange}
          onNext={() => {
            if (!validateStep2()) return;
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Step3
          formData={formData}
          handleChange={handleChange}
          onNext={() => {
            if (!validateStep3()) return;
            handleSubmit();
          }}
          onBack={() => setStep(2)}
        />
      )}

    </section>
  );
};

export default RegisterForm;