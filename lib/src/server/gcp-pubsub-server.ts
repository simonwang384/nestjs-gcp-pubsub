import { type Message, PubSub, type Subscription, type Topic } from '@google-cloud/pubsub'
import { Logger } from '@nestjs/common'
import { type CustomTransportStrategy, Server } from '@nestjs/microservices'

import {
	checkSubscriptionsExist,
	checkTopicsExist,
	compileSubscriptionName,
	compileTopicName,
	createSubscriptions,
	createTopics,
} from '../common/util.js'
import {
	GCP_PUBSUB_AUTO_ACK_DEFAULT,
	GCP_PUBSUB_INIT_DEFAULT,
	GCP_PUBSUB_PREFIX_SEPARATOR_DEFAULT,
} from '../constants.js'
import type { GcpPubSubServerOptions } from './interfaces/gcp-pubsub-server-options.interface.js'

export class GcpPubSubServer extends Server implements CustomTransportStrategy {
	protected override readonly logger = new Logger(GcpPubSubServer.name)

	private readonly options: GcpPubSubServerOptions
	private readonly pubSubClient: PubSub
	private readonly subscriptions: Subscription[]
	private readonly topics: Topic[]

	constructor(options: GcpPubSubServerOptions) {
		super()
		this.options = {
			...options,
			init: options.init ?? GCP_PUBSUB_INIT_DEFAULT,
			prefixSeparator: options.prefixSeparator ?? GCP_PUBSUB_PREFIX_SEPARATOR_DEFAULT,
			autoAck: options.autoAck ?? GCP_PUBSUB_AUTO_ACK_DEFAULT,
		}
		this.pubSubClient = new PubSub(options.clientConfig)
		this.topics = []
		this.subscriptions = []
		for (const topicName of options.topics) {
			const compiledTopicName = compileTopicName(
				this.options.prefix,
				this.options.prefixSeparator as string,
				topicName,
			)
			const topic = this.pubSubClient.topic(compiledTopicName, options.publishOptions)
			this.topics.push(topic)
			this.subscriptions.push(
				this.pubSubClient.subscription(
					compileSubscriptionName(
						compiledTopicName,
						this.options.prefixSeparator as string,
						options.subscription,
					),
					{
						...this.options.subscriptionOptions,
						topic: topic,
					},
				),
			)
		}
	}

	override async listen(callback: () => void): Promise<void> {
		if (this.options.init) {
			await createTopics(...this.topics)
			await createSubscriptions(...this.subscriptions)
		} else {
			await checkTopicsExist(...this.topics)
			await checkSubscriptionsExist(...this.subscriptions)
		}

		this.subscriptions.forEach((subscription) => {
			subscription
				.on('message', async (message: Message) => {
					try {
						await this.handleMessage(message, subscription)
						if (this.options.autoAck) {
							message.ack()
						}
					} catch (err: unknown) {
						if (this.options.autoAck) {
							message.nack()
						}

						this.logger.error(err)
					}
				})
				.on('error', (err: unknown) => this.logger.error(err))
		})

		callback()
	}

	private async handleMessage(message: Message, subscription: Subscription): Promise<void> {
		let data: unknown
		try {
			data = JSON.parse(message.data.toString())
		} catch (_error: unknown) {
			this.logger.error(`Unsupported JSON message data format for message '${message.id}'`)
			return
		}

		const pattern = message.attributes.pattern
		if (!pattern) {
			const error = `Message '${message.id}' does not contain a pattern attribute`
			this.logger.error(error)
			throw new Error(error)
		}

		const handler = this.getHandlerByPattern(pattern)

		if (!handler) {
			const error = `No handler found for pattern '${pattern}'. Ensure you have a @EventPattern decorator for this pattern.`
			this.logger.error(error)
			throw new Error(error)
		}

		this.logger.debug(
			`Received message '${message.id}' from subscription '${subscription.name}' (topic '${(subscription.topic as Topic).name}') with pattern '${pattern}' and data: ${JSON.stringify(data)}`,
		)
		await handler(data)
	}

	// biome-ignore lint/complexity/noBannedTypes: Necessary to match NestJS Server base class signature
	override on<EventKey extends string = string, EventCallback extends Function = Function>(
		_event: EventKey,
		_callback: EventCallback,
	) {
		throw new Error('Method not implemented.')
	}

	override unwrap<T>(): T {
		return this.pubSubClient as T
	}

	override async close(): Promise<void> {
		await Promise.all(this.subscriptions.map((subscription) => subscription.close()))
		await this.pubSubClient.close()
	}
}
