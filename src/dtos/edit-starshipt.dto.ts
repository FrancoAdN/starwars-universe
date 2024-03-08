import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class EditStarshipDto {
  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  model?: string;

  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  coordinates?: string;

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
