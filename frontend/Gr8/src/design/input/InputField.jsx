import { TextField, styled } from "@mui/material";

const InputField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
        color: "var(--color-text-main)",

        boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08)",

        "& fieldset": {
            border: "none"
        },
    },
});

export default InputField;