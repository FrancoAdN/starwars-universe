import { IsDefined, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateCharacterDto {
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  sensitivity: number;

  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  planetId: string;
}
