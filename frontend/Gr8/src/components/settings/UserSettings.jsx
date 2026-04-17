import React from "react";
import { useState } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import UserServices from "../../services/UserServices";
import { useAuth } from "../../hooks/useAuth";

const UserSettings = () => {

    const { deleteAccount } = useAuth();
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        ssn: "",
        userName: "",
        email: ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [open, setOpen] = useState(false);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.id]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({...passwordData, [e.target.id] : e.target.value})
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async (e) => {
        setOpen(false);
        console.log(e.target.id); //Ska detta tas bort? 
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const result = await UserServices.update(profileData);
        console.log("Inställningar sparade!", result);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const result = await UserServices.update(passwordData);
        console.log("Inställningar sparade!", result);
    }; 

    const handleDelete = async () => {
        await deleteAccount();
        setOpen(false);
    };

    return (
        <>
            <form onSubmit={handleProfileSubmit}>
                <h2>Profil inställningar</h2>
                <label htmlFor="userName">
                    Användarnamn:
                    <input type="text" id="userName" name="userName" value={profileData.userName} onChange={handleProfileChange} />
                </label>
                <label htmlFor="firstName">
                    Förnamn:
                    <input type="text" id="firstName" name="firstName" value={profileData.firstName} onChange={handleProfileChange} />
                </label>
                <label htmlFor="lastName">
                    Efternamn:
                    <input type="text" id="lastName" name="lastName" value={profileData.lastName} onChange={handleProfileChange} />
                </label>
                <label htmlFor="email">
                    Email:
                    <input type="email" id="email" name="email" value={profileData.email} onChange={handleProfileChange} />
                </label>
                <Button type="submit" variant="contained" color="primary">
                    Spara inställningar
                </Button>

                <Button variant="outlined" color="error" onClick={handleClickOpen}>
                    Ta bort konto
                </Button>
            </form>

            <form onSubmit={handlePasswordSubmit}>
                <h2>Lösenords inställningar</h2>
                <label htmlFor="currentPassword">
                    Nuvarande lösenord:
                    <input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                </label>
                <label htmlFor="newPassword">
                    Nytt lösenord:
                    <input type="text" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange}  />
                </label>
                <label htmlFor="confirmPassword">
                    Bekräfta lösenord:
                    <input type="text" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                </label>
                <Button type="submit" variant="contained" color="primary" >
                    Spara lösenord
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