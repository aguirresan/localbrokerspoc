import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PublishMessageDto } from './schema/PublishMessage.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  publishMessage(@Body() publishMessage: PublishMessageDto) {
    console.log(
      `Producer received POST request to publish message to topic. Content: ${publishMessage.message}`,
    );
    return this.appService.publishMessage(publishMessage.message);
  }
}
