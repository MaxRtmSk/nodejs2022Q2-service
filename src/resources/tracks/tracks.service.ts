import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';
import { Track } from './schemas/track.schema';


@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}
  
  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany({});
  }

  async findOneById(id: string): Promise<Track> {
    const track = await this.prisma.track.findUniqueOrThrow({where:{id}}).catch(()=> { throw new HttpException(
      `Track ${id} doesn't exist`,
      HttpStatus.NOT_FOUND,
    );});

    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = await this.prisma.track.create({
      data: {...createTrackDto },
    })
    
    return new Track(track);
  }

  async update(updateTrackDto: UpdateTrackDto, id: string): Promise<Track> {
    await this.prisma.track.findUniqueOrThrow({where:{id}}).catch(()=> { throw new HttpException(
      `Track ${id} doesn't exist`,
      HttpStatus.NOT_FOUND,
    );});

    const updated_track= await this.prisma.track.update({where: {id}, data: {
      ...updateTrackDto
    }})

    return new Track(updated_track);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.track.findUniqueOrThrow({where:{id}}).catch(()=> { throw new HttpException(
      `Track ${id} doesn't exist`,
      HttpStatus.NOT_FOUND,
    );});

    await this.prisma.track.delete({where: {id}})

    // favorites.tracks = favorites.tracks.filter((trackId) => trackId != id);
  }

  // async removeArtist(id: string): Promise<void> {
  //   tracks = await Promise.all(
  //     tracks.map(async (track) => {
  //       if (track.artistId === id) {
  //         return {
  //           ...track,
  //           artistId: null,
  //         };
  //       } else {
  //         return track;
  //       }
  //     }),
  //   );
  //   console.log('remove artist tracks', id, tracks);
  // }

  // async removeAlbum(id: string): Promise<void> {
  //   tracks = await Promise.all(
  //     tracks.map(async (track) => {
  //       return {
  //         ...track,
  //         albumId: track.albumId === id ? null : track.albumId,
  //       };
  //     }),
  //   );
  //   console.log('remove album tracks', id, tracks);
  // }
}
