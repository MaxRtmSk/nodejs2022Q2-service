import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { favorites } from '../favorites/favorites.service';
import { TracksService } from '../tracks/tracks.service';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import { Album } from './schemas/album.schema';

export let albums: Album[] = [];

@Injectable()
export class AlbumsService {
  @Inject(TracksService)
  private tracksService: TracksService;

  async findAll(): Promise<Album[]> {
    return albums;
  }

  async findOneById(id: string): Promise<Album> {
    const album = albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(
        `Album ${id} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const new_album = new Album({
      id: randomUUID(),
      ...createAlbumDto,
    });
    albums.push(new_album);
    return new_album;
  }

  async update(updateAlbumDto: UpdateAlbumDto, id: string): Promise<Album> {
    const findIndexAlbum = albums.findIndex((album) => album.id === id);
    if (findIndexAlbum < 0) {
      throw new HttpException(
        `Album ${id} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    albums[findIndexAlbum] = {
      ...albums[findIndexAlbum],
      ...updateAlbumDto,
    };

    const album = await this.findOneById(id);
    return album;
  }

  async delete(id: string): Promise<void> {
    await this.findOneById(id);
    albums = albums.filter((album) => {
      return album.id != id;
    });

    favorites.albums = favorites.albums.filter((albumId) => albumId != id);
    await this.tracksService.removeAlbum(id);
  }

  async removeArtist(id: string): Promise<void> {
    albums = await Promise.all(
      albums.map(async (album) => {
        if (album.artistId === id) {
          return {
            ...album,
            artistId: null,
          };
        } else {
          return album;
        }
      }),
    );
  }
}
