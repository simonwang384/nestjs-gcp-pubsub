import { PubSub } from '@google-cloud/pubsub'
import type { Provider } from '@nestjs/common'

import { checkTopicsExist, compileTopicName, createTopics } from '../common/util.js'
import { GCP_PUBSUB_INIT_DEFAULT, GCP_PUBSUB_PREFIX_SEPARATOR_DEFAULT } from '../constants.js'
import { GcpPubSubClient } from './gcp-pubsub-client.js'
import { getGcpPubSubClientToken } from './gcp-pubsub-client-token.js'
import type { GcpPubSubClientModuleOptions } from './interfaces/gcp-pubsub-client-module-options.interface.js'

export function createGcpPubSubClientProviders(options: GcpPubSubClientModuleOptions): Provider[] {
	const gcpPubSubProvider: Provider = {
		provide: 'GCP_PUBSUB_CLIENT',
		useFactory: () => {
			return new PubSub(options.clientConfig)
		},
	}

	const topicProviders: Provider[] = options.topics.map((topic) => {
		const separator = options.prefixSeparator ?? GCP_PUBSUB_PREFIX_SEPARATOR_DEFAULT
		const init = options.init ?? GCP_PUBSUB_INIT_DEFAULT
		const topicName = compileTopicName(options.prefix, separator, topic.name)
		return {
			inject: ['GCP_PUBSUB_CLIENT'],
			provide: getGcpPubSubClientToken(topic.name),
			useFactory: async (pubSubClient: PubSub) => {
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
