import { PubSub } from '@google-cloud/pubsub'
import type { Provider } from '@nestjs/common'

import { checkTopicsExist, compileTopicName, createTopics } from '../common/util.js'
import { getGcpClientToken } from './gcp-client-token.js'
import { GcpPubSubClient } from './gcp-pubsub-client.js'
import type { GcpPubSubClientModuleOptions } from './gcp-pubsub-client-module-options.js'

export function createGcpPubSubClientProviders(options: GcpPubSubClientModuleOptions): Provider[] {
	const gcpPubSubProvider: Provider = {
		provide: 'GCP_PUBSUB_CLIENT',
		useFactory: () => {
			return new PubSub(options.clientConfig)
		},
	}

	const topicProviders: Provider[] = options.topics.map((topic) => {
		const separator = options.prefixSeparator ?? '_'
		const init = options.init ?? true
		const topicName = compileTopicName(options.prefix, separator, topic)
		return {
			inject: ['GCP_PUBSUB_CLIENT'],
			provide: getGcpClientToken(topic),
			useFactory: async (pubSubClient: PubSub) => {
				const topic = pubSubClient.topic(topicName, options.publishOptions)
				if (init) {
					await createTopics(topic)
				} else {
					await checkTopicsExist(topic)
				}

				return new GcpPubSubClient(topic)
			},
		}
	})

	return [gcpPubSubProvider, ...topicProviders]
}
