import type { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common'

import type { GcpPubSubOptions } from '../common/gcp-pubsub-options.js'

export interface GcpPubSubClientModuleOptions extends Omit<GcpPubSubOptions, 'subscription'> {
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
