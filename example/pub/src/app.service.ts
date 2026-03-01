import { Injectable } from '@nestjs/common'
import { GcpPubSubClient } from 'nestjs-gcp-pubsub/client/gcp-pubsub-client'
import { InjectGcpClient } from 'nestjs-gcp-pubsub/client/inject-gcp-client'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class AppService {
	constructor(@InjectGcpClient('topic') private readonly gcpPubSubClient: GcpPubSubClient) {}

	async publish(): Promise<void> {
		await lastValueFrom(this.gcpPubSubClient.emit('hello', { message: 'Hellow world' }))
	}
}
