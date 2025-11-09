// geocoding.js
import axios from 'axios';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW5rdXNoa3VtYXIxMCIsImEiOiJjbWhtZnFwam8xcWFoMmtzODFoY2ZoMndjIn0.1R0X6WQQJ2lNcO7hXnI0WQ';

export async function geocodeAddress(address) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;
  const response = await axios.get(url, {
    params: {
      access_token: MAPBOX_TOKEN,
      limit: 1
    }
  });
  const feature = response.data.features[0];
  if (feature) {
    return {
      lat: feature.center[1],
      lng: feature.center[0],
      address: feature.place_name
    };
  }
  throw new Error('No location found for that address.');
}

export async function reverseGeocodeMapbox(lat, lng) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`;
  const response = await axios.get(url, {
    params: {
      access_token: MAPBOX_TOKEN,
      limit: 1
    }
  });
  const feature = response.data.features[0];
  if (feature) {
    return feature.place_name;
  }
  throw new Error('No address found for those coordinates.');
}
