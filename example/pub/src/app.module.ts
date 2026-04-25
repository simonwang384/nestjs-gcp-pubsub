import { Module } from '@nestjs/common'
import { GcpPubSubClientModule } from 'nestjs-gcp-pubsub'

import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

@Module({
	controllers: [AppController],
	providers: [AppService],
	imports: [
		GcpPubSubClientModule.forRoot({
			prefix: 'test',
			topics: [
				{ name: 'topic' },
				{ name: 'topic-2' },
				{ name: 'topic-3' },
			],
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
	],
})
export class AppModule {}
