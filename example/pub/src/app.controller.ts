import { Controller, Post } from '@nestjs/common'

import { AppService } from './app.service.js'

@Controller('app')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('publish')
	async publish() {
		await this.appService.publish()
	}
}
