import React, { useState, useEffect } from 'react';

function GeolocationExample() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Check if geolocation is available in the browser
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Handle the geolocation data
        const { latitude, longitude } = position.coords;
        // localStorage.setItem("latitude", latitude);
        // localStorage.setItem("longitude", longitude);
        setLocation({ latitude, longitude });
      }, (error) => {
        // Handle geolocation error
        console.error('Geolocation error:', error);
      });
    } else {
      console.error('Geolocation is not available in this browser.');
    }
  }, []);

  return (
    <div> 
      <h1>Geolocation Example</h1>
      {location ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}

export default GeolocationExample;
