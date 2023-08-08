const express = require('express')
const router = express.Router()
const { v4: uuid4 } = require('uuid');
require('dotenv').config()

const { processedData } = require('../service/ProcessedDataService')
const { rabbitMQ } = require('../service/RabbitMQService')
const queueName = process.env.TASK_QUEUE;


router.post('/process', async (req, res) => {
  try {
    const taskId = uuid4()
    const task = {
      ...req.body,
      id: taskId,
    };
    const channel = rabbitMQ.getChannel()
    await channel.assertQueue(queueName);
    console.log('M1: received http request: ', Date.now())
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(task)));
    processedData.setData(taskId, {...task, response: res})
  } catch (err) {
    res.status(500).json({ message: err.message})
  }
})

module.exports = router
