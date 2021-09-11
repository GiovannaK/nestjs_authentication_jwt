import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 200)
  readonly name: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(8, 200)
  readonly password: string;
}
