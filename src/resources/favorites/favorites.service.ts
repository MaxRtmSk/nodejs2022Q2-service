import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Album } from '../albums/schemas/album.schema';
import { Artist } from '../artists/schemas/artist.schema';
import { Track } from '../tracks/schemas/track.schema';

interface FavoritesRepsonse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getFavorites(): Promise<FavoritesRepsonse> {
    const artists = await this.prisma.$queryRaw<Artist[]>(
      Prisma.sql`select * from "Artist" a  where id in (SELECT "artistId" from "Favorites" where "userId" = '1');`
    )
    const tracks = await this.prisma.$queryRaw<Track[]>(
      Prisma.sql`select * from "Track" a  where id in (SELECT "trackId" from "Favorites" where "userId" = '1');`
    )
    const albums = await this.prisma.$queryRaw<Album[]>(
      Prisma.sql`select * from "Album" a  where id in (SELECT "albumId" from "Favorites" where "userId" = '1');`
    )

    return {
      artists,
      albums,
      tracks
    };
  }

  async addTrack(id: string): Promise<void> {
    await this.prisma.track.findUniqueOrThrow({where:{id}}).catch(()=>{{
      throw new HttpException(
        `Track doesn't exists`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }})

    await this.prisma.favorites.create({
      data: {
        userId: '1',
        trackId: id,
      },
    })
  }

  async removeTrack(id: string): Promise<void> {
    const find_tracks = await this.prisma.favorites.findMany({where:{trackId: id, userId: '1'}})
    if(!find_tracks){
      throw new HttpException(
        `Track ${id} doesn't exist in favorites`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favorites.deleteMany({where: {
      userId: '1',
      trackId: id,
    },});
    return;
  }

  async addArtist(id: string): Promise<void> {
    await this.prisma.artist.findUniqueOrThrow({where:{id}}).catch(()=>{{
      throw new HttpException(
        `Artist doesn't exists`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }})


    await this.prisma.favorites.create({
      data: {
        userId: '1',
        artistId: id,
      },
    })
  }

  async removeArtist(id: string): Promise<void> {
    const find_artist= await this.prisma.favorites.findMany({where:{artistId: id, userId: '1'}})
    if(!find_artist){
      throw new HttpException(
        `Artist ${id} doesn't exist in favorites`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favorites.deleteMany({where: {
      userId: '1',
      artistId: id,
    },});
  }

  async addAlbum(id: string): Promise<void> {
    await this.prisma.album.findUniqueOrThrow({where:{id}}).catch(()=>{{
      throw new HttpException(
        `Album doesn't exists`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }})

    await this.prisma.favorites.create({
      data: {
        userId: '1',
        albumId: id,
      },
    })
  }

  async removeAlbum(id: string): Promise<void> {
    const find_album = await this.prisma.favorites.findMany({where:{albumId: id, userId: '1'}})
    if(!find_album){
      throw new HttpException(
        `Album ${id} doesn't exist in favorites`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favorites.deleteMany({where: {
      userId: '1',
      albumId: id,
    },});
  }
}
