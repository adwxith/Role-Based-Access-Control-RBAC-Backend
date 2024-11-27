# Use the Alpine-based Node.js image
FROM node

# Set the working directory
WORKDIR /app

# Copy project dependency files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose application port
EXPOSE 3000

CMD [ "node","index.js" ]

