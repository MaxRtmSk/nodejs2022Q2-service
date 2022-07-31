import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import { Album } from './schemas/album.schema';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async getAll(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Album> {
    return this.albumsService.findOneById(id);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  register(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumsService.create(createAlbumDto);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    return this.albumsService.update(updateAlbumDto, id);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.albumsService.delete(id);
  }
}
