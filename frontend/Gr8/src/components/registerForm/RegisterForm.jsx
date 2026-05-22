import React, { useState } from "react";
import moment from "moment";
import { useAuth } from "../../hooks/useAuth";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import RegisterErrorDialog from "./RegisterErrorDialog.jsx";

// Main container for the multi-step registration process.
// Manages form state, handles step-specific validation, and executes the final registration call.
const RegisterForm = ({ step, setStep }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    ssn: "",
    userName: "",
    password: "",
    confirmPassword: "",
    email: "",
    avatar: 0
  });

  const [error, setError] = useState({});
  const [registerErrorOpen, setRegisterErrorOpen] = useState(false);
  const [registerErrorMessage, setRegisterErrorMessage] = useState("Något gick fel vid registreringen. Försök igen.");
  const { register } = useAuth();
  const userNameRegex = /^[\p{L}\p{N}]+$/u;

  const getUserNameError = (value, { requireValue = false } = {}) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return requireValue ? "Användarnamn måste vara ifyllt." : "";
    }

    if (/\s/.test(value)) {
      return "Användarnamn får inte innehålla mellanslag.";
    }

    if (!userNameRegex.test(trimmedValue)) {
      return "Användarnamn får endast innehålla bokstäver och siffror.";
    }

    return "";
  };

  const getRegistrationErrorMessage = (err) => {
    const serverData = err?.response?.data;

    if (typeof serverData === "string" && serverData.trim()) {
      return serverData;
    }

    if (Array.isArray(serverData) && serverData.length > 0) {
      const first = serverData[0];
      if (typeof first === "string" && first.trim()) {
        return first;
      }
      if (typeof first?.description === "string" && first.description.trim()) {
        return first.description;
      }
      if (typeof first?.errorMessage === "string" && first.errorMessage.trim()) {
        return first.errorMessage;
      }
    }

    return "Något gick fel vid registreringen. Försök igen.";
  };

  // Updates form state and manages field-specific error clearing
  const handleChange = (e) => {
    const field = e.target.id || e.target.name;
    const value = e.target.value;

    setFormData({
      ...formData,
      [field]: value
    });

    if (field === "userName") {
      setError((prev) => ({
        ...prev,
        userName: getUserNameError(value)
      }));
      return;
    }

    if (error[field]) {
      setError({ ...error, [field]: "" });
    }
  };

  // Step validations functions - returns or sets error if invalid, otherwise returns true and clears error.
  const validateStep1 = () => {
    let newError = {};
    const userNameError = getUserNameError(formData.userName, { requireValue: true });
    if (userNameError) newError.userName = userNameError;

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const validateStep2 = () => {
    let newError = {};
    const cleanSsn = formData.ssn.trim();

    if (!formData.fullName.trim()) newError.fullName = "Namn måste fyllas i.";
    else if (!formData.fullName.trim().includes(" ")) newError.fullName = "Ange både för- och efternamn.";

    if (!cleanSsn) {
      newError.ssn = "Personnummer krävs.";
    } else if (!/^\d{8}$/.test(cleanSsn)) {
      newError.ssn = "Personnummer måste vara 8 siffror.";
    } else {
      const ssnDate = moment(cleanSsn, "YYYYMMDD", true);
      const minDate = moment("19000101", "YYYYMMDD", true);

      if (!ssnDate.isValid()) {
        newError.ssn = "Personnummer innehåller ogiltigt datum.";
      } else if (ssnDate.isBefore(minDate)) {
        newError.ssn = "Det verkar som att datumet är väldigt gammalt. Vänligen kontrollera så att året stämmer.";
      }
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const validateStep3 = () => {
    let newError = {};

    if (!formData.email.trim()) {
      newError.email = "E-post krävs.";
    } else if (!formData.email.includes("@")) {
      newError.email = "Ogiltig e-postadress.";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!formData.password) {
      newError.password = "Lösenord krävs.";
    } else if (!passwordRegex.test(formData.password)) {
      newError.password = "Lösenordet måste vara minst 8 tecken, ha en stor bokstav (A-Z), en siffra (0-9) och ett specialtecken.";
    }

    if (formData.confirmPassword !== formData.password) {
      newError.confirmPassword = "Lösenorden matchar inte.";
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  // Final submit function - calls register from useAuth, if successful moves to
  // step 4 (success screen) otherwise shows error dialog.
  const handleSubmit = async () => {
    try {
      setError({});
      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      const dataToSubmit = {
        userName: formData.userName.trim(),
        firstName: firstName,
        lastName: lastName || " ",
        ssn: formData.ssn,
        email: formData.email,
        password: formData.password,
        avatar: formData.avatar
      };

      await register(dataToSubmit);
      setStep(4); // success screen

    } catch (err) {
      setRegisterErrorMessage(getRegistrationErrorMessage(err));
      setRegisterErrorOpen(true);
    }
  };

  return (
    <section>
      {step === 1 && (
        <Step1
          formData={formData}
          handleChange={handleChange}
          error={error}
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
          error={error}
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
          error={error}
          onNext={() => {
            if (!validateStep3()) return;
            handleSubmit();
          }}
          onBack={() => setStep(2)}
        />
      )}

      <RegisterErrorDialog
        open={registerErrorOpen}
        onClose={() => setRegisterErrorOpen(false)}
        message={registerErrorMessage}
      />
    </section>
  );
};

export default RegisterForm;