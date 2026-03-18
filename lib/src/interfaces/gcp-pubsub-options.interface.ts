import type { ClientConfig, PublishOptions, SubscriberOptions } from '@google-cloud/pubsub'

import type { Topic } from './topic.interface.js'

/**
 * Interface defining GcpPubSubOptions.
 *
 * @interface
 */
export interface GcpPubSubOptions {
	/**
	 * Prefix to prefix to topics and subscriptions. Useful for namespacing in shared Pub/Sub environments.
	 */
	prefix: string

	/**
	 * Separator between the prefix and the topic or subscription name.
	 * @default '.'
	 */
	prefixSeparator?: string

	/**
	 * Topics to subscribe to. The topic name should not include the prefix or separator, as they will be added automatically.
	 * Optionally PublishOptions can be specified for that topic.
	 *
	 * For example, if the prefix is `myapp` and the separator is `.`, then a topic named 'orders' will be subscribed to as `myapp.orders`.
	 * @type {Topic[]}
	 */
	topics: Topic[]

	/**
	 * Subscription name. The subscription name should not include the prefix, separator, or topic name, as they will be added automatically.
	 *
	 * For example, if the prefix is `myapp`, the separator is `.`, the topic is `orders`, then a subscription named `sub` will be created as `myapp.orders.sub`.
	 */
	subscription: string

	/**
	 * Whether to automatically create the topics and subscriptions if they do no exist.
	 *
	 * If `false`, the topics and subscriptions must be created manually in GCP Pub/Sub before running the application, otherwise an error will be thrown.
	 * @default true
	 */
	init?: boolean

	/**
	 * GCP Pub/Sub Client configuration options.
	 * @see {@link https://docs.cloud.google.com/nodejs/docs/reference/pubsub/latest/pubsub/clientconfig|ClientConfig} for more information on the available options.
	 */
	clientConfig?: ClientConfig

	/**
	 * GCP Pub/Sub Subscriber configuration options.
	 * @see {@link https://docs.cloud.google.com/nodejs/docs/reference/pubsub/latest/pubsub/subscriberoptions|SubscriberOptions} for more information on the available options.
	 */
	subscriptionOptions?: SubscriberOptions

	/**
	 * GCP Pub/Sub Publish configuration options.
	 * @see {@link https://docs.cloud.google.com/nodejs/docs/reference/pubsub/latest/pubsub/publishoptions|PublishOptions} for more information on the available options.
	 */
	publishOptions?: PublishOptions

	/**
	 * Whether to automatically acknowledge messages after they are processed.
	 *
	 * If `false`, messages must be acknowledged manually in the message handler, otherwise they will be redelivered after the ack deadline expires.
	 * @default true
	 */
	autoAck?: boolean
}
