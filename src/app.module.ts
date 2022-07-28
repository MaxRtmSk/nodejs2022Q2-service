import { FavoritesModule } from './resources/favorites/favorites.module';
import { AlbumsModule } from './resources/albums/albums.module';
import { ArtistsModule } from './resources/artists/artists.module';
import { TracksModule } from './resources/tracks/tracks.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './resources/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    FavoritesModule,
    AlbumsModule,
    ArtistsModule,
    TracksModule,
    UsersModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
