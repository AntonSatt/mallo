import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid,
    Box,
    Select,
    MenuItem,
    OutlinedInput,
    ListItemText,
    ClickAwayListener,
    Switch
} from "@mui/material";
import UserServices from "../../services/UserServices";
import { useAuth } from "../../hooks/useAuth";
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import InputField from "../../design/input/InputField";
import Settings from "../../assets/icons/settings.svg";
import Report from "../../assets/icons/report.svg";
import Lock from "../../assets/icons/lock.svg";
import AvatarSlider from "../../components/avatar/avatarSlider.jsx";
import SecondaryButton from "../../design/buttons/SecondaryButton";
import PrimaryButton from "../../design/buttons/PrimaryButton.jsx";
import "./UserSettings.css";
import LogoutIcon from '@mui/icons-material/Logout';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Headset from "../../assets/icons/headset.svg"
import Avatar from "../../assets/icons/avatar.svg"
import PostServices from "../../services/PostServices";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import SettingsButtonStyles from "../../design/buttons/SettingsButton.jsx";
import SettingsSuccessDialog from "./SettingsSuccessDialog.jsx";

// User Settings Page: Provides an interface for users to update their profile information, change their password, and delete their account. 
// Utilizes accordions for organized sections and handles form validation and API interactions for user data management.

const UserSettings = () => {

    const { logout, refreshCurrentUser } = useAuth();
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
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const [isAnonymousPublishing, setIsAnonymousPublishing] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        slotProps: {
            paper: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                },
            },
        },
    };

    const [errors, setErrors] = useState({});
    const [expandedSection, setExpandedSection] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusDialogSection, setStatusDialogSection] = useState("profile");
    const [statusDialogOutcome, setStatusDialogOutcome] = useState("success");

    const [showCurrentPassword] = useState(false);
    const [showNewPassword] = useState(false);
    const [showConfirmPassword] = useState(false);

    const normalizeTagIds = (tagIds) => {
        if (!Array.isArray(tagIds)) {
            return [];
        }

        return tagIds
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && id > 0);
    };

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

    const openContactDialog = () => {
        setIsContactDialogOpen(true);
    };

    const closeContactDialog = () => {
        setIsContactDialogOpen(false);
    };

    const openStatusDialog = (section, outcome) => {
        setStatusDialogSection(section);
        setStatusDialogOutcome(outcome);
        setStatusDialogOpen(true);
    };

    const closeStatusDialog = () => {
        setStatusDialogOpen(false);
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
                setSelectedTags(normalizeTagIds(data.tagIds));
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
            await UserServices.updateUser(profileData);
            refreshCurrentUser();
            openStatusDialog("profile", "success");
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
            openStatusDialog("profile", "error");
        }

    };

    const handleTagSubmit = async (e) => {
        e.preventDefault();

        try {
            await UserServices.updateUserTags(selectedTags);
            openStatusDialog("triggers", "success");
        } catch (error) {
            console.error("Kunde inte uppdatera triggers", error);
            openStatusDialog("triggers", "error");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setErrors({ confirmNewPassword: "Lösenorden matchar inte" });
            return;
        }

        try {
            await UserServices.updatePassword(passwordData);
            setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
            openStatusDialog("password", "success");
        }
        catch (e) {
            const serverErrors = Array.isArray(e?.response?.data) ? e.response.data : [];
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

            if (Object.keys(newErrors).length === 0) {
                newErrors = { general: "Kunde inte uppdatera lösenordet. Försök igen senare." };
            }

            setErrors(newErrors);
            openStatusDialog("password", "error");
        }
    };

    const handleDelete = async () => {
        await deleteAccount();
        setOpen(false);
    };

    const handleAccordionChange = (section) => (_, isExpanded) => {
        setExpandedSection(isExpanded ? section : false);
    };

    return (
        <>
            <Box className="settingsContainer">
                <Grid
                    className="settings-top-row"
                >
                    <Button
                        className="settings-button"
                        onClick={logout}
                        sx={SettingsButtonStyles}
                    >
                        Logga ut
                        <LogoutIcon sx={{ color: 'var(--color-primary)' }} />
                    </Button>

                    <Button
                        className="settings-button"
                        onClick={openContactDialog}
                        sx={SettingsButtonStyles}
                    >
                        Kontakta oss
                        <img src={Headset} alt="edit" style={{
                            width: 20,
                            height: 20,
                        }} />
                        {/* <HeadsetMicOutlinedIcon sx={{ color: 'var(--color-primary)' }} /> */}
                    </Button>

                    <Button
                        className="settings-button"
                        // onClick={() => window.location.href = "/forum"}
                        sx={SettingsButtonStyles}
                    >
                        Om appen
                        <InfoOutlinedIcon sx={{ color: 'var(--color-primary)' }} />
                    </Button>
                </Grid>

                <form onSubmit={handleProfileSubmit}>
                    <Accordion
                        className="dropdown"
                        expanded={expandedSection === "profile"}
                        onChange={handleAccordionChange("profile")}
                    >
                        <AccordionSummary className="dropdown" expandIcon={<ArrowDropDownCircleOutlinedIcon sx={{ color: 'var(--color-primary)' }} />} >
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 0.5, py: 1 }}>
                                <img src={Settings} alt="edit" style={{
                                    width: 20,
                                    height: 20,
                                    filter: 'invert(78%) sepia(50%) saturate(500%) hue-rotate(330deg)'
                                }} />
                                Profilinställningar
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
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            height: 40,
                                            borderRadius: 20,
                                        },
                                        width: "80%"
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
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            height: 40,
                                            borderRadius: 20,
                                        },
                                        width: "80%"
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
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            height: 40,
                                            borderRadius: 20,
                                        },
                                        width: "80%"
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
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            height: 40,
                                            borderRadius: 20,
                                        },
                                        width: "80%"
                                    }}
                                />

                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <PrimaryButton type="submit" sx={{ mt: 2, borderRadius: 50, width: '75%' }}>
                                    Spara profil
                                </PrimaryButton>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <SecondaryButton
                                    onClick={handleClickOpen}
                                    sx={{
                                        borderRadius: 50,
                                        backgroundColor: 'var(--button-danger-bg)',
                                        color: 'var(--color-text-inverse)',
                                        width: '50%',
                                        alignItems: 'center',
                                        mt: 2,
                                        '&:hover': {
                                            backgroundColor: 'var(--button-danger-hover)',
                                        },
                                    }}
                                >
                                    Radera konto
                                </SecondaryButton>
                            </Box>

                        </AccordionDetails>
                    </Accordion>

                </form>

                <form onSubmit={handlePasswordSubmit}>
                    <Accordion
                        className="dropdown"
                        expanded={expandedSection === "password"}
                        onChange={handleAccordionChange("password")}
                    >
                        <AccordionSummary expandIcon={<ArrowDropDownCircleOutlinedIcon sx={{ color: 'var(--color-primary)' }} />}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 0.5, py: 1 }}>
                                <img src={Lock} alt="edit" style={{
                                    width: 20,
                                    height: 20,
                                    filter: 'invert(78%) sepia(50%) saturate(500%) hue-rotate(330deg)'
                                }} />Lösenordsinställningar</Typography>
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
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            height: 40,
                                            borderRadius: 20,
                                        },
                                        width: "80%"
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
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            height: 40,
                                            borderRadius: 20,
                                        },
                                        width: "80%"
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
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            height: 40,
                                            borderRadius: 20,
                                        },
                                        width: "80%"
                                    }}
                                />

                            </Box>

                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                <PrimaryButton type="submit" sx={{ mt: 2, borderRadius: 50, width: '75%' }}>
                                    Spara lösenord
                                </PrimaryButton>
                            </Grid>

                        </AccordionDetails>
                    </Accordion>
                </form>

                <form onSubmit={handleTagSubmit}>
                    <Accordion
                        className="dropdown"
                        expanded={expandedSection === "triggers"}
                        onChange={handleAccordionChange("triggers")}
                    >
                        <AccordionSummary expandIcon={<ArrowDropDownCircleOutlinedIcon sx={{ color: 'var(--color-primary)' }} />} >
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 0.5, py: 1 }}>
                                <img src={Report} alt="edit" style={{
                                    width: 20,
                                    height: 20,
                                    filter: 'saturate(500%)'
                                }} />
                                Triggers
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" color="var(--color-text-main)" sx={{ mb: 1 }}>
                                Välj triggers
                            </Typography>
                            <Select
                                multiple
                                fullWidth
                                value={selectedTags}
                                onChange={(e) => setSelectedTags(normalizeTagIds(e.target.value))}
                                input={<OutlinedInput />}
                                MenuProps={MenuProps}
                                renderValue={(selected) =>
                                    selected
                                        .map(id => tags.find(t => t.id === id)?.name ?? id)
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

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <PrimaryButton type="submit" sx={{ borderRadius: 50, width: '75%' }}>
                                    Spara triggers
                                </PrimaryButton>
                            </Box>
                        </AccordionDetails>

                    </Accordion>
                </form>

                <form>
                    <Accordion className="dropdown" expanded={false}>
                        <AccordionSummary className="switch-row-summary">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', px: 0.5, py: 1 }}>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <img src={Avatar} alt="edit" style={{
                                        width: 20,
                                        height: 20,
                                    }} />
                                    Publicera anonymt
                                </Typography>
                                <Switch
                                    className="settingsSwitch"
                                    checked={isAnonymousPublishing}
                                    onChange={(e) => setIsAnonymousPublishing(e.target.checked)}
                                    size="small"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </Box>
                        </AccordionSummary>
                    </Accordion>
                </form>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Är du säker på att du vill ta bort ditt konto?</DialogTitle>
                    <DialogActions>
                        <Button variant="text " color="inherit" onClick={handleClose}>Avbryt</Button>
                        <Button variant="contained" color="error" onClick={handleDelete} id="deleteUser">Ja, ta bort konto</Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={isContactDialogOpen}
                    onClose={closeContactDialog}
                    fullWidth
                    maxWidth="xs"
                    sx={{
                        "& .MuiDialog-paper": {
                            borderRadius: "16px",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.14)",
                            p: 1.5,
                        },
                    }}
                >
                    <ClickAwayListener onClickAway={closeContactDialog}>
                        <DialogContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                px: 2.5,
                                pt: 1,
                                pb: 1.5,
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img src={Headset} alt="edit" style={{
                                    width: 50,
                                    height: 50,
                                }} />
                            </Box>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: "var(--color-text-main)",
                                    fontWeight: 400,
                                    lineHeight: 1.4,
                                    maxWidth: 280,
                                }}
                            >
                                Kontakta gärna oss per mejl om du har några frågor eller om du vill prata med oss om vår app.
                                <Typography variant="body2" sx={{ color: "var(--button-secondary-text)", fontWeight: 700 }}>
                                    Vi ser fram emot att höra från dig!
                                </Typography>
                                <Typography variant="h5" sx={{ color: "var(--button-primary-bg)", fontWeight: 700, mt: 1 }}>
                                    info@mallo.se
                                </Typography>
                            </Typography>

                            <PrimaryButton
                                onClick={closeContactDialog}
                                sx={{
                                    mt: 0.5,
                                    borderRadius: "999px",
                                    width: "100%",
                                    maxWidth: 220,
                                    py: 1.1,
                                    textTransform: "none",
                                    fontWeight: 700,
                                }}
                            >
                                Stäng
                            </PrimaryButton>
                        </DialogContent>
                    </ClickAwayListener>
                </Dialog>

                <SettingsSuccessDialog
                    open={statusDialogOpen}
                    onClose={closeStatusDialog}
                    section={statusDialogSection}
                    outcome={statusDialogOutcome}
                />
            </Box>
        </>
    );
};

export default UserSettings;
