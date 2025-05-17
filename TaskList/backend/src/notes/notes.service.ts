import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  // Ahora se incluye el parámetro "tag"
  async create(title: string, content: string, tag: string, userId: number): Promise<Note> {
    const newNote = this.noteRepository.create({
      title,
      content,
      tag, // Se asigna el tag recibido
      user: { id: userId } as any,
      archived: 'f',
    });
    return await this.noteRepository.save(newNote);
  }

  async findAllByUser(userId: number, archived: boolean): Promise<Note[]> {
    // Convertir el parámetro boolean a cadena: true -> 't', false -> 'f'
    const archivedValue = archived ? 't' : 'f';
    return await this.noteRepository.find({
      where: {
        user: { id: userId },
        archived: archivedValue,
      },
    });
  }

  // Actualizamos la firma del método para recibir también "tag"
  async updateByUser(
    id: number,
    title: string,
    content: string,
    tag: string,
    userId: number
  ): Promise<Note> {
    // Verifica que la nota pertenezca al usuario
    const note = await this.noteRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!note) {
      throw new Error('Nota no encontrada o no autorizada');
    }
    note.title = title;
    note.content = content;
    note.tag = tag; // Actualizamos el tag
    return await this.noteRepository.save(note);
  }

  async removeByUser(id: number, userId: number): Promise<void> {
    const note = await this.noteRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!note) {
      throw new Error('Nota no encontrada o no autorizada');
    }
    await this.noteRepository.remove(note);
  }

  async toggleArchiveByUser(id: number, userId: number): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!note) {
      throw new Error('Nota no encontrada o no autorizada');
    }
    // Alterna el estado archivado: si es 't' pasa a 'f', de lo contrario a 't'
    note.archived = note.archived === 't' ? 'f' : 't';
    return await this.noteRepository.save(note);
  }
}