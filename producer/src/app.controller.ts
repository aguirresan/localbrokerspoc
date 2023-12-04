import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FieldEventsDto } from './schema/FieldEvents.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  publishMessage(@Body() events: FieldEventsDto[]) {
    console.log(
      `Producer received POST request to publish events to the event bus. Content: ${events}`,
    );
    return this.appService.putEvents(events);
  }
}
