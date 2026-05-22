import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "../../../assets/icons/closeIcon.svg";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const ActivityFilter = ({ open, onClose, onApply, currentFilters }) => {


    const filters = currentFilters || { nearby: false, yourActivities: false, savedActivities: false, time: false };

    // Function for clear filters
    const handleClearAll = () => {
        onApply({ nearby: false, yourActivities: false, savedActivities: false, time: false });
    };

    // OnApply function to save immediately when a filter is toggled
    const handleRowClick = (filterKey) => {
        onApply({
            ...filters, // Copy the existing filters
            [filterKey]: !filters[filterKey] // Find the filter we clicked on and toggle it (true becomes false / false becomes true)
        });
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
                            bgcolor: filters.nearby ? "var(--color-primary-bg)" : 'transparent',
                            '&:hover': { bgcolor: '#FAFAFA' }
                        }}
                    >
                        {filters.nearby && <FiberManualRecordIcon sx={{ color: "var(--color-primary)", fontSize: '10px', mr: 1.5 }} />}
                        <Typography sx={{ fontWeight: 500, ml: filters.nearby ? 0 : '22px' }}>
                            Nära dig
                        </Typography>
                    </Box>

                    <Box
                        onClick={() => handleRowClick('yourActivities')}
                        sx={{
                            display: 'flex', alignItems: 'center', px: 3, py: 2.5, cursor: 'pointer',
                            borderBottom: '1px solid var(--color-ui-muted)',
                            bgcolor: filters.yourActivities ? "var(--color-primary-bg)" : 'transparent',
                            '&:hover': { bgcolor: '#FAFAFA' }
                        }}
                    >
                        {filters.yourActivities && <FiberManualRecordIcon sx={{ color: "var(--color-primary)", fontSize: '10px', mr: 1.5 }} />}
                        <Typography sx={{ fontWeight: 500, color: '#444', ml: filters.yourActivities ? 0 : '22px' }}>
                            Dina aktiviteter
                        </Typography>
                    </Box>

                    <Box
                        onClick={() => handleRowClick('savedActivities')}
                        sx={{
                            display: 'flex', alignItems: 'center', px: 3, py: 2.5, cursor: 'pointer',
                            borderBottom: '1px solid var(--color-ui-muted)',
                            bgcolor: filters.savedActivities ? "var(--color-primary-bg)" : 'transparent',
                            '&:hover': { bgcolor: '#FAFAFA' }
                        }}
                    >
                        {filters.savedActivities && <FiberManualRecordIcon sx={{ color: "var(--color-primary)", fontSize: '10px', mr: 1.5 }} />}
                        <Typography sx={{ fontWeight: 500, ml: filters.savedActivities ? 0 : '22px' }}>
                            Sparade aktiviteter
                        </Typography>
                    </Box>

                    <Box
                        onClick={() => handleRowClick('time', filters.time)}
                        sx={{
                            display: 'flex', alignItems: 'center', px: 3, py: 2.5, cursor: 'pointer',
                            bgcolor: filters.time ? "var(--color-primary-bg)" : 'transparent',
                            '&:hover': { bgcolor: '#FAFAFA' }
                        }}
                    >
                        {filters.time && <FiberManualRecordIcon sx={{ color: "var(--color-primary)", fontSize: '10px', mr: 1.5 }} />}
                        <Typography sx={{ fontWeight: 500, ml: filters.time ? 0 : '22px' }}>
                            Tidpunkt
                        </Typography>
                    </Box>

                    <Button
                        onClick={handleClearAll}
                        sx={{ backgroundColor: "var(--color-ui-muted)", fontSize: '0.85rem', textTransform: 'none', fontWeight: 500 }}
                    >
                        Rensa filter
                    </Button>

                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ActivityFilter;