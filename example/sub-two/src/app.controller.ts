import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'

@Controller()
export class AppController {
	@EventPattern('hello')
	handleHello(data: unknown) {
		console.log('sub-two', data)
	}
}
