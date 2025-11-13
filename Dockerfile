FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --force
COPY . .

ARG VITE_API_LINK
ARG VITE_BUNNY_URL
ARG VITE_BUNNY_KEY

ENV VITE_API_LINK=$VITE_API_LINK
ENV VITE_BUNNY_URL=$VITE_BUNNY_URL
ENV VITE_BUNNY_KEY=$VITE_BUNNY_KEY

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000
CMD ["nginx", "-g", "daemon off;"]
