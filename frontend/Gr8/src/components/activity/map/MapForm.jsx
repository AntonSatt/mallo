import "./MapForm.css";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ActivityServices from "../../../services/ActivityService.jsx";

// mode: view = shows pins
const MapForm = ({ mode = "view", onMapInstance, activities = [] }) => {
    const mapRef = useRef();
    const mapContainerRef = useRef();

    // Save markers in a ref so we can easily remove them later without causing re-renders
    const markersRef = useRef([]);

    // Initiate map on component 
    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

        // Default map center & zoom
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [18.06411, 59.33163],
            zoom: 11.80,
            style: 'mapbox://styles/mapbox/streets-v12'
        });

        if (onMapInstance) {
            onMapInstance(mapRef.current);
        }

        return () => {
            if (mapRef.current) mapRef.current.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty array means this runs only once on mount

    // Update markers whenever activities or mode changes
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers and add new ones based on mode and activities
        const updateMarkers = () => {
            // Clear existing markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            // If in view mode, add markers for each activity
            if (mode === "view" && Array.isArray(activities)) {
                activities.forEach((activity) => {
                    // Safeguard if activity doesn't have coordinates
                    if (!activity.longitude || !activity.latitude) return;

                    // Create a new marker for the activity
                    const newMarker = new mapboxgl.Marker({ color: "var(--color-primary)" })
                        .setLngLat([Number(activity.longitude), Number(activity.latitude)])
                        .addTo(mapRef.current);

                    // Fetch the HTML element of the marker to attach click event
                    const markerElement = newMarker.getElement();
                    markerElement.style.cursor = 'pointer';

                    // Add click event to marker to scroll to corresponding card in feed
                    markerElement.addEventListener('click', () => {
                        console.log(`Klickade på pin för aktivitet ID: ${activity.id}`);

                        // Search for the clicked activity's card in the feed using its unique ID
                        const targetCard = document.getElementById(`activity-card-${activity.id}`);

                        if (targetCard) {
                            // Soft glide scroll to the card in the feed
                            targetCard.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });

                            // Find the paper element inside the card and simulate a click to expand it
                            const innerPaper = targetCard.querySelector('.MuiPaper-root');
                            if (innerPaper) {
                                setTimeout(() => {
                                    innerPaper.click();
                                }, 100);
                            }
                        } else {
                            console.warn("Hittade inget kort i feeden med ID:", activity.id);
                        }
                    });

                    // Save marker to ref for later removal
                    markersRef.current.push(newMarker);
                });
            }
        };

        // If the map style is already loaded, we can add markers immediately 
        // Otherwise wait for the style to load before adding markers
        if (mapRef.current.isStyleLoaded()) {
            updateMarkers();
        } else {
            mapRef.current.once('style.load', updateMarkers);
        }

    }, [activities, mode]);

    return (
        <>
            <div id="map-container" ref={mapContainerRef} />
        </>
    );
};

export default MapForm;