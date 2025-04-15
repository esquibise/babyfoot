# --- Phase 1: Build --- 
FROM node:18 AS build-stage

WORKDIR /app/frontend

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du frontend
COPY . .

# Builder l'application pour la production
RUN npm run build

# --- Phase 2: Production --- 
FROM nginx:stable-alpine

# Copier les fichiers buildés depuis la phase de build
# Le build de Vite se trouve généralement dans le dossier 'dist'
COPY --from=build-stage /app/frontend/dist /usr/share/nginx/html

# Copier une configuration Nginx personnalisée pour gérer le routing Vue (HTML5 history mode)
# Nous allons créer ce fichier nginx.conf ensuite
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# La commande par défaut de l'image nginx démarre le serveur
CMD ["nginx", "-g", "daemon off;"] 