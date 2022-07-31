import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArtistDto } from './dto/createArtist.dto';
import { UpdateArtistDto } from './dto/updateArtist.dto';
import { Artist } from './schemas/artist.schema';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}
 
  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany({});
  }

  async findOneById(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUniqueOrThrow({where:{id}}).catch(()=> { throw new HttpException(
      `Artist ${id} doesn't exist`,
      HttpStatus.NOT_FOUND,
    );});

    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = await this.prisma.artist.create({
      data: {...createArtistDto },
    })
    
    return new Artist(artist);
  }

  async update(updateArtistDto: UpdateArtistDto, id: string): Promise<Artist> {
   await this.prisma.artist.findUniqueOrThrow({where:{id}}).catch(()=>{throw new HttpException(`Artist ${id} doesn't exist`, HttpStatus.NOT_FOUND);});

    const updated_artist = await this.prisma.artist.update({where: {id}, data: {
      ...updateArtistDto
    }})

    return new Artist(updated_artist);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.artist.findUniqueOrThrow({where:{id}}).catch(()=>{throw new HttpException(`Artist ${id} doesn't exist`, HttpStatus.NOT_FOUND);});
    await this.prisma.artist.delete({where: {id}})

    // favorites.artists = favorites.artists.filter((artistId) => artistId != id);
    // await this.albumsService.removeArtist(id);
    // await this.tracksService.removeArtist(id);
  }
}
