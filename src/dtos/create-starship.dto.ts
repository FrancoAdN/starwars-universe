import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateStarshipDto {
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsNotEmpty()
  model: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  passengers?: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  enemies?: string[];
}
