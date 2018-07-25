FROM node:9.11.2
ADD . /srv
WORKDIR /srv
RUN yarn --production
CMD ["make", "server"]
