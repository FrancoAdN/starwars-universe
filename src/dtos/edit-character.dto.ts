import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class EditCharacterDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  sensitivity?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  planetId?: string;
}
