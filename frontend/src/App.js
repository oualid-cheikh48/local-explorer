import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Map from './Map';
import Chat from './chat';

function App() {
    const [weather, setWeather] = useState(null);
    const [activities, setActivities] = useState([]);
    const [city, setCity] = useState('');
    const [userPosition, setUserPosition] = useState({ lat: 45.7640, lng: 4.8357 });

    // Récupérer la ville par géolocalisation
    const fetchCity = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const cityName = response.data.address.city || response.data.address.town || 'Ville inconnue';
            setCity(cityName);
        } catch (error) {
            console.error('Erreur lors de la récupération de la ville :', error);
            setCity('Localisation inconnue');
        }
    };

    // Récupérer la météo
    const fetchWeather = useCallback(async (lat, lon) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/weather?lat=${lat}&lon=${lon}`
            );
            const weatherData = response.data;
            const formattedWeather = `${weatherData.temperature}°C avec ${weatherData.condition}`;
            setWeather(formattedWeather);
        } catch (error) {
            console.error('Erreur météo :', error.message);
            setWeather('Météo non disponible');
        }
    }, []);

    // Récupérer les activités
    const fetchActivities = async (lat, lon) => {
        try {
            const response = await axios.post('http://localhost:5000/activities', {
                lat,
                lon
            });
            setActivities(response.data.activities || []);
        } catch (error) {
            console.error('Erreur activités :', error.message);
        }
    };

    // Utilisation de l'API de géolocalisation
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setUserPosition({ lat: latitude, lng: longitude });

            // Appel pour récupérer la ville et la météo
            fetchCity(latitude, longitude);
            fetchWeather(latitude, longitude);

            // Charger activités par défaut
            fetchActivities(latitude, longitude);
        });
    }, [fetchWeather]);

    return (
        <div className="App">
            <div className="bonjour-banner">
                Bonjour ! Voici quelques activités près de <strong>{city}</strong>
            </div>

            {weather && (
                <div className="weather-banner">
                    <p>Température actuelle : {weather}</p>
                </div>
            )}

            <div className="content">
                <div className="activities">
                    {activities.map((activity, index) => (
                        <div key={index} className="activity">
                            <h3>{activity.name}</h3>
                            <p>{activity.address}</p>
                        </div>
                    ))}
                </div>
                <Chat updateActivities={setActivities} />
            </div>

            <div className="map-container">
                <Map places={activities} userPosition={userPosition} />
            </div>
        </div>
    );
}

export default App;
