import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class RelocateCharacterDto {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  to: string;
}
