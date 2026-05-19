import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import ActivityServices from "../../../services/ActivityService.jsx";
import ActivityCard from "./ActivityCard.jsx";
import distance from "@turf/distance";
import { point } from "@turf/helpers";

const ActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    // Get user's current location on component mount
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lng: position.coords.longitude,
                    lat: position.coords.latitude
                });
            },
            (err) => console.error("Kunde inte hämta position", err)
        )
    })

    // Fetch activities from backend on component mount
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const data = await ActivityServices.getAll();
                setActivities(data);
            } catch (err) {
                console.error("Error fetching activities:", err);
                setError("Kunde inte hämta aktiviteter. Försök igen senare.");
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const calculateDistance = (actLat, actLng) => {
        if (!userLocation) return null;

        // Turf [longitude, latitude]
        const from = point([userLocation.lng, userLocation.lat]);
        const to = point([actLng, actLat]);
        const options = { units: 'meters' };

        const d = distance(from, to, options);

        // If it's over 1 km, show in km with one decimal, otherwise in meters
        if (d > 1000) {
            return (d / 1000).toFixed(1) + " km";
        }

        return Math.round(d) + " m";
    };
    if (loading) return <CircularProgress />;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
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
        <Box sx={{ px: 2, pb: 4 }}>
            <Stack spacing={2}>
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            activity={activity}
                            distance={calculateDistance(activity.latitude, activity.longitude)}
                        />
                    ))
                ) : (
                    <Typography sx={{ textAlign: 'center', mt: 4, opacity: 0.6 }}>
                        Inga aktiviteter hittades i närheten.
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default ActivityFeed;