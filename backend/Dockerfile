# Utiliser une image Node.js LTS (Long Term Support)
FROM node:18

# Installer les dépendances nécessaires pour la compilation (node-gyp)
# python3, make, et g++ (compilateur C++)
RUN apt-get update && apt-get install -y python3 make g++ --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail dans le conteneur
WORKDIR /app/backend

# Copier package.json et package-lock.json (pour profiter du cache Docker)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du backend
# Note: On pourrait ajouter un .dockerignore pour exclure node_modules, .git, etc.
COPY . .

# Exposer le port sur lequel le serveur backend écoute
EXPOSE 3001

# Commande pour démarrer l'application
CMD [ "node", "src/index.js" ] 