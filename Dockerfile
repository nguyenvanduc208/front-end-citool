# pull official base image
FROM python:3.8

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
RUN apt update && apt install npm nodejs -y
COPY package.json ./
RUN echo 52.192.72.89 github.com > /etc/hosts; npm install
# add app
COPY . ./

# start app
CMD ["npm", "start"]