import { getChannel } from '@/infrastructure/messaging/rabbitmq'

export async function startClientCreatedConsumer() {
  const channel = await getChannel()
  const queue = 'client.created'

  await channel.assertQueue(queue, { durable: true })
  console.log(`Listening for messages on ${queue}`)

  channel.consume(
    queue,
    (msg) => {
      if (!msg) return
      const data = JSON.parse(msg.content.toString())
      console.log('received client.created event:', data)

      channel.ack(msg)
    },
    { noAck: false },
  )
}
