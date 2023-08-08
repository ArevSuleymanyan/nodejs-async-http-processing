const amqp = require('amqplib');
const { processedData } = require('../service/ProcessedDataService')

const resultQueue = process.env.RESULT_QUEUE

class RabbitMQService {
  constructor() {
    this.rabbitMQUrl='amqp://localhost'
    this.rabbitMQ = new Map()
  }

  async init() {
    if(this.rabbitMQ.has('channel')){
      this.rabbitMQ.clear()
    }
    const connection = await amqp.connect(this.rabbitMQUrl);
    const channel = await connection.createChannel();
    this.rabbitMQ.set('channel', channel)
  }

  getChannel() {
    if(this.rabbitMQ.has('channel')){
      return this.rabbitMQ.get('channel')
    }
  }

 async  consumeTasks(){
  try {
    const channel = this.getChannel()
    await channel?.assertQueue(resultQueue);
    await channel?.consume(resultQueue, async (message) => {
        if (message !== null) {
          const task = JSON.parse(message.content.toString());
          const data = processedData.getData(task.id)
          data.response.status(200).json({result: task })
          channel.ack(message);
        }
      });
    } catch (error) {
      console.error('Error in Microservice M1:', error);
    }
  }
}

const rabbitMQ = new RabbitMQService()

module.exports = {
  rabbitMQ
}
