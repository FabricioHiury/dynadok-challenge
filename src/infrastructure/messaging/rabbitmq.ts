import amqp, { Channel } from "amqplib";

const RABBIT_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";

let cachedChannel: Channel | null = null;

export async function getChannel(): Promise<Channel> {
  if (cachedChannel) return cachedChannel;
  const conn = await amqp.connect(RABBIT_URL);
  cachedChannel = await conn.createChannel();
  return cachedChannel;
}