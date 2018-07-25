FROM node:9.11.2-slim
RUN apt-get update && apt-get install python
ADD . /srv
WORKDIR /srv
RUN yarn
RUN make prod
CMD ["make", "server"]
