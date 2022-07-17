import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AlbumsService } from '../albums/albums.service';
import { favorites } from '../favorites/favorites.service';
import { TracksService } from '../tracks/tracks.service';
import { CreateArtistDto } from './dto/createArtist.dto';
import { UpdateArtistDto } from './dto/updateArtist.dto';
import { Artist } from './schemas/artist.schema';

export let artists: Artist[] = [];

@Injectable()
export class ArtistsService {
  @Inject(AlbumsService)
  private readonly albumsService: AlbumsService;
  @Inject(TracksService)
  private readonly tracksService: TracksService;

  async findAll(): Promise<Artist[]> {
    return artists;
  }

  async findOneById(id: string): Promise<Artist> {
    const artist = artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException(
        `Artist ${id} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const new_artist = new Artist({
      id: randomUUID(),
      ...createArtistDto,
    });
    artists.push(new_artist);
    return new_artist;
  }

  async update(updateArtistDto: UpdateArtistDto, id: string): Promise<Artist> {
    const findIndexArtist = artists.findIndex((artist) => artist.id === id);
    if (findIndexArtist < 0) {
      throw new HttpException(
        `Artist ${id} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    artists[findIndexArtist] = {
      ...artists[findIndexArtist],
      ...updateArtistDto,
    };

    const artist = await this.findOneById(id);
    return artist;
  }

  async delete(id: string): Promise<void> {
    await this.findOneById(id);
    artists = artists.filter((artist) => {
      return artist.id != id;
    });

    favorites.artists = favorites.artists.filter((artistId) => artistId != id);
    await this.albumsService.removeArtist(id);
    await this.tracksService.removeArtist(id);
  }
}
