import { Inject } from '@nestjs/common'

import { getGcpPubSubClientToken } from './gcp-pubsub-client-token.js'

export const InjectGcpPubSubClient = (topic: string) => Inject(getGcpPubSubClientToken(topic))
