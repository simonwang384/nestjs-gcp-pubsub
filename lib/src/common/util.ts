import type { Subscription, Topic } from '@google-cloud/pubsub'

export function compileTopicName(prefix: string, separator: string, topicName: string): string {
	return `${prefix}${separator}${topicName}`
}

export function compileSubscriptionName(
	topicName: string,
	separator: string,
	subscriptionName: string,
): string {
	return `${topicName}${separator}${subscriptionName}`
}

export async function createTopics(...topics: Topic[]): Promise<void> {
	const settled = await Promise.allSettled(topics.map((topic) => topic.create()))
	for (const result of settled) {
		if (result.status === 'rejected' && result.reason.code !== 6) {
			throw result.reason
		}
	}
}

export async function checkTopicsExist(...topics: Topic[]): Promise<void> {
	for (const topic of topics) {
		const [exists] = await topic.exists()
		if (!exists) {
			throw new Error(`Topic ${topic.name} does not exist`)
		}
	}
}

export async function createSubscriptions(...subscriptions: Subscription[]): Promise<void> {
	const settled = await Promise.allSettled(subscriptions.map((subscription) => subscription.create()))
	for (const result of settled) {
		if (result.status === 'rejected' && result.reason.code !== 6) {
			throw result.reason
		}
	}
}

export async function checkSubscriptionsExist(...subscriptions: Subscription[]): Promise<void> {
	for (const subscription of subscriptions) {
		const [exists] = await subscription.exists()
		if (!exists) {
			throw new Error(`Subscription ${subscription.name} does not exist`)
		}
	}
}
