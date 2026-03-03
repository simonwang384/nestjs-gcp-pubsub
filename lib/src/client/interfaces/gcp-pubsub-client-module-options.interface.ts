import type { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common'

import type { GcpPubSubOptions } from '../../interfaces/gcp-pubsub-options.interface.js'

/**
 * Interface defining GcpPubSubClientModule options.
 *
 * @interface
 */
export interface GcpPubSubClientModuleOptions extends Omit<GcpPubSubOptions, 'subscription'> {
	/**
	 * Set module as global
	 * @default false
	 */
	isGlobal?: boolean
}

export interface GcpPubSubClientModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	isGlobal?: boolean
	useExisting?: Type<GcpPubSubClientOptionsFactory>
	useClass?: Type<GcpPubSubClientOptionsFactory>
	useFactory?: (...args: unknown[]) => Promise<GcpPubSubClientModuleOptions> | GcpPubSubClientModuleOptions
	inject?: (InjectionToken | OptionalFactoryDependency)[]
}

export interface GcpPubSubClientOptionsFactory {
	createGcpPubSubClientOptions(): Promise<GcpPubSubClientModuleOptions> | GcpPubSubClientModuleOptions
}
