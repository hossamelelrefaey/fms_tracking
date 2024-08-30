FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code
COPY . .
# Generate Prisma client
RUN npx prisma generate

# Expose the application port
EXPOSE 6000

# Command to run the application
CMD ["npm", "run", "start:prod"]