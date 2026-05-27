import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect, useRef, useMemo } from "react";
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
import { Box, InputAdornment, Button, CircularProgress, Snackbar, Alert, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ActivityCalendarDialog from "../../components/activity/calender/ActivityCalendarDialog.jsx";

import distance from "@turf/distance";
import {
    PERMISSION_STATE,
    PERMISSION_TYPE,
    onPermissionStateChange,
    queryPermissionState,
    requestPermission
} from "../../utils/browserPermissions.js";

const ActivityPage = ({ markedDates = [], onMarkedDatesChange, highlightedActivityId }) => {
    const { currentUser } = useAuth();
    const currentUserId = currentUser?.sub;

    const [selectedActivity, setSelectedActivity] = useState(null);
    const feedScrollRef = useRef(null);
    const mapInstanceRef = useRef(null);

    const [editActivity, setEditActivity] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [alignment, setAlignment] = React.useState('map');
    const [filterOpen, setFilterOpen] = useState(false);
    const [userCoords, setUserCoords] = useState(null);
    const [geolocationPermissionState, setGeolocationPermissionState] = useState(PERMISSION_STATE.PROMPT);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);

    const [latestCreatedId, setLatestCreatedId] = useState(null);
    const [scrollingActivityId, setScrollingActivityId] = useState(null);
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

    const handleBookmarkToggle = (activityId, isBookmarked) => {
        setActivities(prev => prev.map(a =>
            a.id === activityId ? { ...a, isBookmarked } : a
        ));
    };

    // Load saved calendar activities on mount
    useEffect(() => {
        if (!highlightedActivityId) return;

        const activity = activities.find(a => a.id === highlightedActivityId);
        if (!activity) return;

        // Switch to list view
        setAlignment('list');

        // Use the same mechanism as map pin click
        setTimeout(() => {
            setSelectedActivity(activity);
            const el = document.getElementById(`activity-card-${highlightedActivityId}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.click(); // expand the card
            }
        }, 150);
    }, [highlightedActivityId, activities]);

    const handleAddToCalendar = async (activity) => {
        try {
            await CalendarService.add(activity.id);
            if (onMarkedDatesChange) {
                onMarkedDatesChange(prev => [...prev, { date: activity.startAt, activityId: activity.id }]);
            }
        } catch (error) {
            if (error.response?.status !== 409) {
                console.error("Kunde inte lägga till aktiviteten i kalendern.");
            }
        }
    };

    const handleOpenForm = () => {
        setIsFormOpen(true);
        setEditActivity(null);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditActivity(null);
    };

    // Show activity after creating it - scroll to it and open the card
    const handleShowActivity = () => {
        if (!latestCreatedId) return;

        setShowSuccessDialog(false);

        setTimeout(() => {
            const element = document.getElementById(`activity-card-${latestCreatedId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Id for expanding card
                setScrollingActivityId(latestCreatedId);
            }
        }, 100);
    };

    const clearScrollingActivityId = () => {
        setScrollingActivityId(null);
    };

    // Handles both create and edit Activity
    const handleFormSuccess = (savedActivity) => {
        setIsFormOpen(false);

        const formattedSavedActivity = {
            ...savedActivity,
            imageUrl: savedActivity.image ? `data:${savedActivity.imageMimeType || 'image/jpeg'};base64,${savedActivity.image}` : null,
            adress: savedActivity.adress ? savedActivity.adress.split(',')[0].trim() : savedActivity.adress
        };

        setActivities(prevActivities => {
            const exists = prevActivities.some(act => act.id === formattedSavedActivity.id);

            if (exists) {
                return prevActivities.map(act => act.id === formattedSavedActivity.id ? formattedSavedActivity : act);
            } else {
                return [formattedSavedActivity, ...prevActivities];
            }
        });

        if (editActivity) {
            setToast({
                open: true,
                message: "Aktiviteten har redigerats!",
                severity: "success"
            });
            setEditActivity(null);
        } else {
            // Save Id for the newly created activity so we can scroll to it and open it after closing the form
            setLatestCreatedId(formattedSavedActivity.id);
            setShowSuccessDialog(true);
        }
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
                const [activitiesData, bookmarksData] = await Promise.all([
                    ActivityServices.getAll(),
                    ActivityServices.getBookmarks()
                ]);

                const bookmarkedIds = new Set(bookmarksData.map(b => b.activityId || b.actvityId));
                const activitiesWithBookmarks = (activitiesData || []).map(a => ({
                    ...a,
                    isBookmarked: bookmarkedIds.has(a.id),
                    imageUrl: a.image ? `data:${a.imageMimeType || 'image/jpeg'};base64,${a.image}` : null,
                    adress: a.adress ? a.adress.split(',')[0].trim() : a.adress
                }));

                setActivities(activitiesWithBookmarks);
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
        let isMounted = true;
        const syncPermissionState = async () => {
            const state = await queryPermissionState(PERMISSION_TYPE.GEOLOCATION);
            if (isMounted) {
                setGeolocationPermissionState(state);
            }
        };

        const unsubscribe = onPermissionStateChange(PERMISSION_TYPE.GEOLOCATION, (state) => {
            setGeolocationPermissionState(state);
        });

        syncPermissionState();

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (geolocationPermissionState === PERMISSION_STATE.DENIED && userCoords) {
            setUserCoords(null);
        }
    }, [geolocationPermissionState, userCoords]);

    useEffect(() => {
        if (geolocationPermissionState === PERMISSION_STATE.DENIED) {
            return;
        }

        if (!userCoords) {
            requestPermission(PERMISSION_TYPE.GEOLOCATION, { geolocationOptions: { enableHighAccuracy: true } })
                .then((result) => {
                    if (result?.position) {
                        setUserCoords({
                            lat: result.position.coords.latitude,
                            lng: result.position.coords.longitude
                        });
                    }

                    if (result?.state) {
                        setGeolocationPermissionState(result.state);
                    }
                })
                .catch((err) => {
                    if (err?.code === 1) {
                        setGeolocationPermissionState(PERMISSION_STATE.DENIED);
                    }
                    console.error("Kunde inte hämta position", err);
                });
        }
    }, [geolocationPermissionState, userCoords]);
    // Apply filters to activities
    const filteredActivities = useMemo(() => {
        const now = new Date();

        return activities
            .map(activity => {
                if (userCoords) {
                    const from = [userCoords.lng, userCoords.lat];
                    const to = [activity.longitude, activity.latitude];
                    const distanceInMeters = distance(from, to, { units: 'meters' });
                    return { ...activity, distanceMeters: distanceInMeters };
                }
                return activity;
            })
            .filter(activity => {
                const activityStart = new Date(activity.startAt);
                if (Number.isNaN(activityStart.getTime()) || activityStart < now) {
                    return false;
                }

                // Search filter
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    if (
                        !activity.title?.toLowerCase().includes(q) &&
                        !activity.description?.toLowerCase().includes(q)
                    ) return false;
                }

                // Nearby filter
                if (activeFilters.nearby) {
                    if (geolocationPermissionState === PERMISSION_STATE.DENIED || !userCoords) return false;
                    if (activity.distanceMeters > 7000) return false;
                }

                // Your activities filter
                if (activeFilters.yourActivities) {
                    if (!currentUserId) return false;
                    if (activity.userId !== currentUserId) return false;
                }

                // Time filter
                if (activeFilters.time) {
                    const activityEnd = new Date(activity.endAt);
                    if (activityEnd < now) return false;
                }

                // Saved activities filter
                if (activeFilters.savedActivities) {
                    if (!currentUserId) return false;
                    if (!activity.isBookmarked) return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (activeFilters.time) {
                    const timeA = new Date(a.startAt).getTime();
                    const timeB = new Date(b.startAt).getTime();
                    return timeA - timeB;
                }
                if (a.distanceMeters && b.distanceMeters) {
                    return a.distanceMeters - b.distanceMeters;
                }
                return 0;
            });
    }, [activities, userCoords, searchQuery, activeFilters, currentUserId, geolocationPermissionState]);

    const shouldShowDistance = geolocationPermissionState === PERMISSION_STATE.GRANTED && Boolean(userCoords);

    return (

        //Wrapper for the whole container
        <Box className="activity-page-container" sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100vw', md: '490px' },
            height: { xs: '100vh', md: 'auto' },
            overflow: { xs: 'hidden', md: 'visible' },
            margin: { xs: 0, md: 0 },
            backgroundColor: { xs: 'transparent', md: 'var(--button-secondary-bg)' },
            borderRadius: { xs: 0, md: '20px' },
            padding: { xs: 0, md: '16px' },
            border: { xs: 'none', md: '1px solid var(--color-border-light)' },
        }}>

            {/* Map - default map view with short list */}
            {alignment === 'map' && (
                <Box className="activity-map-wrapper"
                    sx={{ position: 'relative', zIndex: 1, height: { xs: '40vh', md: '55vh' }, overflow: 'hidden', borderRadius: { xs: 0, md: "15px" } }}>
                    <MapComponent activities={filteredActivities}
                        userCoords={userCoords}
                        mode="view"
                        onSelectActivity={setSelectedActivity}
                        selectedActivity={selectedActivity}
                        feedScrollRef={feedScrollRef}
                        onMapInstance={(map) => { mapInstanceRef.current = map; }}
                    />
                </Box>
            )}

            {/* Search header */}
            <Box className="activity-search-header" sx={{
                bgcolor: 'var(--color-primary-soft)',
                pt: 2, pb: 2,
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-input": { textAlign: "center" },
                            "& .MuiOutlinedInput-root": {
                                height: 50,
                                borderRadius: 25,
                                width: { xs: "235px", md: '340px' },
                                bgcolor: 'white !important'
                            },
                        }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
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
                        onClick={() => setCalendarOpen(true)}
                        sx={{
                            display: {
                                xs: "flex",
                                sm: "none"
                            },
                            borderRadius: "50%",
                            height: "50px",
                            width: "50px",
                            minWidth: "unset",
                            p: 0,
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}
                        startIcon={
                            <TodayOutlinedIcon
                                sx={{
                                    color: "white",
                                    marginLeft: 1.5,
                                    fontSize: "25px !important"
                                }}
                            />
                        }
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
            <Box className="activity-feed-wrapper"
                ref={feedScrollRef}
                sx={{
                    flex: 1,
                    bgcolor: 'white',
                    overflowY: 'auto',
                    pb: 10,
                    height: alignment === 'map' ? '25vh' : 'auto',
                    minHeight: alignment === 'map' ? '25vh' : 'auto',
                    scrollMarginTop: "20px"
                }}>
                <ActivityFeed
                    activities={filteredActivities}
                    showDistance={shouldShowDistance}
                    onCardAction={handleCardAction}
                    currentUserId={currentUserId}
                    onBookmarkToggle={handleBookmarkToggle}
                    onSelectActivity={setSelectedActivity}
                    onAddToCalendar={handleAddToCalendar}
                    highlightedActivityId={highlightedActivityId}
                    markedDates={markedDates}
                    scrollingActivityId={scrollingActivityId}
                    clearScrollingActivityId={clearScrollingActivityId}
                />
            </Box>

            <ActivityFilter
                key={filterOpen ? "filter-open" : "filter-closed"}
                open={filterOpen === true}
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

            <ActivityCalendarDialog
                open={calendarOpen}
                onClose={() => setCalendarOpen(false)}
                markedDates={markedDates}
                activities={activities}
                setAlignment={setAlignment}
                setSelectedActivity={setSelectedActivity}
            />

            <Dialog
                open={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
                sx={{
                    "& .MuiPaper-root": {
                        borderRadius: "30px",
                        overflow: "hidden",
                        padding: "20px",
                        backgroundColor: "var(--color-primary-bg) !important",
                        textAlign: "center",
                        position: "relative",
                        flexDirection: "column",
                    }
                }}
            >
                <IconButton
                    onClick={() => setShowSuccessDialog(false)}
                    sx={{ position: "absolute", top: "10px", right: "10px", }}
                >
                    <CloseIcon sx={{ color: "var(--color-primary)", fontSize: "35px" }} />
                </IconButton>

                <Box sx={{ mt: 8, mb: 3, px: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--color-text-main)" }}>
                        Din aktivitet har nu publicerats!
                    </Typography>
                </Box>
                <PrimaryButton
                    onClick={handleShowActivity}
                    sx={{ width: "250px", mb: 4, mt: 2, ml: { xs: 2.5, md: 4 } }}
                >
                    Visa aktivitet
                </PrimaryButton>
            </Dialog>

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