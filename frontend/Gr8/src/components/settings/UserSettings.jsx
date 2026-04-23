import React from "react";
import { useState, useEffect } from "react";
import { 
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    IconButton,
    InputAdornment,
    TextField
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
        confirmNewPassword: ""
    });
    const [open, setOpen] = useState(false);

    const [errors, setErrors] = useState({});

    const [showCurrentPassword, setCurrentPassword] = useState(false); 
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.id]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        if (errors[e.target.id]) {
            setErrors({ ...errors, [e.target.id]: "" });
        }
        setPasswordData({...passwordData, [e.target.id] : e.target.value})
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

<<<<<<< HEAD
    const handleClose = () => {
=======
    const handleClose = (event) => {
>>>>>>> develop
        setOpen(false);
    };

    useEffect(() => {
        const fetchUserData = async () =>{
        try{
            const data = await UserServices.getUser();

            setProfileData({
                firstName : data.firstName || "",
                lastName : data.lastName || "",
                ssn : data.ssn || "",
                userName: data.userName || "",
                email: data.email || ""
            });
        }
        catch(error){
            console.error("Kunde inte hämta användardata", error);
        }
    }; 
    fetchUserData();
    }, []);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        let newErrors = {};

        if(!profileData.userName.trim()) newErrors.userName = "Användarnamn krävs";
        if(!profileData.firstName.trim()) newErrors.firstName = "Förnamn krävs"
        if(!profileData.lastName.trim()) newErrors.lastName = "Efternamn krävs"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try{
            const result = await UserServices.update(profileData);
            console.log("Inställningar sparade!", result);
        }
        catch(error){
            if(error.response && error.response.status === 409){
                setErrors({
                    userName: "Användarnamn eller email redan upptaget",
                    email: "Användarnamn eller email redan upptaget"})
            }
            else{
                setErrors({general: "Kunde inte spara inställningarna. Försök igen senare."})
            }
        }
        
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setErrors({ confirmNewPassword: "Lösenorden matchar inte" });
            return; 
        }

        try{
            const result = await UserServices.updatePassword(passwordData);
            console.log("Lösenord sparad", result);
            setPasswordData({currentPassword : "", newPassword : "", confirmNewPassword : ""});
        }
        catch (e) {
            const serverErrors = e.response.data;
            let newErrors = {};
            let hasPasswordError = false; 

            serverErrors.forEach(error => {
                  if (error.includes("Incorrect password.")) {
            newErrors.currentPassword = "Felaktigt lösenord";
        }

                if (error.includes("Passwords")) {
                    hasPasswordError = true;
                }
            });

            if (hasPasswordError) {
                const allRequirements = "Lösenordet måste vara minst 6 tecken, ha en stor bokstav (A-Z), en siffra (0-9) och ett specialtecken";
                newErrors.newPassword = allRequirements;
                newErrors.confirmNewPassword = allRequirements;
            }

            setErrors(newErrors);
       }
    }; 

    const handleDelete = async () => {
        await deleteAccount();
        setOpen(false);
    };

    const handleShowCurrentPassword = async () => {
        setCurrentPassword((show) => !show);
    };

    const handleShowNewPassword = async () => {
        setShowNewPassword((show) => !show);
    };

    const handleShowConfirmPassword = async () => {
        setShowConfirmPassword((show) => !show);
    };

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <form onSubmit={handleProfileSubmit}>
                <h2>Profil inställningar</h2>

                <TextField
                    fullWidth
                    margin="normal"
                    id="userName"
                    label="Användarnamn"
                    value={profileData.userName}
                    onChange={handleProfileChange}
                    error={!!errors.userName}
                    helperText={errors.userName}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    id="firstName"
                    label="Förnamn"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    id="lastName"
                    label="Efternamn"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    id="email"
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    error={!!errors.email}
                    helperText={errors.email}
                />

                <Button type="submit" variant="contained" color="primary">
                    Spara inställningar
                </Button>

                <Button variant="outlined" color="error" onClick={handleClickOpen}>
                    Ta bort konto
                </Button>
            </form>

            <form onSubmit={handlePasswordSubmit}>
                <h2>Lösenords inställningar</h2>

                <TextField
                    fullWidth
                    margin="normal"
                    id="currentPassword"
                    label="Nuvarande lösenord"
                    type={showCurrentPassword? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword}
                    slotProps={{
                        input: {
                            endAdornment:(
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleShowCurrentPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showCurrentPassword? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    }}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    id="newPassword"
                    label="Nytt lösenord"
                    type={showNewPassword? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    slotProps={{
                        input:{
                        endAdornment:(
                             <InputAdornment position="end">
                                <IconButton
                                  onClick={handleShowNewPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                       }
                    }}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    id="confirmNewPassword"
                    label="Bekräfta lösenord"
                    type={showConfirmPassword? "text" : "password"}
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    error={!!errors.confirmNewPassword}
                    helperText={errors.confirmNewPassword}
                    slotProps={{
                        input: {
                        endAdornment:(
                                 <InputAdornment position="end">
                                    <IconButton
                                      onClick={handleShowConfirmPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    }}
                />
             
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