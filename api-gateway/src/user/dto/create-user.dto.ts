/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Role } from '../enums/role.enum';
 
 

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsArray()
  roles?: Role[];
}
