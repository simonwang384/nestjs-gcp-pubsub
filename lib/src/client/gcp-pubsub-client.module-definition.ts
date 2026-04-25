import { ConfigurableModuleBuilder } from '@nestjs/common'

import type { Topic } from '../interfaces/topic.interface.js'
import type {
	GcpPubSubClientModuleOptions,
	GcpPubSubClientOptionsFactory,
} from './interfaces/gcp-pubsub-client-module-options.interface.js'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
	new ConfigurableModuleBuilder<GcpPubSubClientModuleOptions>({
		moduleName: 'GcpPubSubClient',
	})
		.setClassMethodName('forRoot')
		.setFactoryMethodName('createGcpPubSubClientOptions' as keyof GcpPubSubClientOptionsFactory)
		.setExtras(
			{
				isGlobal: false,
				topics: [] as Topic[],
			},
			(definition, extras) => ({
				...definition,
				global: extras.isGlobal,
				topics: extras.topics,
			}),
		)
		.build()
