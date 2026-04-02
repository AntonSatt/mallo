import React from "react";
import { useState } from "react";
import { Dialog } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { DialogActions } from "@mui/material";

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
                <label htmlFor="userName">
                    Användarnamn:
                    <input type="text" id="userName" name="userName" />
                </label>
                <label htmlFor="name">
                    Namn:
                    <input type="text" id="name" name="name" />
                </label>
                <label htmlFor="email">
                    Email:
                    <input type="email" id="email" name="email" />
                </label>
                <label htmlFor="password">
                    Lösenord:
                    <input type="password" id="password" name="password" />
                </label>
                <button type="submit">Spara inställningar</button>

                <button type="delete" onClick={handleClickOpen}>
                    Ta bort konto
                </button>
            </form>
            
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Är du säker på att du vill ta bort ditt konto?</DialogTitle>
                <DialogActions>
                    <button onClick={handleClose}>Avbryt</button>
                    <button onClick={handleClose} id="deleteUser">Ja, ta bort konto</button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserSettings;