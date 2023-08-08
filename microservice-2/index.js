const amqp = require('amqplib');
require('dotenv').config()

const queueName = process.env.TASK_QUEUE;
const resultQueueName = process.env.RESULT_QUEUE;

async function consumeTasks() {
  try {
    const connection = await amqp.connect(process.env.RABBIT_MQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    await channel.assertQueue(resultQueueName);
    console.log('Microservice M2 waiting for tasks...');
    await channel.consume(queueName, async (message) => {
      if (message !== null) {
        console.log('M2: received task from RabbitMQ: ', Date.now())
        const task = JSON.parse(message.content.toString());
        const processedResult = { ...task, processed: true };
        channel.sendToQueue(resultQueueName, Buffer.from(JSON.stringify(processedResult)));
        console.log('M2: task sent to RabbitMQ: ', Date.now())
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error('Error in Microservice M2:', error);
  }
}

consumeTasks();
