import { Injectable } from '@nestjs/common'
import { GcpPubSubClient, InjectGcpPubSubClient } from '@simonwang/nestjs-gcp-pubsub'

@Injectable()
export class AppService {
	constructor(@InjectGcpPubSubClient('topic') private readonly gcpPubSubClient: GcpPubSubClient) {}

	publish(): void {
		this.gcpPubSubClient.emit('hello', { message: 'Hellow world' })
	}
}
