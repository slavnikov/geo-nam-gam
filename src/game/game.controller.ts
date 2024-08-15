import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { Request } from 'express';
import { CookieUtil } from '../cookie-util/cookie-util';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Req() request : Request): string {
    const clientId = CookieUtil.getRequestingUesrId(request);

    return this.gameService.create(clientId);
  }

  @Get()
  findAll(): string[] {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
