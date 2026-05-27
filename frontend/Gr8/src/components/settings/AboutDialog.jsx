import {
    Dialog,
    DialogContent,
    Typography,
    Box,
    ClickAwayListener,
} from "@mui/material";

import PrimaryButton from "../../design/buttons/PrimaryButton";

const AboutDialog = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "20px",
                    padding: "12px",
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
                        px: 3,
                        py: 2,
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: "var(--color-text-main)",
                        }}
                    >
                        Om Mallo
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: 1.8,
                            color: "var(--color-text-main)",
                        }}
                    >
                        Mallo är en app skapad för att hjälpa människor att hitta och delta i aktiviteter nära dem.
                        Vår vision är att göra det enkelt att engagera sig i sin omgivning, träffa nya människor
                        och skapa meningsfulla upplevelser tillsammans.
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: 1.8,
                            color: "var(--color-text-main)",
                        }}
                    >
                        Genom Mallo kan du skapa egna aktiviteter, hitta events i närheten, spara favoriter
                        och hålla koll på kommande aktiviteter i din personliga kalender.
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: 1.8,
                            color: "var(--color-text-main)",
                        }}
                    >
                        Vi tror på kraften i gemenskap och Mallo är vår väg att förverkliga det.
                    </Typography>

                    <PrimaryButton
                        onClick={onClose}
                        sx={{
                            mt: 1,
                            borderRadius: "999px",
                            width: "100%",
                            maxWidth: 220,
                        }}
                    >
                        Stäng
                    </PrimaryButton>
                </DialogContent>
            </ClickAwayListener>
        </Dialog>
    );
};

export default AboutDialog;