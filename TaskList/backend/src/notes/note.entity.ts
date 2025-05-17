import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

 
  @Column({
    type: 'varchar',
    length: 1,
    default: 'f',  
  })
  archived: string;

  
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  tag: string;

  @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
  user: User;
}