import { Dialog, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SidebarCalendar from "../../layout/SidebarCalendar.jsx";

const ActivityCalendarDialog = ({
    open,
    onClose,
    markedDates,
    activities,
    setAlignment,
    setSelectedActivity
}) => {

    const handleMarkedDayClick = (activityId) => {
        onClose();

        const activity = activities.find(a => a.id === activityId);

        if (!activity) return;

        setAlignment("list");

        setTimeout(() => {
            setSelectedActivity(activity);

            const el = document.getElementById(`activity-card-${activityId}`);

            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                el.click();
            }
        }, 150);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "24px",
                    overflow: "hidden",
                    margin: 2,
                    backgroundColor: "transparent",
                    boxShadow: "none",
                }
            }}
        >
            <Box sx={{ position: "relative" }}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 18,
                        top: 18,
                        zIndex: 10,
                        padding: 2,
                        color: "var(--color-text-secondary)",
                        "&:hover": {
                            backgroundColor: "transparent"
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <SidebarCalendar
                    transparentBackground
                    markedDates={markedDates}
                    onMarkedDayClick={handleMarkedDayClick}
                />
            </Box>
        </Dialog>
    );
};

export default ActivityCalendarDialog;