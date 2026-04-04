import React from "react";
import { useState } from "react";
import { Dialog, DialogTitle, DialogActions, Button} from "@mui/material";

const UserSettings = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event) => {
        setOpen(false);
        console.log(event.target.id);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Inställningar sparade!");
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Användarinställningar</h2>
                <label htmlFor="username">
                    Användarnamn:
                    <input type="text" id="username" name="username" />
                </label>
                <label htmlFor="firstname">
                    Förnamn:
                    <input type="text" id="firstname" name="firstname" />
                </label>
                <label htmlFor="lastname">
                    Efternamn:
                    <input type="text" id="lastname" name="lastname" />
                </label>
                <label htmlFor="email">
                    Email:
                    <input type="email" id="email" name="email" />
                </label>
                <label htmlFor="password">
                    Lösenord:
                    <input type="password" id="password" name="password" />
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
                    <Button variant="contained" color="error"  onClick={handleClose} id="deleteUser">Ja, ta bort konto</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserSettings;