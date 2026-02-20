# 1. Use an official Node.js image as the base
FROM node:18-bullseye-slim

# 2. Install Python and FFmpeg (required for yt-dlp)
RUN apt-get update && apt-get install -y python3 ffmpeg && rm -rf /var/lib/apt/lists/*

# 3. Set the working directory inside the container
WORKDIR /app

# 4. Copy your package files and install NPM dependencies
COPY package*.json ./
RUN npm install

# 5. Copy the rest of your app's code into the container
COPY . .

# 6. Expose the port and start the server
EXPOSE 3000
CMD ["node", "server.js"]

