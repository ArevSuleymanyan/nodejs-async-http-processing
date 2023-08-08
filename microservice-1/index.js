const express = require('express');
const bodyParser = require('body-parser');
const router = require('./api/index')

const app = express();

require('dotenv').config()

const { rabbitMQ } = require('./service/RabbitMQService')

app.use(bodyParser.json());

rabbitMQ.init().then(async () => {
  await rabbitMQ.consumeTasks();
});

app.use('/', router)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Microservice M1 listening on port ${port}`);
});
