import type { GcpPubSubOptions } from '../../interfaces/gcp-pubsub-options.interface.js'

/**
 * Interface defining GcpPubSubClientModule options.
 *
 * @interface
 */
export interface GcpPubSubClientModuleOptions extends Omit<GcpPubSubOptions, 'subscription'> {}

export interface GcpPubSubClientOptionsFactory {
	createGcpPubSubClientOptions(): Promise<GcpPubSubClientModuleOptions> | GcpPubSubClientModuleOptions
}
