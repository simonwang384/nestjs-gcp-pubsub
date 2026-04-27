import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GcpPubSubClientModule } from 'nestjs-gcp-pub-sub'

import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { gcpPubSubConfig } from './configs/gcp-sub-sub.config.js'

@Module({
	controllers: [AppController],
	providers: [AppService],
	imports: [
		ConfigModule.forRoot({
			load: [gcpPubSubConfig],
		}),
		GcpPubSubClientModule.forRoot({
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
		// GcpPubSubClientModule.forRootAsync({
		// 	...gcpPubSubConfig.asProvider(),
		// 	topics: [{ name: 'topic' }, { name: 'topic-2' }, { name: 'topic-3' }],
		// })
	],
})
export class AppModule {}
