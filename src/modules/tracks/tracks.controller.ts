import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { Track } from 'src/entities/track.entity';
import { CreateTrackDto } from 'src/dtos/track/create-track.dto';
import { UpdateTrackDto } from 'src/dtos/track/update-track.dto';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) { }

  @Get()
  async getTracks() {
    return await this.tracksService.findAll()
  }

  @Get(':id')
  async getTrackById(@Param('id') id: string) {
    return await this.tracksService.findById(id)
  }

  @Post()
  async createTrack(@Body() createTrackDto: CreateTrackDto) {
    return await this.tracksService.createTrack(createTrackDto)
  }

  @Put(':id')
  async updateTrack(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return await this.tracksService.updateTrack(id, updateTrackDto)
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    return await this.tracksService.deleteTrack(id)
  }
}
