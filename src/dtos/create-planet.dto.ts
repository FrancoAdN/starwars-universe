import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePlanetDto {
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  population: number;

  @IsDefined()
  @IsNotEmpty()
  climate: string;

  @IsDefined()
  @IsNotEmpty()
  terrain: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
