import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // Creación de nota: el campo tag se asegura de enviarse como string (cadena vacía si es undefined)
  @Post()
  create(
    @Body() body: { title: string; content: string; tag?: string },
    @Req() req: RequestWithUser
  ) {
    const userId = req.user.id;
    return this.notesService.create(body.title, body.content, body.tag ?? '', userId);
  }

  // Obtener todas las notas según el usuario y estado de archivado
  @Get()
  findAll(@Query('archived') archived: string, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notesService.findAllByUser(userId, archived === 'true');
  }

  // Actualización de la nota con el campo tag
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() body: { title: string; content: string; tag?: string },
    @Req() req: RequestWithUser
  ) {
    const userId = req.user.id;
    return this.notesService.updateByUser(id, body.title, body.content, body.tag ?? '', userId);
  }

  // Eliminación de la nota
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notesService.removeByUser(id, userId);
  }

  // Alterna el estado archivado de la nota
  @Patch(':id/archive')
  toggleArchive(@Param('id') id: number, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.notesService.toggleArchiveByUser(id, userId);
  }
}