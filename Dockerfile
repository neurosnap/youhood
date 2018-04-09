FROM node:9.11.1
ADD . /srv
WORKDIR /srv
RUN yarn
RUN make prod
CMD ["make", "server"]