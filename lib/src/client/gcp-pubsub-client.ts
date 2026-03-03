import type { Topic } from '@google-cloud/pubsub'
import { Logger } from '@nestjs/common'
import { ClientProxy, type ReadPacket, type WritePacket } from '@nestjs/microservices'

export class GcpPubSubClient extends ClientProxy {
	protected readonly logger = new Logger(GcpPubSubClient.name)
	private readonly topic: Topic

	constructor(topic: Topic) {
		super()
		this.topic = topic
	}

	override connect(): Promise<Topic> {
		return Promise.resolve(this.topic)
	}

	override async close(): Promise<void> {
		await this.topic.pubsub.close()
	}

	override unwrap<T>(): T {
		return this.topic as T
	}

	protected override publish(_packet: ReadPacket, _callback: (packet: WritePacket) => void): () => void {
		this.logger.log('Publishing messages is not supported in GcpPubSubClient. Use the emit() method instead.')
		throw new Error('Method not implemented.')
	}

	protected override async dispatchEvent<T>(packet: ReadPacket): Promise<T> {
		this.logger.debug(
			`Publishing message to topic '${this.topic.name}' with pattern '${packet.pattern}' and data: ${JSON.stringify(packet.data)}`,
		)
		return (await this.topic.publishMessage({
			data: Buffer.from(JSON.stringify(packet.data)),
			attributes: {
				pattern: packet.pattern,
			},
		})) as T
	}
}
