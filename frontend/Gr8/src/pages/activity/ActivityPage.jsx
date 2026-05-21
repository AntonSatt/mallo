import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import ActivityServices from "../../services/ActivityService.jsx";
import ActivityForm from "../../components/activity/activityForm/ActivityForm.jsx";
import ActivityFilter from "../../components/activity/feed/ActivityFilter.jsx";
import ActivityFeed from "../../components/activity/feed/ActivityFeed.jsx";
import MapComponent from "../../components/activity/map/MapForm.jsx";
import PrimaryButton from "../../design/buttons/PrimaryButton";
import InputField from "../../design/input/InputField.jsx";
import Filter from "../../assets/icons/filter.svg";
import SearchHeart from "../../assets/icons/searchHeartForum.svg";
import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Box, InputAdornment, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import distance from "@turf/distance";


const ActivityPage = () => {
    const { currentUser } = useAuth();
    const currentUserId = currentUser?.sub;

    const [editActivity, setEditActivity] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [alignment, setAlignment] = React.useState('map');
    const [filterOpen, setFilterOpen] = useState(false);
    const [userCoords, setUserCoords] = useState(null);
    const [activeFilters, setActiveFilters] = useState({
        nearby: false,
        yourActivities: false,
        savedActivities: false,
        time: false
    });
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') return;
        setToast(prev => ({ ...prev, open: false }));
    };

    const handleOpenForm = () => {
        setIsFormOpen(true);
        setEditActivity(null);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditActivity(null);
    };

    // Handles both create and edit Activity
    const handleFormSuccess = (savedActivity) => {
        setIsFormOpen(false);

        setActivities(prevActivities => {
            const exists = prevActivities.some(act => act.id === savedActivity.id);

            if (exists) {
                return prevActivities.map(act => act.id === savedActivity.id ? savedActivity : act);
            } else {
                return [savedActivity, ...prevActivities];
            }
        });

        if (editActivity) {
            setToast({
                open: true,
                message: "Aktiviteten har redigerats!",
                severity: "success"
            });
        }

        setEditActivity(null);
    };

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    // Function to handle actions from the activity cards (edit, delete, etc)
    const handleCardAction = (actionOrMessage, severity = "success", deletedId = null) => {
        if (actionOrMessage === "edit" && severity && typeof severity === "object") {
            const activityToEdit = severity;
            setEditActivity(activityToEdit);
            setIsFormOpen(true);
            return;
        }

        if (deletedId) {
            setActivities(prev => prev.filter(act => act.id !== deletedId));
        }

        // Confirm popup
        setToast({
            open: true,
            message: actionOrMessage,
            severity: severity
        });
    };

    // Fetch activities from backend 
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const data = await ActivityServices.getAll();
                setActivities(data || []);
            } catch (err) {
                console.error("Error fetching activities:", err);
                setError("Kunde inte hämta aktiviteter. Försök igen senare.");
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    // Get user's current location 
    useEffect(() => {
        if (!userCoords) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (err) => console.error("Kunde inte hämta position", err),
                { enableHighAccuracy: true }
            );
        }
    }, [userCoords]);

    // Apply filters to activities
    const filteredActivities = activities
        .map(activity => {
            // Calculate distance if we have user coordinates and activity has location data
            if (userCoords) {
                const from = [userCoords.lng, userCoords.lat];
                const to = [activity.longitude, activity.latitude];
                const distanceInMeters = distance(from, to, { units: 'meters' });
                return { ...activity, distanceMeters: distanceInMeters };
            }
            return activity;
        })
        .filter(activity => {
            // Nearby filter
            if (activeFilters.nearby) {
                if (!userCoords) return false; // If we don't have user location, we can't show nearby activities
                if (activity.distanceMeters > 7000) return false;
            }

            // Your activities filter
            if (activeFilters.yourActivities) {
                if (!currentUserId) return false;

                if (activity.userId !== currentUserId) {
                    return false;
                }
            }

            // Time filter - only show upcoming activities
            if (activeFilters.time) {
                const now = new Date();
                const activityEnd = new Date(activity.endAt);
                if (activityEnd < now) {
                    return false;
                }
            }

            // TODO: Saved activities filter

            return true;
        })
        .sort((a, b) => {
            // If time filter is active, sort by start time (earliest first)
            if (activeFilters.time) {
                const timeA = new Date(a.startAt).getTime();
                const timeB = new Date(b.startAt).getTime();
                return timeA - timeB; // earliest first
            }

            // Sort: closest first if we have distance data, otherwise no sorting
            if (a.distanceMeters && b.distanceMeters) {
                return a.distanceMeters - b.distanceMeters;
            }
            return 0;
        });

    // Loader while fetching data
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress sx={{ color: 'var(--color-primary)' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

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
                    <MapComponent activities={filteredActivities} userCoords={userCoords} mode="view" onMapInstance={""} />
                </Box>
            )}

            {/* Search header */}
            <Box className="activity-search-header" sx={{
                bgcolor: 'var(--color-primary-soft)',
                pt: 3, pb: 2,
                px: 2,
                display: 'flex',
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                flexDirection: "row"
            }}>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>

                    <InputField
                        fullWidth
                        placeholder="Sök aktiviteter..."
                        sx={{
                            "& .MuiOutlinedInput-input": { textAlign: "center" },
                            "& .MuiOutlinedInput-root": {
                                height: 50,
                                borderRadius: 25,
                                width: { xs: "220px", md: '280px' },
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

                    <Button
                        onClick={() => setFilterOpen(true)}
                        sx={{
                            borderRadius: "50%",
                            height: "50px",
                            width: "50px",
                            minWidth: "unset",
                            p: 0,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: 'white',
                            border: "var(--color-border-light) 0.5px solid",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
                            '&:hover': {
                                bgcolor: '#f5f5f5'
                            }
                        }}
                    >
                        <img
                            src={Filter}
                            alt="Filter"
                            style={{
                                width: "24px",
                                height: "24px"
                            }}
                        />

                    </Button>

                    <PrimaryButton
                        sx={{
                            borderRadius: "50%", height: "50px", width: "50px", minWidth: "unset",
                            p: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}
                        startIcon={<TodayOutlinedIcon sx={{ color: "white", marginLeft: 1.5, fontSize: "25px !important" }} />}
                    >
                    </PrimaryButton>


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
                <ActivityFeed
                    activities={filteredActivities}
                    userCoords={userCoords}
                    onCardAction={handleCardAction}
                    currentUserId={currentUserId}
                />
            </Box>

            <ActivityFilter
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                currentFilters={activeFilters}
                onApply={setActiveFilters}
            />

            <ActivityForm
                open={isFormOpen}
                handleClose={handleCloseForm}
                activityToEdit={editActivity}
                onSuccess={handleFormSuccess}
            />

            < Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseToast}
                    severity={toast.severity || "success"}
                    sx={{
                        width: '100%',
                        borderRadius: '20px',
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                        bgcolor: 'var(--color-primary-soft, #FFF8F1)',
                        color: 'var(--color-text-main, #333333)',
                        fontWeight: 600,

                        '& .MuiAlert-icon': {
                            color: 'var(--color-primary, #F37D35)',
                            fontSize: '24px'
                        },
                        '& .MuiAlert-action': {
                            pt: 0,
                            color: 'var(--color-primary, #F37D35)',
                        }
                    }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box >
    );
};

export default ActivityPage;