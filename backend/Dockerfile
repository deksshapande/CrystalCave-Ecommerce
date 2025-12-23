FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/. .

# Copy frontend into backend container
COPY frontend ./frontend

EXPOSE 5000

CMD ["node", "app.js"]
