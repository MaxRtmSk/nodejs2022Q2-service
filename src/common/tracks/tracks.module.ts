import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
