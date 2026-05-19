import "./MapForm.css";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ActivityServices from "../../../services/ActivityService.jsx";

// mode: view = shows pins, create = no pins
const MapForm = ({ mode = "view", onMapInstance }) => {
    const mapRef = useRef();
    const mapContainerRef = useRef();

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

        // Default map style
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [18.06411, 59.33163],
            zoom: 11.80,
            style: 'mapbox://styles/mapbox/streets-v12'
        });

        // If a parent component wants access to the map instance, we provide it via callback
        if (onMapInstance) {
            onMapInstance(mapRef.current);
        }

        mapRef.current.on('load', async () => {
            // Get pins only if we're in view mode
            if (mode === "view") {
                try {
                    const activities = await ActivityServices.getAll();
                    if (activities && Array.isArray(activities)) {
                        activities.forEach((activity) => {
                            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                                <div class="map-popup">
                                    <h3>${activity.title}</h3>
                                    <p>${activity.description}</p>
                                    <strong>Skapad av: ${activity.fullName || 'Okänd'}</strong>
                                </div>
                            `);

                            new mapboxgl.Marker({ color: "var(--color-primary)" })
                                .setLngLat([activity.longitude, activity.latitude])
                                .setPopup(popup)
                                .addTo(mapRef.current);
                        });
                    }
                } catch (error) {
                    console.error("Kunde inte ladda pins:", error);
                }
            }
        });

        return () => {
            if (mapRef.current) mapRef.current.remove();
        };

        // Add mode as a dependency so that if it changes, the effect re-runs and updates the map accordingly
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    return (
        <>
            <div id="map-container" ref={mapContainerRef} />
        </>
    );
};

export default MapForm;