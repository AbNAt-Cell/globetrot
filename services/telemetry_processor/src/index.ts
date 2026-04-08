import { Kafka } from 'kafkajs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const kafka = new Kafka({
  clientId: 'uzo-telemetry-processor',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'telemetry-ingestion-group' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'telemetry-stream', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;
      const data = JSON.parse(message.value.toString());
      
      console.log(`Ingesting telemetry for device: ${data.deviceId}`);
      
      await prisma.telemetryEvent.create({
        data: {
          deviceId: data.deviceId,
          lat: data.lat,
          lng: data.lng,
          speed: data.speed,
          heading: data.heading,
          battery: data.battery,
          timestamp: new Date(data.timestamp)
        }
      });
      
      // ETA learning & traffic logic triggers here...
    },
  });
}

run().catch(console.error);
