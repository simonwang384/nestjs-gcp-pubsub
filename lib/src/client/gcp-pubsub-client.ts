import type { Topic } from '@google-cloud/pubsub'
import { ClientProxy, type ReadPacket, type WritePacket } from '@nestjs/microservices'

export class GcpPubSubClient extends ClientProxy {
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
		throw new Error('Method not implemented.')
	}

	protected override async dispatchEvent<T>(packet: ReadPacket): Promise<T> {
		return (await this.topic.publishMessage({
			data: Buffer.from(JSON.stringify(packet.data)),
			attributes: {
				pattern: packet.pattern,
			},
		})) as T
	}
}
