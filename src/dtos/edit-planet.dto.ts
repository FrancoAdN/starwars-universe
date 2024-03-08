import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class EditPlanetDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  population?: number;

  @IsOptional()
  @IsNotEmpty()
  climate?: string;

  @IsOptional()
  @IsNotEmpty()
  terrain?: string;

  @IsOptional()
  @IsNotEmpty()
  coordinates?: string;
}
