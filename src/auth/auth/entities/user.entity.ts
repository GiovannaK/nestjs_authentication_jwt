import { IsEmail, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(1, 200)
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Length(8, 200)
  password: string;
}
