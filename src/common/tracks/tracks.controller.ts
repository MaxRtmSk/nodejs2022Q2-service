import {
  Get,
  Controller,
  Post,
  Param,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';

import { Track } from './schemas/track.schema';
import { TracksService } from './tracks.service';

@Controller('track')
export class TracksController {
  constructor(private readonly trackService: TracksService) {}

  @Get()
  async getAll(): Promise<Track[]> {
    return this.trackService.findAll();
  }

  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    return this.trackService.findOneById(id);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  register(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackService.create(createTrackDto);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    return this.trackService.update(updateTrackDto, id);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.trackService.delete(id);
  }
}
