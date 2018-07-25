FROM node:9.11.2-slim
ADD . /srv
WORKDIR /srv
RUN yarn
RUN make prod
CMD ["make", "server"]
