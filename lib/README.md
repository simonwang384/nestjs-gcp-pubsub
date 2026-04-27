# @swang-dev/nestjs-gcp-pubsub

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

A simple module following NestJS recommendations for creating a microservice for GCP PubSub. This library contains a custom transporter for subscribing and a module for publishing.

## Installation

```bash
npm i --save @@swang-dev/nestjs-gcp-pubsub
```

## Quick Start

### Client (Publisher)

Import `GcpPubSubClientModule`:  

```typescript
// Module
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GcpPubSubClientModule } from '@swang-dev/nestjs-gcp-pubsub'

@Module({
  controllers: [],
  providers: [],
  imports: [
    // forRoot configuration
    GcpPubSubClientModule.forRoot({
      prefix: 'test',
      topics: [{ name: 'topic' }],
      clientConfig: {
        projectId: 'test-project',
        credentials: {
          client_email: 'fake@example.com',
          private_key: 'fake',
        },
      },
    }),
    // forRootAsync configuration
    GcpPubSubClientModule.forRootAsync({
      useFactory: () => ({
        prefix: 'test',
        topics: [{ name: 'topic' }, { name: 'topic-2' }, { name: 'topic-3' }],
          clientConfig: {
            projectId: 'test-project',
            apiEndpoint: 'localhost:8085',
            emulatorMode: true,
            credentials: {
            client_email: 'fake@example.com',
            private_key: 'fake',
            },
          },
      }),
      topics: [{ name: 'topic' }, { name: 'topic-2' }, { name: 'topic-3' }],
    })
  ],
})
export class AppModule {}
```

Inject the `GcpPubSubClient` with the topic name:

```ts
// Service
import { Injectable } from '@nestjs/common'
import { GcpPubSubClient, InjectGcpPubSubClient } from '@swang-dev/nestjs-gcp-pubsub'

@Injectable()
export class AppService {
  constructor(@InjectGcpPubSubClient('topic') private readonly gcpPubSubClient: GcpPubSubClient) {}

  publish(): void {
    this.gcpPubSubClient.emit('hello', { message: 'Hellow world' })
  }
}
```

### Server (Subscriber)

Create microservice with `GcpPubSubServer`:

```typescript
// main
import { NestFactory } from '@nestjs/core'
import type { MicroserviceOptions } from '@nestjs/microservices'
import { GcpPubSubServer } from '@swang-dev/nestjs-gcp-pubsub'

import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    strategy: new GcpPubSubServer({
      prefix: 'test',
      topics: [{ name: 'topic' }, { name: 'topic-2' }, { name: 'topic-3' }],
      subscription: 'sub-one',
      clientConfig: {
        projectId: 'test-project',
        apiEndpoint: 'localhost:8085',
        emulatorMode: true,
        credentials: {
          client_email: 'fake@example.com',
          private_key: 'fake',
        },
      },
    }),
  })

  await app.listen()
}

void bootstrap()
```

Use `@EventPattern(event)` to handle events:

```typescript
// Controller
import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'

@Controller()
export class AppController {
  @EventPattern('hello')
  handleHello(data: unknown) {
    console.log('sub', data)
  }
 }
```

## References

- [NestJS](https://docs.nestjs.com/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [NestJS Custom Transports](https://docs.nestjs.com/microservices/custom-transport)
- [GCP PubSub](https://docs.cloud.google.com/pubsub/docs/overview)
