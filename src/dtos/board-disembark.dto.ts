import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class BoardDisembarkCharacterDto {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  characterId: string;
}
