import { ArtistsModule } from './common/artists/artists.module';
import { TracksModule } from './common/tracks/tracks.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './common/users/users.module';

@Module({
  imports: [ArtistsModule, TracksModule, UsersModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
