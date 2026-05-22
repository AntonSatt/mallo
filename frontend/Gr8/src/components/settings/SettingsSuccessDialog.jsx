import { Box, ClickAwayListener, Dialog, DialogContent, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PrimaryButton from "../../design/buttons/PrimaryButton.jsx";

const successMessages = {
    profile: "Dina profilinställningar har sparats.",
    password: "Ditt lösenord har uppdaterats.",
    triggers: "Dina triggers har sparats.",
};

const SettingsSuccessDialog = ({ open, onClose, variant = "profile" }) => {
    const message = successMessages[variant] ?? successMessages.profile;

    const handleDialogClose = () => {
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
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
            <ClickAwayListener onClickAway={onClose}>
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
                            borderRadius: "50%",
                            backgroundColor: "var(--color-primary-soft)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CheckCircleRoundedIcon sx={{ color: "var(--color-primary)", fontSize: 36 }} />
                    </Box>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "var(--color-text-main)",
                            fontWeight: 700,
                            lineHeight: 1.4,
                            maxWidth: 260,
                        }}
                    >
                        {message}
                    </Typography>

                    <PrimaryButton
                        onClick={onClose}
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
    );
};

export default SettingsSuccessDialog;
