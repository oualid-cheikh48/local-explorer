# Utilisation de l'image Node.js pour build React
FROM node:18 as build

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers du projet
COPY . .

# Construire l'application
RUN npm run build

# Utilisation de NGINX pour servir l'application React
FROM nginx:stable

# Copier le build dans NGINX
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Exposer le port 80 pour NGINX
EXPOSE 80

# Lancer NGINX
CMD ["nginx", "-g", "daemon off;"]
