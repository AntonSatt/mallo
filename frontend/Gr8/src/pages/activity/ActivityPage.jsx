import { useState } from "react";
import ActivityForm from "../../components/activity/activityForm/ActivityForm.jsx";
import MapComponent from "../../components/activity/map/MapForm.jsx";
import PrimaryButton from "../../design/buttons/PrimaryButton";
import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SearchHeart from "../../assets/icons/searchHeartForum.svg";
import { Box, InputAdornment, Grid } from "@mui/material";
import InputField from "../../design/input/InputField.jsx";
import ActivityFeed from "../../components/activity/feed/ActivityFeed.jsx";

const ActivityPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const handleOpenForm = () => setIsFormOpen(true);

    const handleSuccess = () => {
        setIsFormOpen(false);
    };

    const [alignment, setAlignment] = React.useState('map');

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    return (

        //Wrapper for the whole container
        <Box className="activity-page-container" sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100vw', md: '490px' },
            height: { xs: '100vh', md: 'auto' },
            overflow: { xs: 'hidden', md: 'visible' },
            margin: { xs: 0, md: '40px auto' },
            backgroundColor: { xs: 'transparent', md: 'var(--button-secondary-bg)' },
            borderRadius: { xs: 0, md: '20px' },
            padding: { xs: 0, md: '16px' },
            border: { xs: 'none', md: '1px solid var(--color-border-light)' },
        }}>

            {/* Map - default map view with short list */}
            {alignment === 'map' && (
                <Box className="activity-map-wrapper" sx={{ position: 'relative', zIndex: 1, height: "45vh", overflow: 'hidden', borderRadius: { xs: 0, md: "15px" } }}>
                    <MapComponent />
                </Box>
            )}

            {/* Search header */}
            <Box className="activity-search-header" sx={{
                bgcolor: 'var(--color-primary-soft)',
                pt: 3, pb: 2,
                px: 2,
                display: 'flex',
                justifyContent: 'center',
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px"
            }}>
                <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
                    <InputField
                        fullWidth
                        placeholder="Sök..."
                        sx={{
                            "& .MuiOutlinedInput-input": { textAlign: "center" },
                            "& .MuiOutlinedInput-root": {
                                height: 45,
                                borderRadius: 25,
                                bgcolor: 'white !important'
                            },
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <img
                                            src={SearchHeart}
                                            alt="search"
                                            style={{ width: 22, height: 22, cursor: 'pointer' }}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Box>
            </Box>

            {/* White box with buttons */}
            <Box className="activity-button-header" sx={{
                bgcolor: 'white',
                py: 2,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0px -2px 8px rgba(0,0,0,0.03)',
                zIndex: 2,
                borderRadius: { xs: 0, md: "10px 10px 0 0" }
            }}>

                <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    sx={{
                        bgcolor: 'var(--color-primary-soft)',
                        borderRadius: '40px',
                        p: 0,
                        border: 'none',
                        height: '40px',
                        boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
                        overflow: "hidden",
                        '& .MuiToggleButtonGroup-grouped': {
                            border: 'none',
                            mx: 0,
                        },
                    }}
                >
                    <ToggleButton
                        value="map"
                        sx={{
                            flex: 1,
                            px: 3,
                            textTransform: 'none',
                            color: 'var(--color-text-main)',
                            gap: 1,
                            borderTopLeftRadius: '40px',
                            borderBottomLeftRadius: '40px',
                            '& .MuiSvgIcon-root': {
                                color: 'var(--color-primary)',
                            },
                            '&.Mui-selected': {
                                bgcolor: 'var(--color-primary) !important',
                                color: 'white !important',
                                '& .MuiSvgIcon-root': {
                                    color: 'white !important',
                                }
                            },
                        }}
                    >
                        <MapOutlinedIcon sx={{ fontSize: 20 }} />
                        Karta
                    </ToggleButton>

                    <ToggleButton
                        value="list"
                        sx={{
                            flex: 1,
                            px: 3,
                            textTransform: 'none',
                            color: 'var(--color-text-main)',
                            gap: 1,
                            borderTopRightRadius: '40px',
                            borderBottomRightRadius: '40px',
                            '& .MuiSvgIcon-root': {
                                color: 'var(--color-primary)',
                            },
                            '&.Mui-selected': {
                                bgcolor: 'var(--color-primary) !important',
                                color: 'white !important',
                                '& .MuiSvgIcon-root': {
                                    color: 'white !important',
                                }
                            },
                        }}
                    >
                        <FormatListBulletedOutlinedIcon sx={{ fontSize: 20 }} />
                        Lista
                    </ToggleButton>
                </ToggleButtonGroup>

                <PrimaryButton
                    sx={{ width: "110px", height: "40px" }}
                    startIcon={<AddCircleOutlineOutlinedIcon sx={{ color: "white" }} />}
                    onClick={handleOpenForm}
                >
                    Skapa
                </PrimaryButton>
            </Box>

            {/* List view - whole screen */}
            <Box className="activity-feed-wrapper" sx={{
                flex: 1,
                bgcolor: 'white',
                overflowY: 'auto',
                pb: 10,
                height: alignment === 'map' ? '25vh' : 'auto',
                minHeight: alignment === 'map' ? '25vh' : 'auto',
            }}>
                <ActivityFeed />
            </Box>

            <ActivityForm
                open={isFormOpen}
                handleClose={() => setIsFormOpen(false)}
                onSuccess={handleSuccess}
            />
        </Box>
    );
};

export default ActivityPage;