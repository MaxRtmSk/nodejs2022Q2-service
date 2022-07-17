import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
