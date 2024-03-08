import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCharacterDto, EditCharacterDto } from '../dtos';
import { Character } from '../entities';
import { CharacterRepository } from '../repositories';
import { PlanetService } from './planet.service';

@Injectable()
export class CharacterService {
  constructor(
    private readonly repository: CharacterRepository,
    private readonly planetService: PlanetService,
  ) {}

  async createOne(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const planet = await this.planetService.findPlanetById(
      createCharacterDto.planetId,
      true,
    );
    const character: Character = new Character({
      ...createCharacterDto,
      planet,
    });
    return this.repository.saveOne(character);
  }

  async findCharacterById(
    id: string,
    throwIfNotFound: boolean = false,
  ): Promise<Character> {
    const character = await this.repository.findOne({ id });

    if (throwIfNotFound && !character) {
      throw new NotFoundException(`Character with id ${id} was not found`);
    }

    return character;
  }

  async deleteCharacterById(id: string): Promise<void> {
    await this.findCharacterById(id, true);
    return this.repository.deleteOne({ id });
  }

  async editCharacterById(
    characterId: string,
    editCharacterDto: EditCharacterDto,
  ): Promise<Character> {
    let character = await this.findCharacterById(characterId, true);
    if (editCharacterDto.planetId) {
      await this.planetService.findPlanetById(editCharacterDto.planetId, true);
    }

    character = new Character({ ...character, ...editCharacterDto });
    return this.repository.saveOne(character);
  }

  findMultipleById(characterIds: string[]): Promise<Character[]> {
    return this.repository.findMultipleByIds(characterIds);
  }

  async relocateCharacter(characterId: string, to: string): Promise<Character> {
    const character = await this.findCharacterById(characterId, true);
    const planetTo = await this.planetService.findPlanetById(to, true);

    character.planet = planetTo;
    return this.repository.saveOne(character);
  }
}
