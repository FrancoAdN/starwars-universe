import { CharacterRepository } from '../repositories';
import { mock } from '../helpers';
import { PlanetService } from './planet.service';
import { CharacterService } from './character.service';
import { Character, Planet } from '../entities';
import { NotFoundException } from '@nestjs/common';

describe('CharacterService', () => {
  const characterMock = new Character({ id: 'character-id' });
  let planetServiceMock;
  let repositoryMock;
  beforeEach(() => {
    repositoryMock = mock<CharacterRepository>({
      saveOne: jest.fn(),
      deleteOne: jest.fn(),
      findOne: jest.fn(),
      findMultipleByIds: jest.fn(),
    });
    planetServiceMock = mock<PlanetService>({
      findPlanetById: jest.fn(),
    });
  });

  describe('createOne', () => {
    it('should call the repository method', async () => {
      const createDto = {
        name: 'Leia',
        sensitivity: 90,
        planetId: 'planet-id',
      };
      const planet = new Planet({ id: 'planet-id' });
      planetServiceMock.findPlanetById = jest.fn().mockReturnValue(planet);
      const service = new CharacterService(repositoryMock, planetServiceMock);
      await service.createOne(createDto);
      expect(repositoryMock.saveOne).toHaveBeenCalledWith(
        new Character({
          name: 'Leia',
          sensitivity: 90,
          planetId: 'planet-id',
          planet,
        }),
      );
    });
  });

  describe('findCharacterById', () => {
    it('should return throw an error when one entity was expected but not found', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(null);
      const service = new CharacterService(repositoryMock, planetServiceMock);
      await expect(service.findCharacterById('any-id', true)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return not throw an error when one entity was not expected and not found', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(null);
      const service = new CharacterService(repositoryMock, planetServiceMock);
      expect(async () => await service.findCharacterById('any-id')).not.toThrow(
        NotFoundException,
      );
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        id: 'any-id',
      });
    });
  });

  describe('findMultipleById', () => {
    it('should call the repository method', async () => {
      const service = new CharacterService(repositoryMock, planetServiceMock);
      await service.findMultipleById(['character-id']);
      expect(repositoryMock.findMultipleByIds).toHaveBeenCalledWith([
        'character-id',
      ]);
    });
  });

  describe('deleteCharacterById', () => {
    it('should call the repository method', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(characterMock);
      const service = new CharacterService(repositoryMock, planetServiceMock);
      await service.deleteCharacterById('any-id');
      expect(repositoryMock.deleteOne).toHaveBeenCalledWith({
        id: 'any-id',
      });
    });
  });

  describe('editCharacterById', () => {
    it('should call the repository method', async () => {
      const editDto = {
        name: 'new-name',
      };
      repositoryMock.findOne = jest.fn().mockReturnValue(characterMock);

      const service = new CharacterService(repositoryMock, planetServiceMock);
      await service.editCharacterById('any-id', editDto);
      expect(repositoryMock.saveOne).toHaveBeenCalledWith(
        new Character({
          id: 'character-id',
          name: 'new-name',
        }),
      );
    });
    it('should call the planet service if the planet needs to be updated', async () => {
      const planet = new Planet({ id: 'planet-id' });
      planetServiceMock.findPlanetById = jest.fn().mockReturnValue(planet);
      repositoryMock.findOne = jest.fn().mockReturnValue(characterMock);
      const editDto = {
        planetId: 'planet-id',
      };
      const service = new CharacterService(repositoryMock, planetServiceMock);
      await service.editCharacterById('any-id', editDto);
      expect(planetServiceMock.findPlanetById).toHaveBeenCalledWith(
        'planet-id',
        true,
      );
      expect(repositoryMock.saveOne).toHaveBeenCalledWith(
        new Character({
          id: 'character-id',
          planetId: 'planet-id',
        }),
      );
    });
  });

  describe('relocateCharacter', () => {
    it('should call the repository method', async () => {
      const planet = new Planet({ id: 'planet-id' });
      planetServiceMock.findPlanetById = jest.fn().mockReturnValue(planet);
      repositoryMock.findOne = jest.fn().mockReturnValue(characterMock);

      const service = new CharacterService(repositoryMock, planetServiceMock);
      await service.relocateCharacter('character-id', 'planet-id');
      expect(repositoryMock.saveOne).toHaveBeenCalledWith(
        new Character({
          id: 'character-id',
          planet,
        }),
      );
    });
  });
});
