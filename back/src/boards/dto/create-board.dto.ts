import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;
}