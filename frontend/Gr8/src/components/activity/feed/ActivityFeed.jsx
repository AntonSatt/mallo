import { Box, Typography, Stack } from "@mui/material";
import ActivityCard from "./ActivityCard.jsx";

// Component for rendering the list of activity cards in the feed
const ActivityFeed = ({ activities, currentUserId, onCardAction, onSelectActivity, onBookmarkToggle, scrollingActivityId, clearScrollingActivityId, onAddToCalendar, highlightedActivityId, markedDates, showDistance = false }) => {

    const calculateDistanceText = (distanceMeters) => {
        if (!Number.isFinite(distanceMeters)) return null;

        //If it's over 1 km, show in km with one decimal, otherwise in meters
        if (distanceMeters > 1000) {
            return (distanceMeters / 1000).toFixed(1) + " km";
        }
        return Math.round(distanceMeters) + " m";
    };

    return (
        <Box sx={{ px: 2, pb: 4 }}>
            <Stack spacing={2}>
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        /* 
                            Every box gets an unique ID based on the activity ID, 
                            which allows us to scroll to it when clicking the marker on the map
                        */
                        <Box
                            key={activity.id}
                            id={`activity-card-${activity.id}`}
                            onClick={() => {
                                if (onSelectActivity) {
                                    onSelectActivity(activity);
                                }
                            }}
                            sx={{ cursor: 'pointer' }}
                        >
                            <ActivityCard
                                activity={activity}
                                distance={calculateDistanceText(activity.distanceMeters)}
                                showDistance={showDistance}
                                currentUserId={currentUserId}
                                onCardAction={onCardAction}
                                onBookmarkToggle={onBookmarkToggle}
                                onAddToCalendar={onAddToCalendar}
                                isHighlighted={highlightedActivityId === activity.id}
                                imageUrl={activity.imageUrl}
                                markedDates={markedDates}
                                scrollingActivityId={scrollingActivityId}
                                clearScrollingActivityId={clearScrollingActivityId}
                            />
                        </Box>
                    ))
                ) : (
                    <Typography sx={{ textAlign: 'center', mt: 4, opacity: 0.6 }}>
                        Inga aktiviteter hittades som matchar dina filter.
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default ActivityFeed;