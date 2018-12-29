FROM node:10.15.0
ADD . /srv
WORKDIR /srv
RUN yarn --production
CMD ["make", "server"]
