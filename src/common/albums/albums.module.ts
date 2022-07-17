import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { Module } from '@nestjs/common';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [TracksModule],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
