import React from "react";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid,
    Box,
    Select,
    MenuItem,
    OutlinedInput,
    ListItemText
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import UserServices from "../../services/UserServices";
import { useAuth } from "../../hooks/useAuth";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import InputField from "../../design/input/InputField";
import ProfileBar from "../../components/layout/ProfileBar.jsx";
import EditPencil from "../../assets/icons/editPencil.svg";
import Settings from "../../assets/icons/settings.svg";
import AvatarSlider from "../../components/avatar/avatarSlider.jsx";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import SecondaryButton from "../../design/buttons/SecondaryButton";
import PrimaryButton from "../../design/buttons/PrimaryButton.jsx";
import Switch from '@mui/material/Switch';
import "./UserSettings.css";
import LogoutIcon from '@mui/icons-material/Logout';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PostServices from "../../services/PostServices";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import SettingsButtonStyles from "../../design/buttons/SettingsButton.jsx";

// User Settings Page: Provides an interface for users to update their profile information, change their password, and delete their account. 
// Utilizes accordions for organized sections and handles form validation and API interactions for user data management.

const UserSettings = () => {

    const { logout } = useAuth();
    const { deleteAccount } = useAuth();
    const [profileData, setProfileData] = useState({
        avatar: null,
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
    const [isLoading, setIsLoading] = useState(true);

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const [errors, setErrors] = useState({});

    const [showCurrentPassword] = useState(false);
    const [showNewPassword] = useState(false);
    const [showConfirmPassword] = useState(false);

    const handleProfileChange = (e) => {
        const key = e.target.id || e.target.name;
        setProfileData({ ...profileData, [key]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        if (errors[e.target.id]) {
            setErrors({ ...errors, [e.target.id]: "" });
        }
        setPasswordData({ ...passwordData, [e.target.id]: e.target.value })
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await UserServices.getUser();

                setProfileData({
                    avatar: data.avatar || null,
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    ssn: data.ssn || "",
                    userName: data.userName || "",
                    email: data.email || ""
                });
            }
            catch (error) {
                console.error("Kunde inte hämta användardata", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tagResult = await PostServices.getTags();

                const allTags = tagResult.map((tag) => ({
                    id: tag.id,
                    name: tag.name
                }));

                setTags(allTags);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchData();
    }, []);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        let newErrors = {};

        if (!profileData.userName.trim()) newErrors.userName = "Användarnamn krävs";
        if (!profileData.firstName.trim()) newErrors.firstName = "Förnamn krävs"
        if (!profileData.lastName.trim()) newErrors.lastName = "Efternamn krävs"
        if (!profileData.email.trim()) newErrors.email = "Email krävs"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const result = await UserServices.updateUser(profileData);
        }
        catch (error) {
            if (error.response && error.response.status === 409) {
                setErrors({
                    userName: "Användarnamn eller email redan upptaget",
                    email: "Användarnamn eller email redan upptaget"
                })
            }
            else {
                setErrors({ general: "Kunde inte spara inställningarna. Försök igen senare." })
            }
        }

    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setErrors({ confirmNewPassword: "Lösenorden matchar inte" });
            return;
        }

        try {
            const result = await UserServices.updatePassword(passwordData);
            setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
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

    return (
        <>
            <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '16px 0', padding: '0 16px' }}>
                <Button
                    onClick={logout}
                    sx={SettingsButtonStyles}
                >
                    <LogoutIcon sx={{ color: '--color-primary' }} />
                    Logga ut
                </Button>

                <Box
                    className="settingsButton"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 4,
                        padding: '12px 16px',
                        minWidth: 90,
                        gap: 1,
                    }}>
                    <Switch defaultChecked size="small" />
                    <Typography variant="body2">Anonym</Typography>
                </Box>

                <Button
                    // onClick={() => window.location.href = "/forum"}
                    sx={SettingsButtonStyles}
                >
                    <InfoOutlinedIcon sx={{ color: '--color-primary' }} />
                    Om appen
                </Button>
            </Grid>

            <form onSubmit={handleProfileSubmit}>
                <Accordion className="dropdown" sx={{
                    borderRadius: '20px !important',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)',
                    '&:before': { display: 'none' },
                    mt: 2,
                }}>
                    <AccordionSummary expandIcon={<ArrowDropDownCircleOutlinedIcon sx={{ color: '--color-primary' }} />}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <img src={Settings} alt="edit" style={{
                                width: 20,
                                height: 20,
                                filter: 'invert(78%) sepia(50%) saturate(500%) hue-rotate(330deg)'
                            }} />
                            Profil inställningar
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}>
                            {!isLoading && (
                                <AvatarSlider formData={profileData} handleChange={handleProfileChange} mt={5} mb={2} />
                            )}
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>

                            <Typography variant="body2" color="var(--color-text-main)" align="center">
                                Användarnamn
                            </Typography>

                            <InputField
                                fullWidth
                                margin="normal"
                                id="userName"
                                value={profileData.userName}
                                onChange={handleProfileChange}
                                error={!!errors.userName}
                                helperText={errors.userName}
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        textAlign: "center",
                                        paddingLeft: "40px",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        height: 40,
                                        borderRadius: 20,
                                    },
                                    width: "80%"
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CreateOutlinedIcon sx={{ color: "var(--color-primary)" }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <Typography variant="body2" color="var(--color-text-main)" align="center">
                                Förnamn
                            </Typography>

                            <InputField
                                fullWidth
                                margin="normal"
                                id="firstName"
                                value={profileData.firstName}
                                onChange={handleProfileChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        textAlign: "center",
                                        paddingLeft: "40px",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        height: 40,
                                        borderRadius: 20,
                                    },
                                    width: "80%"
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CreateOutlinedIcon sx={{ color: "var(--color-primary)" }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <Typography variant="body2" color="var(--color-text-main)" align="center">
                                Efternamn
                            </Typography>

                            <InputField
                                fullWidth
                                margin="normal"
                                id="lastName"
                                value={profileData.lastName}
                                onChange={handleProfileChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        textAlign: "center",
                                        paddingLeft: "40px",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        height: 40,
                                        borderRadius: 20,
                                    },
                                    width: "80%"
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CreateOutlinedIcon sx={{ color: "var(--color-primary)" }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <Typography variant="body2" color="var(--color-text-main)" align="center">
                                Email
                            </Typography>

                            <InputField
                                fullWidth
                                margin="normal"
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        textAlign: "center",
                                        paddingLeft: "40px",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        height: 40,
                                        borderRadius: 20,
                                    },
                                    width: "80%"
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CreateOutlinedIcon sx={{ color: "var(--color-primary)" }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                        </Box>

                        <Box item sx={{ display: 'flex', justifyContent: 'center' }}>
                            <PrimaryButton type="submit" sx={{ mt: 2, borderRadius: 50, width: '75%' }}>
                                Spara profil
                            </PrimaryButton>
                        </Box>

                        <Box item sx={{ display: 'flex', justifyContent: 'center' }}>
                        <SecondaryButton onClick={handleClickOpen} sx={{ borderRadius: 50, backgroundColor: '--color-bg-muted', width: '50%', alignItems: 'center', mt: 2 }}>
                                Radera konto
                            </SecondaryButton>
                        </Box>

                    </AccordionDetails>
                </Accordion>

            </form>

            <form onSubmit={handlePasswordSubmit}>
                <Accordion className="dropdown" sx={{
                    borderRadius: '20px !important',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)',
                    '&:before': { display: 'none' },
                    mt: 2,
                }}>
                    <AccordionSummary expandIcon={<ArrowDropDownCircleOutlinedIcon sx={{color: 'var(--color-primary)'}} />}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <img src={Settings} alt="edit" style={{
                                width: 20,
                                height: 20,
                                filter: 'invert(78%) sepia(50%) saturate(500%) hue-rotate(330deg)'
                            }} />Lösenords inställningar</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>

                            <Typography variant="body2" color="var(--color-text-main)" align="center">
                                Nuvarande Lösenord
                            </Typography>
                            <InputField fullWidth
                                margin="normal"
                                id="currentPassword"
                                placeholder="Lösenord"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                error={!!errors.currentPassword}
                                helperText={errors.currentPassword}
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        textAlign: "center",
                                        paddingLeft: "40px",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        height: 40,
                                        borderRadius: 20,
                                    },
                                    width: "80%"
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CreateOutlinedIcon sx={{ color: "var(--color-primary)" }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <Typography variant="body2" color="var(--color-text-main)" align="center">
                                Nytt Lösenord
                            </Typography>
                            <InputField
                                fullWidth
                                margin="normal"
                                id="newPassword"
                                placeholder="Lösenord"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword}
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        textAlign: "center",
                                        paddingLeft: "40px",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        height: 40,
                                        borderRadius: 20,
                                    },
                                    width: "80%"
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CreateOutlinedIcon sx={{ color: "var(--color-primary)" }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <Typography variant="body2" color="var(--color-text-main)" align="center">
                                Bekräfta Lösenordet
                            </Typography>

                            <InputField
                                fullWidth
                                margin="normal"
                                id="confirmNewPassword"
                                placeholder="Lösenord"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordData.confirmNewPassword}
                                onChange={handlePasswordChange}
                                error={!!errors.confirmNewPassword}
                                helperText={errors.confirmNewPassword}
                                inputProps={{ style: { textAlign: 'center' } }}
                                sx={{
                                    "& .MuiOutlinedInput-input": {
                                        textAlign: "center",
                                        paddingLeft: "40px",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        height: 40,
                                        borderRadius: 20,
                                    },
                                    width: "80%"
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CreateOutlinedIcon sx={{ color: "var(--color-primary)" }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                        </Box>

                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                            <PrimaryButton type="submit" sx={{ mt: 2, borderRadius: 50, width: '75%' }}>
                                Spara lösenord
                            </PrimaryButton>
                        </Grid>

                    </AccordionDetails>
                </Accordion>
            </form>

            <form>
                <Accordion className="dropdown"
                    sx={{
                        borderRadius: '20px !important',
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)',
                        '&:before': { display: 'none' },
                        mt: 2,
                    }}>
                    <AccordionSummary expandIcon={<ArrowDropDownCircleOutlinedIcon sx={{ color: 'var(--color-primary)' }} />} >
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
                            <img src={Settings} alt="edit" style={{
                                width: 20,
                                height: 20,
                                filter: 'invert(78%) sepia(50%) saturate(500%) hue-rotate(330deg)'
                            }} />
                            Triggers
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Select
                            multiple
                            fullWidth
                            value={selectedTags}
                            onChange={(e) => setSelectedTags(e.target.value)}
                            input={<OutlinedInput />}
                            renderValue={(selected) =>
                                selected
                                    .map(id => tags.find(t => t.id === id)?.name)
                                    .join(", ")
                            }
                        >
                            {tags.map(tag => {
                                const selected = selectedTags.includes(tag.id);
                                const Icon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;

                                return (
                                    <MenuItem key={tag.id} value={tag.id}>
                                        <Icon fontSize="small" style={{ marginRight: 8 }} />
                                        <ListItemText primary={tag.name} />
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </AccordionDetails>

                </Accordion>
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