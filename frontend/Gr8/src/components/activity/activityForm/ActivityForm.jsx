import { useState, useRef, useEffect } from "react";
import { Dialog, Box, Typography, Paper, Stack, CircularProgress, IconButton, DialogContent, InputAdornment } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import SecondaryButton from "../../../design/buttons/SecondaryButton.jsx";
import ActivityServices from "../../../services/ActivityService.jsx";
import PrimaryButton from "../../../design/buttons/PrimaryButton.jsx";
import SearchAddress from "../search/SearchAddress.jsx"
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import CalendarPicker from "../calender/CalenderPicker.jsx";
import TimePicker from "../time/TimePicker.jsx";
import InputField from "../../../design/input/InputField.jsx";
import CloseIcon from "../../../assets/icons/closeIcon.svg";

dayjs.locale('sv');

const ActivityForm = ({ open, handleClose, onSuccess, activityToEdit }) => {
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState("form");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [timeConfigOpen, setTimeConfigOpen] = useState(false);
    const [calendarMode, setCalendarMode] = useState('start');
    const [error, setError] = useState("");
    const isEditMode = !!activityToEdit;

    // Backend data
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        Url: "",
        latitude: "",
        longitude: "",
        adressName: "",
        startAt: dayjs(),
        endAt: dayjs(),
        hasSelectedDate: false
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        fileInputRef.current.value = "";
    };

    // Edit or create
    useEffect(() => {
        if (open) {
            if (activityToEdit) {
                setFormData({
                    title: activityToEdit.title || "",
                    description: activityToEdit.description || "",
                    Url: activityToEdit.url || activityToEdit.Url || "",
                    latitude: activityToEdit.latitude || "",
                    longitude: activityToEdit.longitude || "",
                    adressName: activityToEdit.adress || activityToEdit.Adress || activityToEdit.adressName || "",
                    startAt: dayjs(activityToEdit.startAt),
                    endAt: dayjs(activityToEdit.endAt),
                    hasSelectedDate: true
                });
                setImagePreview(activityToEdit.imageUrl || null);
            } else {
                // Reset form for new activity
                setFormData({
                    title: "",
                    description: "",
                    Url: "",
                    latitude: "",
                    longitude: "",
                    adressName: "",
                    startAt: dayjs(),
                    endAt: dayjs(),
                    hasSelectedDate: false
                });
                setSelectedImage(null);
                setImagePreview(null);
            }
            setView("form");
        }
    }, [activityToEdit, open]);

    // Function for recive location in SearchAddress
    const handleLocationSelect = (locationData) => {
        if (locationData) {
            setFormData((prev) => ({
                ...prev,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                adressName: locationData.adressName
            }));
        }

        setView("form");
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!formData.adressName) {
            alert("Du måste välja en plats innan du publicerar.");
            return;
        }

        if (!formData.title) {
            alert("Du måste fylla i en titel.");
            return;
        }

        if (!formData.description) {
            alert("Du måste fylla i en beskrivning.");
            return;
        }

        if (!formData.startAt || !formData.endAt) {
            alert("Du måste fylla i start- och sluttid.");
            return;
        }

        setLoading(true);

        try {
            let response;

            if (isEditMode) {
                // Payload for edit
                const updatePayload = {
                    title: formData.title,
                    description: formData.description,
                    latitude: Number(formData.latitude),
                    longitude: Number(formData.longitude),
                    adress: formData.adressName,
                    startAt: dayjs(formData.startAt).toISOString(),
                    endAt: dayjs(formData.endAt).toISOString(),
                    url: formData.Url
                };

                response = await ActivityServices.update(activityToEdit.id, updatePayload);
            } else {
                // Create new activity
                const data = new FormData();
                data.append("title", formData.title);
                data.append("description", formData.description);
                data.append("latitude", Number(formData.latitude));
                data.append("longitude", Number(formData.longitude));
                data.append("adressName", formData.adressName);
                data.append("url", formData.Url);
                data.append("startAt", dayjs(formData.startAt).toISOString());
                data.append("endAt", dayjs(formData.endAt).toISOString());

                if (selectedImage) {
                    data.append("image", selectedImage);
                    data.append("imageMimetype", selectedImage.type);
                }

                response = await ActivityServices.create(data);
            }

            if (onSuccess) {
                onSuccess(response);
            }

            // Reset view to form for next time it's opened
            if (typeof setView === "function") {
                setView("form");
            }

        } catch (error) {
            console.error("Kunde inte spara aktivitet:", error);
            if (error.response?.status === 403) {
                setError("Du får inte redigera denna aktivitet.");
            }
            else if (error.response?.status === 404) {
                setError("Aktiviteten hittades inte.");
            }
            else {
                setError("Aktiviteten kunde inte redigeras. Försök igen.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={{ xs: true, md: false }}
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: "var(--color-primary-bg) !important"
                    },
                    borderRadius: { xs: 0, md: "15px" },
                    width: { md: "490px" },
                    maxWidth: { md: "490px" },
                    height: { md: "auto" },
                    maxHeight: { md: "calc(100% - 80px)" },
                    margin: { md: "auto" }
                }}
            >
                {view === "form" ? (
                    <Box sx={{ p: 2, mt: 6 }}>
                        <Paper sx={{ p: 2, mb: 3, borderRadius: 5, textAlign: 'center', border: '1px solid var(--color-border-light) opacity: 0.5' }}>
                            <Typography variant="h6" sx={{ justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                {isEditMode ? "Redigera " : "Publicera "}
                                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>Aktivitet</span>
                            </Typography>
                        </Paper>

                        <Paper sx={{ p: 3, borderRadius: 8, mb: 4, border: '1px solid var(--color-border-light) opacity: 0.5' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Titel</Typography>
                            <input
                                className="custom-input-simple"
                                placeholder="Skriv..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                style={{ width: '100%', border: 'none', outline: 'none', marginBottom: '20px', fontSize: '1rem' }}
                            />

                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Inlägg</Typography>
                            <textarea
                                placeholder="Skriv..."
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: '1rem' }}
                            />

                            {/* Live view of adress and date during creation/editing */}
                            {(formData.adressName || formData.hasSelectedDate) && (
                                <Box sx={{
                                    mt: 2,
                                    pt: 2,
                                    borderTop: '1px solid var(--color-border-light)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1
                                }}>
                                    {formData.adressName && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FmdGoodOutlinedIcon sx={{ color: "var(--color-primary)", fontSize: '1.2rem' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {formData.adressName.includes(',')
                                                    ? formData.adressName.split(',')[0].trim()
                                                    : formData.adressName
                                                }
                                            </Typography>
                                        </Box>
                                    )}

                                    {formData.hasSelectedDate && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarMonthOutlinedIcon sx={{ color: "var(--color-primary)", fontSize: '1.2rem' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {dayjs(formData.startAt).format("D MMMM YYYY, [kl.] HH:mm")}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, alignItems: 'center' }}>
                                <InputField
                                    placeholder="Skriv länkadress"
                                    value={formData.Url || ""}
                                    onChange={(e) => setFormData({ ...formData, Url: e.target.value })}

                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            width: "100%", height: "40px"
                                        },
                                        "& .MuiInputBase-input::placeholder": {
                                            fontSize: { xs: "10px", md: "15px" },
                                        }
                                    }}

                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LinkIcon sx={{ color: "var(--color-primary)", rotate: "140deg" }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleImageChange}
                                />

                                <SecondaryButton
                                    startIcon={
                                        <ImageOutlinedIcon sx={{ color: "var(--color-primary)", width: "30px", height: "22px" }} />
                                    }
                                    label="Välj foto"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Välj foto
                                </SecondaryButton>

                                {imagePreview ? (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box
                                            component="img"
                                            src={imagePreview}
                                            alt="Vald bild"
                                            sx={{ width: 48, height: 48, borderRadius: 1, objectFit: "cover", border: "1px solid var(--color-border)" }}
                                        />
                                        <IconButton size="small" onClick={handleRemoveImage}>
                                            <img src={CloseIcon} alt="close" style={{ width: "25px", height: "25px" }} />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Typography variant="caption" color="text.secondary">
                                        Ingen bild vald
                                    </Typography>
                                )}

                            </Box>

                            <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <SecondaryButton startIcon=
                                    {<FmdGoodOutlinedIcon
                                        sx={{
                                            color: "var(--color-primary)",
                                            width: "30px",
                                            height: "22px"
                                        }}
                                    />
                                    }
                                    label={formData.adressName || "Välj plats"}
                                    onClick={() => setView("search")}
                                >
                                    Välj plats
                                </SecondaryButton>

                                <SecondaryButton startIcon=
                                    {<CalendarMonthOutlinedIcon
                                        sx={{ color: "var(--color-primary)" }}
                                    />
                                    } onClick={() => {
                                        setCalendarMode('start');
                                        setCalendarOpen(true);
                                    }}
                                >
                                    Datum & tid
                                </SecondaryButton>
                            </Box>
                        </Paper>

                        <Stack direction="row" spacing={2}>
                            <PrimaryButton fullWidth onClick={handleClose}
                                style={{ backgroundColor: 'white', color: 'var(--color-text-main)' }}
                            >
                                Avsluta
                            </PrimaryButton>

                            <PrimaryButton fullWidth onClick={handleSubmit}
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : isEditMode ? (
                                    "Spara"
                                ) : (
                                    "Publicera"
                                )}
                            </PrimaryButton>
                        </Stack>
                    </Box>
                ) : (
                    <SearchAddress onSelect={handleLocationSelect} onBack={() => setView("form")} />
                )}
            </Dialog>

            <CalendarPicker
                open={calendarOpen}
                onClose={() => setCalendarOpen(false)}
                mode={calendarMode}
                value={calendarMode === 'start' ? formData.startAt : formData.endAt}
                onChange={(newDate) => {
                    if (calendarMode === 'start') {
                        setFormData({
                            ...formData,
                            startAt: newDate,
                            endAt: newDate,
                            hasSelectedDate: true
                        });
                    } else {
                        setFormData({
                            ...formData,
                            endAt: newDate,
                            hasSelectedDate: true
                        });
                    }
                    setCalendarOpen(false);
                    setTimeConfigOpen(true);
                }}
            />

            < TimePicker
                open={timeConfigOpen}
                onClose={() => setTimeConfigOpen(false)}
                onOpenCalendar={(mode) => {
                    setCalendarMode(mode);
                    setTimeConfigOpen(false);
                    setCalendarOpen(true);
                }}
                formData={formData}
                setFormData={setFormData}
            />
        </>
    );
};

export default ActivityForm;