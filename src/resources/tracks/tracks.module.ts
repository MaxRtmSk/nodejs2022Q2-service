import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [],
})
export class TracksModule {}
