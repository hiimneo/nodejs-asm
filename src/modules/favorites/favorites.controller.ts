import { Controller, Delete, Get, HttpCode, Param, Post, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Get()
  getFavorites(@Request() req) {
    return this.favoritesService.getFavorites(req.user.id)
  }

  @Post('/track/:id')
  addTrack(@Request() req, @Param('id') id: string) {
    return this.favoritesService.addTrack(req.user.id, id)
  }

  @HttpCode(204)
  @Delete('/track/:id')
  removeTrack(@Param('id') id: string) {
    return this.favoritesService.removeTrack(id)
  }
}
