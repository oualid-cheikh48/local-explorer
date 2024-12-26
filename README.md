# Local Explorer

Local Explorer est une application web qui propose des activités en fonction de la météo et de votre localisation. Elle utilise une API météo, une API de localisation et une carte interactive pour afficher des activités locales.

## Fonctionnalités :
- Affiche les activités proches de votre position géographique.
- Intègre une carte Google Maps pour visualiser les activités.
- Propose des suggestions d'activités supplémentaires via un chatbot.
- Fallback avec des activités par défaut si aucune activité n'est trouvée.

---

## Prérequis :
- Docker
- Node.js (si développement local sans Docker)
- Clé API Google Maps
- Clé API Foursquare (pour les activités)
- Clé API Open Meteo (pour la météo)

---

## Installation :

1. Clonez le projet :
```bash
git clone https://github.com/votre-utilisateur/local-explorer.git
cd local-explorer
