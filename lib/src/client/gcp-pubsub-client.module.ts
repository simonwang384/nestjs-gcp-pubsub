import { PubSub } from '@google-cloud/pubsub'
import { DynamicModule, FactoryProvider, Module, Provider } from '@nestjs/common'

import { checkTopicsExist, compileTopicName, createTopics } from '../common/util.js'
import { GCP_PUBSUB_INIT_DEFAULT, GCP_PUBSUB_PREFIX_SEPARATOR_DEFAULT } from '../constants.js'
import { Topic } from '../interfaces/topic.interface.js'
import { GcpPubSubClient } from './gcp-pubsub-client.js'
import {
	ASYNC_OPTIONS_TYPE,
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN,
	OPTIONS_TYPE,
} from './gcp-pubsub-client.module-definition.js'
import { getGcpPubSubClientToken } from './gcp-pubsub-client-token.js'
import { GcpPubSubClientModuleOptions } from './interfaces/gcp-pubsub-client-module-options.interface.js'

@Module({})
export class GcpPubSubClientModule extends ConfigurableModuleClass {
	static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
		const baseModule = ConfigurableModuleClass.forRoot(options)

		const providers = GcpPubSubClientModule.createGcpPubSubClientProviders(options.topics)
		return {
			module: GcpPubSubClientModule,
			providers: [...(baseModule.providers || []), ...providers],
			global: options.isGlobal,
			exports: providers,
		}
	}

	static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
		const baseModule = ConfigurableModuleClass.forRootAsync(options)

		if (!options.topics) {
			throw new Error('Topics must be provided in the options for GcpPubSubClientModule')
		}

		const providers = GcpPubSubClientModule.createGcpPubSubClientProviders(options.topics)
		return {
			module: GcpPubSubClientModule,
			imports: baseModule.imports,
			providers: [...(baseModule.providers || []), ...providers],
			global: options.isGlobal,
			exports: providers,
		}
	}

	private static createGcpPubSubClientProviders(topics: Topic[]): Provider[] {
		const gcpPubSubProvider: FactoryProvider = {
			provide: 'GCP_PUBSUB_CLIENT',
			useFactory: (options: GcpPubSubClientModuleOptions) => {
				return new PubSub(options.clientConfig)
			},
			inject: [MODULE_OPTIONS_TOKEN],
		}

		const topicProviders: Provider[] = topics.map((topic) => {
			return {
				inject: ['GCP_PUBSUB_CLIENT', MODULE_OPTIONS_TOKEN],
				provide: getGcpPubSubClientToken(topic.name),
				useFactory: async (pubSubClient: PubSub, options: GcpPubSubClientModuleOptions) => {
					const separator = options.prefixSeparator ?? GCP_PUBSUB_PREFIX_SEPARATOR_DEFAULT
					const init = options.init ?? GCP_PUBSUB_INIT_DEFAULT
					const topicName = compileTopicName(options.prefix, separator, topic.name)
					const pubSubTopic = pubSubClient.topic(topicName, { ...options.publishOptions, ...topic.options })
					if (init) {
						await createTopics(pubSubTopic)
					} else {
						await checkTopicsExist(pubSubTopic)
					}

					return new GcpPubSubClient(pubSubTopic)
				},
			}
		})
		return [gcpPubSubProvider, ...topicProviders]
	}
}
