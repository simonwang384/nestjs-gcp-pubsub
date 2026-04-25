import { registerAs } from '@nestjs/config'
import type { GcpPubSubClientModuleOptions } from 'nestjs-gcp-pubsub'

export const gcpPubSubConfig = registerAs(
	'gcpPubSub',
	(): GcpPubSubClientModuleOptions => ({
		prefix: 'test',
		topics: [{ name: 'topic' }, { name: 'topic-2' }, { name: 'topic-3' }],
		clientConfig: {
			projectId: 'test-project',
			apiEndpoint: 'localhost:8085',
			emulatorMode: true,
			credentials: {
				client_email: 'fake@example.com',
				private_key: 'fake',
			},
		},
	}),
)
