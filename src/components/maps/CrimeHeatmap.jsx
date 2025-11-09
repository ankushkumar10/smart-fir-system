import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Mapbox configuration (using same as LocationPicker)
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW5rdXNoa3VtYXIxMCIsImEiOiJjbWhtZnFwam8xcWFoMmtzODFoY2ZoMndjIn0.1R0X6WQQJ2lNcO7hXnI0WQ';
const MAPBOX_STYLE = 'mapbox/streets-v11';
const MAPBOX_ATTRIBUTION = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>';
const TILE_LAYER_URL = `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`;

// Component to add heatmap layer
const HeatmapLayer = ({ data, options }) => {
  const map = useMap();
  const heatmapLayerRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Convert data to heatmap format: [lat, lng, intensity]
    const heatmapData = data.map(point => [point.lat, point.lng, point.intensity || 1]);

    // Remove existing heatmap layer if it exists
    if (heatmapLayerRef.current) {
      map.removeLayer(heatmapLayerRef.current);
    }

    // Create new heatmap layer
    const heatmapLayer = L.heatLayer(heatmapData, {
      radius: options?.radius || 25,
      blur: options?.blur || 15,
      maxZoom: options?.maxZoom || 18,
      max: options?.max || 1.0,
      gradient: options?.gradient || {
        0.0: 'blue',
        0.2: 'cyan',
        0.4: 'lime',
        0.6: 'yellow',
        0.8: 'orange',
        1.0: 'red'
      },
      ...options
    });

    // Add heatmap to map
    heatmapLayer.addTo(map);
    heatmapLayerRef.current = heatmapLayer;

    // Fit map bounds to show all heatmap points
    if (data.length > 0) {
      const bounds = L.latLngBounds(data.map(point => [point.lat, point.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup function
    return () => {
      if (heatmapLayerRef.current) {
        map.removeLayer(heatmapLayerRef.current);
      }
    };
  }, [data, map, options]);

  return null;
};

const CrimeHeatmap = ({ 
  heatmapData = [], 
  center = [28.6139, 77.2090], // Default to Delhi, India
  zoom = 6,
  height = 400,
  options = {}
}) => {
  return (
    <div style={{ height: `${height}px`, width: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={MAPBOX_ATTRIBUTION}
          url={TILE_LAYER_URL}
        />
        <HeatmapLayer data={heatmapData} options={options} />
      </MapContainer>
    </div>
  );
};

export default CrimeHeatmap;

