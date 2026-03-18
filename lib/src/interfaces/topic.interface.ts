import type { PublishOptions } from '@google-cloud/pubsub'

/**
 * Interface defining Topic.
 *
 * @interface
 */
export interface Topic {
	/**
	 * Name for the topic
	 */
	name: string

	/**
	 * GCP Pub/Sub Publish configuration options.
	 * @see {@link https://docs.cloud.google.com/nodejs/docs/reference/pubsub/latest/pubsub/publishoptions|PublishOptions} for more information on the available options.
	 */
	options?: PublishOptions
}
