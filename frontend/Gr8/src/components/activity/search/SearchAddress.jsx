import { useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Box, Paper, ListItem, ListItemText, List, Stack, InputAdornment } from "@mui/material";
import MapForm from "../map/MapForm";
import PrimaryButton from "../../../design/buttons/PrimaryButton.jsx";
import SecondaryButton from "../../../design/buttons/SecondaryButton.jsx";
import InputField from "../../../design/input/InputField.jsx";
import searchHeart from "../../../assets/icons/searchHeartForum.svg"
import "./SearchAddress.css";

const SearchAddress = ({ onSelect, onBack }) => {
    const [address, setAddress] = useState("");
    const [tempData, setTempData] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const markerRef = useRef(null);

    // Handle input typing and fetch address suggestions from Mapbox
    const handleInputChange = async (e) => {
        const value = e.target.value;
        setAddress(value);

        if (value.length > 2) {
            const token = import.meta.env.VITE_MAPBOX_TOKEN;
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${token}&autocomplete=true&limit=3&countries=se`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                setSuggestions(data.features || []);
            } catch (error) {
                console.error("Förslagsfel:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    // Handle user selecting an address from the suggestion list
    const handleSelectSuggestion = (suggestion) => {
        const [lng, lat] = suggestion.center;
        const placeName = suggestion.place_name;

        setAddress(placeName);
        setSuggestions([]);

        updateMap(lng, lat, placeName);
    };

    // Move map view and update/create the marker
    const updateMap = (lng, lat, placeName) => {
        setTempData({ latitude: lat, longitude: lng, addressName: placeName });

        if (mapInstance) {
            mapInstance.flyTo({ center: [lng, lat], zoom: 14, essential: true });

            // Update existing marker position or create a new one
            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new mapboxgl.Marker({ color: "#FFB37C" })
                    .setLngLat([lng, lat])
                    .addTo(mapInstance);
            }
        }
    };

    // Geocode current input value and move map on submit/Enter (flyTo)
    const handleSearch = async () => {
        if (!address || !mapInstance) return;

        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&limit=1`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.features?.length > 0) {
                const [lng, lat] = data.features[0].center;
                const placeName = data.features[0].text;

                setTempData({
                    latitude: lat,
                    longitude: lng,
                    addressName: placeName
                });

                mapInstance.flyTo({
                    center: [lng, lat],
                    zoom: 14,
                    essential: true
                });

                // Set pin
                if (markerRef.current) {
                    markerRef.current.setLngLat([lng, lat]);
                } else {
                    markerRef.current = new mapboxgl.Marker({ color: "var( --color-primary)" })
                        .setLngLat([lng, lat])
                        .addTo(mapInstance);
                }
            }
        } catch (error) {
            console.error("Gick inte att söka:", error);
        }
    };

    return (
        <Box className="search-activity-wrapper" sx=
            {{
                bgcolor: "transparent",
                backgroundImage: "none",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                overflow: "hidden"

            }}>
            <Box className="map-frame-blue" sx={{
                height: { xs: "80vh", md: "700px" },
                width: "100%"
            }}>
                <MapForm mode="picker" onMapInstance={(map) => setMapInstance(map)} />
            </Box>

            <Box className="search-overlay" sx={{ position: 'relative' }}>
                <Paper className="search-paper-mui" sx={{
                    p: 0.5,
                    borderRadius: { xs: "20px 20px 0 0", md: "0 0 15px 15px" },
                    boxShadow: "none",
                    bgcolor: "var(--color-primary-bg)"
                }}>

                    {/* Input field for search */}
                    <Box sx={{ position: 'relative', width: 350, mx: 'auto' }}>
                        <InputField
                            fullWidth
                            placeholder="Sök adress..."
                            value={address}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            sx={{
                                "& .MuiOutlinedInput-input": { textAlign: "center", paddingLeft: "40px" },
                                "& .MuiOutlinedInput-root": { height: 40, borderRadius: 20, mt: 4 },
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <img src={searchHeart} alt="search" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={handleSearch} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        {/* Location suggestions */}
                        {suggestions.length > 0 && (
                            <Paper sx={{
                                position: 'absolute',
                                bottom: '100%',
                                left: 0,
                                right: 0,
                                zIndex: 100,
                                mt: 1,
                                borderRadius: '10px',
                                boxShadow: 3
                            }}>
                                <List sx={{ p: 0 }}>
                                    {suggestions.map((s) => (
                                        <ListItem
                                            key={s.id}
                                            component="div"
                                            onClick={() => handleSelectSuggestion(s)}
                                            sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f0f0f0' } }}
                                        >
                                            <ListItemText
                                                primary={s.text}
                                                secondary={s.place_name}
                                                primarytypographyprops={{ fontSize: '14px' }}
                                                secondarytypographyprops={{ fontSize: '12px' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}
                    </Box>

                    <Box className="search-footer-actions">
                        <Stack direction="row" spacing={2} sx={{ width: '100%', px: 2, mt: 3, pb: 3 }}>
                            <SecondaryButton fullWidth onClick={onBack}>
                                Tillbaka
                            </SecondaryButton>
                            <PrimaryButton
                                fullWidth onClick={() => onSelect(tempData)} >
                                Spara plats
                            </PrimaryButton>
                        </Stack>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default SearchAddress;