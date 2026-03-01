import { Inject } from '@nestjs/common'

import { getGcpClientToken } from './gcp-client-token.js'

export const InjectGcpClient = (topic: string) => Inject(getGcpClientToken(topic))
