import "./MapForm.css";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapForm = ({ mode = "view", onMapInstance, activities = [], selectedActivity, onSelectActivity, feedScrollRef }) => {
    const mapRef = useRef();
    const mapContainerRef = useRef();
    const markersRef = useRef([]);
    const isMovingRef = useRef(false);

    // Initiate map on component mount
    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

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
    }, []);

    // Center and zoom to selected activity when it changes 
    useEffect(() => {
        if (!mapRef.current || !selectedActivity || !selectedActivity.longitude || !selectedActivity.latitude) return;

        const center = mapRef.current.getCenter();
        const latDiff = Math.abs(center.lat - Number(selectedActivity.latitude));
        const lngDiff = Math.abs(center.lng - Number(selectedActivity.longitude));

        if (latDiff < 0.001 && lngDiff < 0.001 && mapRef.current.getZoom() >= 13) {
            return;
        }

        isMovingRef.current = true;
        mapRef.current.flyTo({
            center: [Number(selectedActivity.longitude), Number(selectedActivity.latitude)],
            zoom: 14,
            essential: true,
            duration: 1200
        });

        setTimeout(() => {
            isMovingRef.current = false;
        }, 1300);

    }, [selectedActivity]);

    // Scroll to the selected activity card
    useEffect(() => {
        if (!selectedActivity || !feedScrollRef?.current) return;

        setTimeout(() => {
            const targetCard = document.getElementById(`activity-card-${selectedActivity.id}`);
            if (targetCard) {
                targetCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 150);

    }, [selectedActivity, feedScrollRef]);

    // Manage pins and hoover effect
    useEffect(() => {
        if (!mapRef.current) return;

        const updateMarkers = () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            if (mode === "view" && Array.isArray(activities)) {
                activities.forEach((activity) => {
                    if (!activity.longitude || !activity.latitude) return;

                    const isSelected = selectedActivity?.id === activity.id;
                    const newMarker = new mapboxgl.Marker({
                        color: isSelected ? "#F37D35" : "var(--color-primary)"
                    })
                        .setLngLat([Number(activity.longitude), Number(activity.latitude)])
                        .addTo(mapRef.current);

                    const markerElement = newMarker.getElement();
                    markerElement.style.cursor = 'pointer';

                    //Hoover popup
                    const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
                        .setHTML(`<b style="color: #333; font-family: sans-serif;">${activity.title || "Aktivitet"}</b>`);

                    markerElement.addEventListener('mouseenter', () => {
                        newMarker.setPopup(popup);
                        popup.addTo(mapRef.current);
                    });

                    markerElement.addEventListener('mouseleave', () => {
                        popup.remove();
                    });

                    // Click on marker
                    markerElement.addEventListener('click', () => {
                        if (onSelectActivity) {
                            onSelectActivity(activity);
                        }

                        const targetCard = document.getElementById(`activity-card-${activity.id}`);
                        if (targetCard) {
                            const innerPaper = targetCard.querySelector('.MuiPaper-root');
                            if (innerPaper) {
                                innerPaper.click();
                            }
                        }
                    });

                    markersRef.current.push(newMarker);
                });
            }
        };

        // If the map style is not loaded yet, wait for it before adding markers
        if (mapRef.current.isStyleLoaded()) {
            updateMarkers();
        } else {
            mapRef.current.once('style.load', updateMarkers);
        }

    }, [activities, mode, selectedActivity, onSelectActivity]);

    return (
        <>
            <div id="map-container" ref={mapContainerRef} />
        </>
    );
};

export default MapForm;