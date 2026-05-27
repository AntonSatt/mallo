import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "../../../assets/icons/closeIcon.svg";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PrimaryButton from "../../../design/buttons/PrimaryButton.jsx";
import { useState } from "react";

const ActivityFilter = ({ open, onClose, onApply, currentFilters }) => {

    const [localFilters, setLocalFilters] = useState(
        currentFilters || { nearby: false, yourActivities: false, savedActivities: false, time: false }
    );

    // Function for clear filters
    const handleClearAll = () => {
        const cleared = { nearby: false, yourActivities: false, savedActivities: false, time: false };

        setLocalFilters(cleared);
        onApply(cleared);
    };

    const handleRowClick = (filterKey) => {
        setLocalFilters({
            ...localFilters,
            [filterKey]: !localFilters[filterKey]
        });
    };

    // Save selected filters and close dialog
    const handleSave = () => {
        onApply(localFilters);
        onClose();
    };

    return (
        <Dialog
            sx={{
                '& .MuiDialog-paper': {
                    width: '90%',
                    maxWidth: '360px',
                    borderRadius: '25px',
                    overflow: 'hidden'
                }
            }}
            open={open}
            onClose={onClose}
        >
            {/* Header  */}
            <Box sx={{ bgcolor: "var(--color-primary-soft)", p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <DialogTitle sx={{ p: 1, ml: 2, fontWeight: 700, fontSize: '1.2rem' }}>
                    Filtrera på
                </DialogTitle>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={onClose}>
                        <img src={CloseIcon} alt="close" style={{ width: "25px", height: "25px", color: "var(--color-border-light)" }} />
                    </IconButton>
                </Box>
            </Box>

            {/* List with filters */}
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                    <Box
                        onClick={() => handleRowClick('nearby')}
                        sx={{
                            display: 'flex', alignItems: 'center', px: 3, py: 2.5, cursor: 'pointer',
                            borderBottom: '1px solid var(--color-ui-muted)',
                            bgcolor: localFilters.nearby ? "var(--color-primary-bg)" : 'transparent',
                            '&:hover': { bgcolor: '#FAFAFA' }
                        }}
                    >
                        {localFilters.nearby && <FiberManualRecordIcon sx={{ color: "var(--color-primary)", fontSize: '10px', mr: 1.5 }} />}
                        <Typography sx={{ fontWeight: 500, ml: localFilters.nearby ? 0 : '22px' }}>
                            Nära dig
                        </Typography>
                    </Box>

                    <Box
                        onClick={() => handleRowClick('yourActivities')}
                        sx={{
                            display: 'flex', alignItems: 'center', px: 3, py: 2.5, cursor: 'pointer',
                            borderBottom: '1px solid var(--color-ui-muted)',
                            bgcolor: localFilters.yourActivities ? "var(--color-primary-bg)" : 'transparent',
                            '&:hover': { bgcolor: '#FAFAFA' }
                        }}
                    >
                        {localFilters.yourActivities && <FiberManualRecordIcon sx={{ color: "var(--color-primary)", fontSize: '10px', mr: 1.5 }} />}
                        <Typography sx={{ fontWeight: 500, color: '#444', ml: localFilters.yourActivities ? 0 : '22px' }}>
                            Dina aktiviteter
                        </Typography>
                    </Box>

                    <Box
                        onClick={() => handleRowClick('savedActivities')}
                        sx={{
                            display: 'flex', alignItems: 'center', px: 3, py: 2.5, cursor: 'pointer',
                            borderBottom: '1px solid var(--color-ui-muted)',
                            bgcolor: localFilters.savedActivities ? "var(--color-primary-bg)" : 'transparent',
                            '&:hover': { bgcolor: '#FAFAFA' }
                        }}
                    >
                        {localFilters.savedActivities && <FiberManualRecordIcon sx={{ color: "var(--color-primary)", fontSize: '10px', mr: 1.5 }} />}
                        <Typography sx={{ fontWeight: 500, ml: localFilters.savedActivities ? 0 : '22px' }}>
                            Sparade aktiviteter
                        </Typography>
                    </Box>

                    <Box
                        onClick={() => handleRowClick('time', localFilters.time)}
                        sx={{
                            display: 'flex', alignItems: 'center', px: 3, py: 2.5, cursor: 'pointer',
                            borderBottom: '1px solid var(--color-ui-muted)',
                            bgcolor: localFilters.time ? "var(--color-primary-bg)" : 'transparent',
                            '&:hover': { bgcolor: '#FAFAFA' }
                        }}
                    >
                        {localFilters.time && <FiberManualRecordIcon sx={{ color: "var(--color-primary)", fontSize: '10px', mr: 1.5 }} />}
                        <Typography sx={{ fontWeight: 500, ml: localFilters.time ? 0 : '22px' }}>
                            Tidpunkt
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        mt: 2,
                        mb: 2
                    }}>
                        <Button
                            onClick={handleClearAll}
                            sx={{
                                backgroundColor: "var(--color-bg-muted)", fontSize: '0.85rem',
                                textTransform: 'none', fontWeight: 500, width: { xs: "130px", md: "150px" },
                                borderRadius: '20px', px: 0,
                            }}
                        >
                            Rensa
                        </Button>

                        <PrimaryButton
                            onClick={handleSave}
                            sx={{ width: { xs: "130px", md: "150px" }, px: 0, ml: 2 }}>
                            Spara
                        </PrimaryButton>
                    </Box>

                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ActivityFilter;