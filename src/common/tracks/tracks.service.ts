import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { favorites } from '../favorites/favorites.service';
import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';
import { Track } from './schemas/track.schema';

export let tracks: Track[] = [];

@Injectable()
export class TracksService {
  async findAll(): Promise<Track[]> {
    return tracks;
  }

  async findOneById(id: string): Promise<Track> {
    const track = tracks.find((track) => track.id === id);
    if (!track) {
      throw new HttpException(
        `Track ${id} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const new_track = new Track({
      id: randomUUID(),
      ...createTrackDto,
    });
    tracks.push(new_track);
    return new_track;
  }

  async update(updateTrackDto: UpdateTrackDto, id: string): Promise<Track> {
    const findIndexTrack = tracks.findIndex((track) => track.id === id);
    if (findIndexTrack < 0) {
      throw new HttpException(
        `Track ${id} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    tracks[findIndexTrack] = {
      ...tracks[findIndexTrack],
      ...updateTrackDto,
    };

    const track = await this.findOneById(id);
    return track;
  }

  async delete(id: string): Promise<void> {
    await this.findOneById(id);
    tracks = tracks.filter((track) => {
      return track.id != id;
    });

    favorites.tracks = favorites.tracks.filter((trackId) => trackId != id);
  }

  async removeArtist(id: string): Promise<void> {
    tracks = await Promise.all(
      tracks.map(async (track) => {
        if (track.artistId === id) {
          return {
            ...track,
            artistId: null,
          };
        } else {
          return track;
        }
      }),
    );
    console.log('remove artist tracks', id, tracks);
  }

  async removeAlbum(id: string): Promise<void> {
    tracks = await Promise.all(
      tracks.map(async (track) => {
        return {
          ...track,
          albumId: track.albumId === id ? null : track.albumId,
        };
      }),
    );
    console.log('remove album tracks', id, tracks);
  }
}
