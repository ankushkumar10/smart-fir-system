import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { Search, MyLocation } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { reverseGeocodeMapbox, geocodeAddress } from '../../utils/geocoding';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// --- (Security Warning) ---
// REPLACE THIS with your new *PUBLIC* token (starting with 'pk.')
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW5rdXNoa3VtYXIxMCIsImEiOiJjbWhtZnFwam8xcWFoMmtzODFoY2ZoMndjIn0.1R0X6WQQJ2lNcO7hXnI0WQ'; 
// --------------------------

// --- (New Mapbox Configuration) ---
const MAPBOX_STYLE = 'mapbox/streets-v11';
const MAPBOX_ATTRIBUTION = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>';
const TILE_LAYER_URL = `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`;
// ----------------------------------


// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle map click events
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// Component to access the map instance
const MapController = ({ mapRef }) => {
  const map = useMap();
  
  // Store map instance in ref
  React.useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  
  return null;
};

const LocationPicker = ({ onLocationSelected = () => {} }) => {
  
  // --- (THIS IS THE FIRST CHANGE) ---
  // We now start with a default position so the map loads immediately.
  const [position, setPosition] = useState([40.7128, -74.0060]); // New York default
  // ------------------------------------

  const [address, setAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  // Initialize map with user's current location
  useEffect(() => {
    // This effect will run *after* the map has already loaded with the default position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          handleReverseGeocode(latitude, longitude);
          
          // Fly to the new location
          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 15);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          // We don't set a default position here anymore, 
          // because the map is already showing New York.
          setError('Unable to get your current location. Showing default location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser. Showing default location.');
    }
  }, []); // The empty array [] means this runs once on mount

  // Handle map click to update marker
  const handleMapClick = async (latlng) => {
    const { lat, lng } = latlng;
    setPosition([lat, lng]);
    await handleReverseGeocode(lat, lng);
  };

  // Use reverse geocoding to get address from coordinates
  const handleReverseGeocode = async (lat, lng) => {
    setLoading(true);
    try {
      const foundAddress = await reverseGeocodeMapbox(lat, lng);
      setAddress(foundAddress);
      onLocationSelected({ lat, lng, address: foundAddress });
      setError('');
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setError('Failed to get address. Please try again or enter manually.');
    } finally {
      setLoading(false);
    }
  };

  // Search for an address and update map
  const handleAddressSearch = async () => {
    if (!searchAddress.trim()) return;
    setLoading(true);
    try {
      const { lat, lng, address } = await geocodeAddress(searchAddress);
      setPosition([lat, lng]);
      setAddress(address);
      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], 15);
      }
      onLocationSelected({ lat, lng, address });
      setError('');
    } catch (error) {
      console.error('Address search error:', error);
      setError('Failed to find location. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Use current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          handleReverseGeocode(latitude, longitude);
          
          // Center map on new position
          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 15);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your current location. Please select manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser. Please enter location manually.');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Search for a location or click on the map
        </Typography>
        
        {/* ... (rest of the search/button UI is the same) ... */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter an address to search"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddressSearch();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddressSearch}
            disabled={loading}
            sx={{ ml: 1 }}
          >
            <Search />
          </Button>
          <Button
            variant="outlined"
            onClick={handleUseCurrentLocation}
            disabled={loading}
            sx={{ ml: 1 }}
          >
            <MyLocation />
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {address && (
          <Paper elevation={1} sx={{ p: 1, mb: 2 }}>
            <Typography variant="body1">
              Selected Location: {address}
            </Typography>
            {position && (
              <Typography variant="body2" color="text.secondary">
                Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
              </Typography>
            )}
          </Paper>
        )}
      </Box>
      
      <Box sx={{ height: 300, border: '1px solid #ccc', borderRadius: 1 }}>
        {/* --- (THIS IS THE SECOND CHANGE) --- */}
        {/* We no longer need the "loading" text, because position is never null */}
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution={MAPBOX_ATTRIBUTION}
            url={TILE_LAYER_URL}
          />
          <Marker position={position} />
          <MapClickHandler onMapClick={handleMapClick} />
          <MapController mapRef={mapRef} />
        </MapContainer>
        {/* ---------------------------------- */}
      </Box>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Click on the map to select a specific location or use the search bar above.
      </Typography>
    </Box>
  );
};

export default LocationPicker;
