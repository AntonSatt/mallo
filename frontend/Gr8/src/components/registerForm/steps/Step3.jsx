import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import PrimaryButton from "../../../design/buttons/PrimaryButton";
import SecondaryButton from "../../../design/buttons/SecondaryButton";
import notificationBell from "../../../assets/icons/notificationBell.svg";
import { useNavigate } from "react-router-dom";
import InputField from "../../../design/input/InputField";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Accordion } from "../TermsAccordion";
import {
    onPermissionStateChange,
    PERMISSION_STATE,
    PERMISSION_TYPE,
    queryPermissionState,
    requestPermission
} from "../../../utils/browserPermissions";

// Step 3 of registration: Finalizes account creation by collecting email, password,
// and handling user consent for terms, privacy policy, and notifications.
const Step3 = ({ formData, handleChange, onNext, error }) => {
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();
    const [allowNotifications, setAllowNotifications] = useState(false);
    const [notificationPermissionState, setNotificationPermissionState] = useState(PERMISSION_STATE.PROMPT);
    const [approveTerms, setApproveTerms] = useState(false);
    const [termsError, setTermsError] = useState("");

    useEffect(() => {
        let mounted = true;

        const syncPermission = async () => {
            const state = await queryPermissionState(PERMISSION_TYPE.NOTIFICATIONS);
            if (!mounted) return;
            setNotificationPermissionState(state);
            setAllowNotifications(state === PERMISSION_STATE.GRANTED);
        };

        void syncPermission();

        const unsubscribe = onPermissionStateChange(PERMISSION_TYPE.NOTIFICATIONS, (state) => {
            setNotificationPermissionState(state);
            setAllowNotifications(state === PERMISSION_STATE.GRANTED);
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const handleNext = () => {
        if (!approveTerms) {
            setTermsError("Du måste godkänna användarvillkoren och integritetspolicyn för att fortsätta.");
            return;
        }
        setTermsError(false);
        onNext();
    };

    const handleNotificationToggle = async () => {
        if (notificationPermissionState === PERMISSION_STATE.DENIED) {
            setAllowNotifications(false);
            return;
        }

        const result = await requestPermission(PERMISSION_TYPE.NOTIFICATIONS);
        const nextState = result?.state ?? PERMISSION_STATE.PROMPT;
        setNotificationPermissionState(nextState);
        setAllowNotifications(nextState === PERMISSION_STATE.GRANTED);
    };

    const isNotificationsBlocked = notificationPermissionState === PERMISSION_STATE.DENIED;
    const notificationTextColor = isNotificationsBlocked ? "rgba(0, 0, 0, 0.45)" : "inherit";
    const notificationIconColor = isNotificationsBlocked ? "rgba(0, 0, 0, 0.35)" : "var(--color-primary)";

    return (
        <Box container className="register-step3" spacing={0}>
            <Typography variant="body2" sx={{ mt: 3 }}>
                E-post
            </Typography>

            <InputField
                fullWidth
                id="email"
                placeholder="Exempel@epost.se"
                value={formData.email}
                onChange={handleChange}
                error={!!error.email}
                helperText={error.email}
                sx={{
                    "& .MuiOutlinedInput-input": {
                        textAlign: "center"
                    },
                    "& .MuiOutlinedInput-root": {
                        height: 40,
                        borderRadius: 20
                    }
                }}
            />

            <Typography variant="body2" sx={{ mt: 2 }}>
                Lösenord
            </Typography>

            <InputField
                fullWidth
                id="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                error={!!error.password}
                helperText={error.password}
                type="password"
                sx={{
                    "& .MuiOutlinedInput-input": {
                        textAlign: "center"
                    },
                    "& .MuiOutlinedInput-root": {
                        height: 40,
                        borderRadius: 20
                    }
                }}
            />

            <Typography variant="body2" sx={{ mt: 2 }}>
                Bekräfta lösenord
            </Typography>

            <InputField
                fullWidth
                id="confirmPassword"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!error.confirmPassword}
                helperText={error.confirmPassword}
                type="password"
                sx={{
                    "& .MuiOutlinedInput-input": {
                        textAlign: "center"
                    },
                    "& .MuiOutlinedInput-root": {
                        height: 40,
                        borderRadius: 20
                    }
                }}
            />

            <Box
                onClick={() => setApproveTerms(!approveTerms)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    cursor: "pointer",
                    userSelect: "none"
                }}
            >
                {approveTerms ? (
                    <CheckCircleIcon sx={{ color: "var(--color-primary)", fontSize: "16px" }} />
                ) : (
                    <CircleOutlinedIcon sx={{ color: "var(--color-primary)", fontSize: "16px", mt: 0.5 }} />
                )}

                <Typography variant="caption" sx={{ mt: 1, mb: 0.5 }}>
                    Jag godkänner{" "}
                    <span
                        style={{ color: "var(--color-primary)", cursor: "pointer", textDecoration: "underline" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen("anvÃ¤ndarvillkor");
                        }}
                    >
                        användarvillkoren
                    </span>{" "}
                    och{" "}
                    <span
                        style={{ color: "var(--color-primary)", cursor: "pointer", textDecoration: "underline" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen("integritetspolicy");
                        }}
                    >
                        integritetspolicyn
                    </span>
                </Typography>
            </Box>

            {termsError && (
                <Typography variant="caption" sx={{ color: "red", textAlign: "center", display: "block", mb: 1 }}>
                    {termsError}
                </Typography>
            )}

            <Box
                onClick={() => {
                    void handleNotificationToggle();
                }}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    cursor: "pointer",
                    userSelect: "none",
                    opacity: isNotificationsBlocked ? 0.85 : 1
                }}
            >
                {allowNotifications ? (
                    <CheckCircleIcon sx={{ color: notificationIconColor, fontSize: "16px" }} />
                ) : (
                    <CircleOutlinedIcon sx={{ color: notificationIconColor, fontSize: "16px", mb: 0.3 }} />
                )}

                <Typography variant="caption" sx={{ mt: 1, mb: 1, color: notificationTextColor }}>
                    Tillåt notiser i appen
                    <img
                        src={notificationBell}
                        alt=""
                        style={{
                            verticalAlign: "middle",
                            marginLeft: "6px",
                            width: "13px",
                            marginBottom: "5px",
                            opacity: isNotificationsBlocked ? 0.5 : 1
                        }}
                    />
                </Typography>
            </Box>

            {isNotificationsBlocked && (
                <Typography variant="caption" sx={{ color: "rgba(0, 0, 0, 0.55)", mb: 1 }}>
                    Blockerad
                </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, width: "100%", mt: 3 }}>
                <SecondaryButton onClick={() => navigate("/")}>Avsluta</SecondaryButton>

                <PrimaryButton onClick={handleNext} startIcon={<ControlPointOutlinedIcon sx={{ color: "white" }} />}>
                    Skapa konto
                </PrimaryButton>
            </Box>
            {open && <Accordion id={open} onClose={() => setOpen(null)} />}
        </Box>
    );
};

export default Step3;