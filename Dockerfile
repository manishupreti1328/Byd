# 1. Use stable Node version
FROM node:20-alpine

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package files first (faster builds)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy full project
COPY . .

# 6. Build Next.js app
RUN npm run build

# 7. Expose Next.js port
EXPOSE 3000

# 8. Start Next.js in production
CMD ["npm", "run", "start"]
