FROM node:16-alpine
WORKDIR /app

ARG APP_BASE_URL
ARG APP_API_KEY

COPY package.json ./
RUN npm install

COPY . ./
RUN rm -rf ./.env
RUN printf 'APP_BASE_URL="%s"\n' "${APP_BASE_URL}" >> ./.env
RUN printf 'APP_API_KEY="%s"\n' "${APP_API_KEY}" >> ./.env

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "prod"]
