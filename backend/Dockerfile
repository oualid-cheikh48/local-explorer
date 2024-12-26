# Utiliser une image Node.js
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du backend
COPY . .

# Exposer le port utilisé par le serveur
EXPOSE 5000

# Lancer l'application
CMD ["node", "server.js"]
