import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useState, useEffect } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px'
};

function Map({ places, userPosition }) {
  const [map, setMap] = useState(null);

  const center = userPosition;

  useEffect(() => {
    if (map) {
      map.panTo(userPosition);
    }
  }, [userPosition, map]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={(map) => setMap(map)}
      >
        {/* Marqueurs pour les activités */}
        {places.map((place, index) => (
          <Marker
            key={index}
            position={{ lat: place.lat, lng: place.lon }}
            label={{
                text: place.name,
                className: 'map-label',
                fontSize: '14px'
            }}
          />
        ))}
        {/* Marqueur position utilisateur */}
        <Marker
          position={userPosition}
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        />
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
