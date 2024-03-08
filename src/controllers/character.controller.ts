import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Character } from '../entities';
import {
  CreateCharacterDto,
  EditCharacterDto,
  RelocateCharacterDto,
} from '../dtos';
import { CharacterService } from '../services';

@Controller()
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post('characters')
  createCharacter(
    @Body() createCharacterDto: CreateCharacterDto,
  ): Promise<Character> {
    return this.characterService.createOne(createCharacterDto);
  }

  @Get('characters/:id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) characterId: string,
  ): Promise<Character> {
    return this.characterService.findCharacterById(characterId);
  }

  @Delete('characters/:id')
  deleteOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) characterId: string,
  ): Promise<void> {
    return this.characterService.deleteCharacterById(characterId);
  }

  @Put('characters/:id')
  editCharacter(
    @Body() editCharacterDto: EditCharacterDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) characterId: string,
  ): Promise<Character> {
    return this.characterService.editCharacterById(
      characterId,
      editCharacterDto,
    );
  }

  @Put('characters.relocate/:id')
  relocateCharacter(
    @Body() relocateCharacterDto: RelocateCharacterDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) characterId: string,
  ): Promise<Character> {
    return this.characterService.relocateCharacter(
      characterId,
      relocateCharacterDto.to,
    );
  }
}
