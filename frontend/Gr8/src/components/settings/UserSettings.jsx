import React from "react";
import { useState } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import UserServices from "../../services/UserServices";
import { useAuth } from "../../hooks/useAuth";

const UserSettings = () => {

    const { deleteAccount } = useAuth();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        ssn: "",
        userName: "",
        password: "",
        email: ""
    });
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event) => {
        setOpen(false);
        console.log(event.target.id);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = await UserServices.update(formData);
        console.log("Inställningar sparade!", result);
    };

    const handleDelete = async () => {
        await deleteAccount();
        setOpen(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Användarinställningar</h2>
                <label htmlFor="userName">
                    Användarnamn:
                    <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} />
                </label>
                <label htmlFor="firstName">
                    Förnamn:
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                </label>
                <label htmlFor="lastName">
                    Efternamn:
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                </label>
                <label htmlFor="email">
                    Email:
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </label>
                <label htmlFor="password">
                    Lösenord:
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                </label>
                <Button type="submit" variant="contained" color="primary">
                    Spara inställningar
                </Button>

                <Button variant="outlined" color="error" onClick={handleClickOpen}>
                    Ta bort konto
                </Button>
            </form>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Är du säker på att du vill ta bort ditt konto?</DialogTitle>
                <DialogActions>
                    <Button variant="text " color="inherit" onClick={handleClose}>Avbryt</Button>
                    <Button variant="contained" color="error" onClick={handleDelete} id="deleteUser">Ja, ta bort konto</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserSettings;