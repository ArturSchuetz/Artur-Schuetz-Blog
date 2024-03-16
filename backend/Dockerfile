# Verwende ein Node-Image als Basis
FROM node:18

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die package.json und package-lock.json Datei
COPY package*.json ./

COPY .env.production /app/.env.production

# Installiere alle Abhängigkeiten
RUN npm install

# Kopiere den restlichen Code
COPY . .

# Starte die Anwendung
CMD ["npm", "run", "start"]
