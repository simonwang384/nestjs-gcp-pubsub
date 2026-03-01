import { DynamicModule, Module } from '@nestjs/common'

import { createGcpPubSubClientProviders } from './gcp-pubsub-client.providers.js'
import { GcpPubSubClientModuleOptions } from './gcp-pubsub-client-module-options.js'

@Module({})
export class GcpPubSubClientModule {
	static forRoot(options: GcpPubSubClientModuleOptions): DynamicModule {
		const providers = createGcpPubSubClientProviders(options)
		return {
			module: GcpPubSubClientModule,
			providers: providers,
			global: options.isGlobal,
			exports: providers,
		}
	}
}
