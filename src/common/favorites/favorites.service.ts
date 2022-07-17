import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { albums, AlbumsService } from '../albums/albums.service';
import { Album } from '../albums/schemas/album.schema';
import { artists, ArtistsService } from '../artists/artists.service';
import { Artist } from '../artists/schemas/artist.schema';
import { Track } from '../tracks/schemas/track.schema';
import { tracks, TracksService } from '../tracks/tracks.service';

export const favorites = {
  artists: [],
  albums: [],
  tracks: [],
};

interface FavoritesRepsonse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

@Injectable()
export class FavoritesService {
  @Inject(TracksService)
  private readonly tracksService: TracksService;
  @Inject(AlbumsService)
  private readonly albumsService: AlbumsService;
  @Inject(ArtistsService)
  private readonly artistsService: ArtistsService;

  async getFavorites(): Promise<FavoritesRepsonse> {
    const artists = await Promise.all(
      favorites.artists.map(async (artistId) => {
        const artist = await this.artistsService.findOneById(artistId);
        return artist;
      }),
    );

    const albums = await Promise.all(
      favorites.albums.map(async (albumId) => {
        const album = await this.albumsService.findOneById(albumId);
        return album;
      }),
    );

    const tracks = await Promise.all(
      favorites.tracks.map(async (trackId) => {
        const track = await this.tracksService.findOneById(trackId);
        return track;
      }),
    );

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addTrack(id: string): Promise<void> {
    const track = tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException(
        `Track doesn't exists`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favorites.tracks.push(id);
  }

  async removeTrack(id: string): Promise<void> {
    if (!favorites.tracks.includes(id)) {
      throw new HttpException(
        `Track ${id} doesn't exist in favorites`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    favorites.tracks = favorites.tracks.filter((trackId) => trackId != id);
    return;
  }

  async addArtist(id: string): Promise<void> {
    const artist = artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new HttpException(
        `Artist doesn't exists`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favorites.artists.push(id);
  }

  async removeArtist(id: string): Promise<void> {
    if (!favorites.artists.includes(id)) {
      throw new HttpException(
        `Artist ${id} doesn't exist in favorites`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favorites.artists = favorites.artists.filter((artistId) => artistId != id);
  }

  async addAlbum(id: string): Promise<void> {
    const album = albums.find((album) => album.id === id);
    if (!album) {
      throw new HttpException(
        `Album doesn't exists`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favorites.albums.push(id);
  }

  async removeAlbum(id: string): Promise<void> {
    if (!favorites.albums.includes(id)) {
      throw new HttpException(
        `Album ${id} doesn't exist in favorites`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favorites.albums = favorites.albums.filter((albumId) => albumId != id);
  }
}
