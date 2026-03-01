import type { ClientConfig, PublishOptions, SubscriberOptions } from '@google-cloud/pubsub'

export interface GcpPubSubOptions {
	prefix: string
	prefixSeparator?: string
	topics: string[]
	subscription: string
	init?: boolean
	clientConfig?: ClientConfig
	subscriptionOptions?: SubscriberOptions
	publishOptions?: PublishOptions
	autoAck?: boolean
}
