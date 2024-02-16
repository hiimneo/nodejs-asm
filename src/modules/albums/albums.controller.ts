import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from 'src/dtos/album/create-album.dto';
import { UpdateAlbumDto } from 'src/dtos/album/update-album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) { }

  @Get()
  async getTracks() {
    return await this.albumsService.findAll()
  }

  @Get(':id')
  async getTrackById(@Param('id') id: string) {
    return await this.albumsService.findById(id)
  }

  @Post()
  async createTrack(@Body() createAlbumDto: CreateAlbumDto) {
    return await this.albumsService.createAlbum(createAlbumDto)
  }

  @Put(':id')
  async updateTrack(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return await this.albumsService.updateAlbum(id, updateAlbumDto)
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    return await this.albumsService.deleteAlbum(id)
  }
}
