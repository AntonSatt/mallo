import { useState, useRef } from "react";
import { Dialog, Box, Typography, Paper, Stack, CircularProgress, IconButton } from "@mui/material";
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
import CloseIcon from '@mui/icons-material/Close';

dayjs.locale('sv');

const ActivityForm = ({ open, handleClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState("form");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [timeConfigOpen, setTimeConfigOpen] = useState(false);
    const [calendarMode, setCalendarMode] = useState('start');

    // Backend data
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        Url: "",
        latitude: "",
        longitude: "",
        addressName: "",
        startAt: dayjs(),
        endAt: dayjs(),
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

    // Function for recive location in SearchAddress
    const handleLocationSelect = (locationData) => {
        if (locationData) {
            setFormData((prev) => ({
                ...prev,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                addressName: locationData.addressName
            }));
        }
        setView("form");
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("url", formData.Url);
            data.append("latitude", formData.latitude);
            data.append("longitude", formData.longitude);
            data.append("startAt", formData.startAt.toISOString());
            data.append("endAt", formData.endAt.toISOString());

            if (selectedImage) {
                data.append("image", selectedImage);
                data.append("imageMimeType", selectedImage.type);
            }

            await ActivityServices.create(data);

            // Send to backend
            const response = await ActivityServices.create(data);

            // If the backend returns the created activity, pass it to onSuccess. Otherwise, pass the formData as a fallback.
            if (onSuccess && response?.data) {
                onSuccess(response.data);
            } else if (onSuccess) {
                // Fallback 
                onSuccess(formData);
            }

            setView("form"); // Reset view to form for next time it's opened
        } catch (error) {
            console.error("Kunde inte skapa aktivitet:", error);
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
                                Publicera <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>Aktivitet</span>
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
                            <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, alignItems: 'center' }}>
                                <InputField startIcon={<LinkIcon sx={{ color: "var(--color-primary)" }} />}
                                    value={formData.Url || ""}
                                    onChange={(e) => setFormData({ ...formData, Url: e.target.value })}
                                    placeholder="Skriv länkadress">
                                </InputField>

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
                                        {/* <Typography variant="caption" noWrap sx={{ flex: 1, maxWidth: 100 }}>
                                            {selectedImage.name}
                                        </Typography> */}
                                        <IconButton size="small" onClick={handleRemoveImage}>
                                            <CloseIcon fontSize="small" />
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
                                    label={formData.addressName || "Välj plats"}
                                    onClick={() => setView("search")}
                                >
                                    Välj plats
                                </SecondaryButton>

                                <SecondaryButton startIcon=
                                    {<CalendarMonthOutlinedIcon
                                        sx={{ color: "var(--color-primary)" }}
                                    />
                                    } onClick={() => setCalendarOpen(true)}
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
                                {loading ? <CircularProgress size={24} /> : "Publicera"}
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
                value={calendarMode === 'start' ? formData.startAt : formData.endAt}
                onChange={(newDate) => {
                    if (calendarMode === 'start') {
                        setFormData({ ...formData, startAt: newDate, endAt: newDate });
                    } else {
                        setFormData({ ...formData, endAt: newDate });
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