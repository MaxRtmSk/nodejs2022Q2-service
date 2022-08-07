import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import { Album } from './schemas/album.schema';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany({});
  }

  async findOneById(id: string): Promise<Album> {
    const album = await this.prisma.album.findUniqueOrThrow({where:{id}}).catch(()=> { throw new HttpException(
      `Album ${id} doesn't exist`,
      HttpStatus.NOT_FOUND,
    );});

    return new Album(album);
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const new_album = await this.prisma.album.create({
      data: {...createAlbumDto },
    })
    
    return new Album(new_album);
  }

  async update(updateAlbumDto: UpdateAlbumDto, id: string): Promise<Album> {
    await this.prisma.album.findUniqueOrThrow({where:{id}}).catch(()=>{throw new HttpException(`Album ${id} doesn't exist`, HttpStatus.NOT_FOUND);});

    const updated_album = await this.prisma.album.update({where: {id}, data: {
      ...updateAlbumDto
    }})

    return new Album(updated_album);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.album.findUniqueOrThrow({where:{id}}).catch(()=>{throw new HttpException(`Album ${id} doesn't exist`, HttpStatus.NOT_FOUND);});
    await this.prisma.album.delete({where: {id}})

    // favorites.albums = favorites.albums.filter((albumId) => albumId != id);
    // await this.tracksService.removeAlbum(id);
  }

  // async removeArtist(id: string): Promise<void> {
  //   albums = await Promise.all(
  //     albums.map(async (album) => {
  //       if (album.artistId === id) {
  //         return {
  //           ...album,
  //           artistId: null,
  //         };
  //       } else {
  //         return album;
  //       }
  //     }),
  //   );
  // }
}
