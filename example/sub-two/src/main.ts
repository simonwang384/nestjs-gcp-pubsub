import { NestFactory } from '@nestjs/core'
import type { MicroserviceOptions } from '@nestjs/microservices'
import { GcpPubSubServer } from 'nestjs-gcp-pub-sub'

import { AppModule } from './app.module.js'

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		strategy: new GcpPubSubServer({
			prefix: 'test',
			topics: [{ name: 'topic' }, { name: 'topic-2' }, { name: 'topic-3' }],
			subscription: 'sub-two',
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
	})

	await app.listen()
}

void bootstrap()
