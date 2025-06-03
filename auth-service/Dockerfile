FROM node:18

# Install netcat (nc)
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN chmod +x wait-for-db.sh

CMD ["./wait-for-db.sh"]
