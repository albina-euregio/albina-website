#################
# Build the app #
#################
FROM node:lts as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn global add @angular/cli
RUN ng build --configuration=docker --output-path=/dist

################
# Run in NGINX #
################
FROM nginx:alpine
COPY --from=build /dist /usr/share/nginx/html

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
