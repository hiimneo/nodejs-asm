import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from 'src/dtos/artist/create-artist.dto';
import { UpdateArtistDto } from 'src/dtos/artist/update-artist.dto';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) { }

  @Get()
  async getArtists() {
    return await this.artistsService.findAll()
  }

  @Get(':id')
  async getArtistById(id: string) {
    return await this.artistsService.findById(id)
  }

  @Post()
  async createArtist(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistsService.createArtist(createArtistDto)
  }

  @Put(':id')
  async updateArtist(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return await this.artistsService.updateArtist(id, updateArtistDto)
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    return await this.artistsService.deleteArtist(id)
  }
}
