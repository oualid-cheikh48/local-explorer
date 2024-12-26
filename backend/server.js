const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Fallback - Activités par défaut avec coordonnées GPS
const fallbackActivities = [
    {
        name: 'Musée des Beaux-Arts',
        address: '20 Place des Terreaux, Lyon',
        hours: '10h00 - 18h00',
        site: 'https://mba-lyon.fr',
        lat: 45.7675,
        lon: 4.8342
    },
    {
        name: 'Parc de la Tête d’Or',
        address: '6e arrondissement, Lyon',
        hours: 'Ouvert toute la journée',
        site: 'https://lyon.fr/parc',
        lat: 45.7772,
        lon: 4.8557
    },
    {
        name: 'Cinéma Pathé Bellecour',
        address: '79 Rue de la République, Lyon',
        hours: '11h00 - 23h00',
        site: 'https://pathebellecour.com',
        lat: 45.7568,
        lon: 4.8364
    },
    {
        name: 'Zoo de Lyon',
        address: 'Parc de la Tête d’Or, Lyon',
        hours: '9h00 - 18h00',
        site: 'https://zoo-lyon.fr',
        lat: 45.7785,
        lon: 4.8543
    }
];

// Route météo
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;
    try {
        const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const weatherData = response.data.current_weather;

        if (weatherData) {
            const formattedWeather = {
                temperature: weatherData.temperature,
                condition: weatherData.weathercode || 'Clair',
            };
            res.json(formattedWeather);
        } else {
            res.status(500).send('Données météo non disponibles.');
        }
    } catch (error) {
        console.error('Erreur météo :', error.message);
        res.status(500).send('Erreur lors de la récupération de la météo.');
    }
});

// Route pour générer des activités basées sur la météo ou fallback
app.post('/activities', async (req, res) => {
    const { lat, lon } = req.body;

    try {
        const response = await axios.get(
            `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&radius=5000&categories=13000`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.FOURSQUARE_API_KEY}`,
                    Accept: 'application/json',
                },
            }
        );

        const places = response.data.results.map((place) => ({
            name: place.name,
            address: place.location.formatted_address || 'Adresse non disponible',
            hours: 'Voir site officiel',
            site: place.website || 'N/A',
            lat: place.geocodes.main.latitude,
            lon: place.geocodes.main.longitude
        }));

        res.json({ activities: places });
    } catch (error) {
        console.error('Erreur Foursquare :', error.message);
        res.json({ activities: fallbackActivities });
    }
});

app.listen(PORT, () => {
    console.log(`Backend en cours d'exécution sur le port ${PORT}`);
});
