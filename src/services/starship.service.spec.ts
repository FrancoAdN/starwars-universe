import { StarshipRepository } from '../repositories';
import { mock } from '../helpers';
import { PlanetService } from './planet.service';
import { CharacterService } from './character.service';
import { StarshipService } from './starship.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Character, Starship } from '../entities';
import { CreateStarshipDto } from '../dtos';

describe('StarshipService', () => {
  let characterMock;
  let starshipMock;
  let repositoryMock: StarshipRepository;
  let characterServiceMock: CharacterService;
  let planetServiceMock: PlanetService;
  beforeEach(() => {
    jest.resetAllMocks();
    characterMock = new Character({
      id: 'character-id',
    });
    starshipMock = new Starship({
      id: 'starship-id',
      name: 'any-name',
    });
    planetServiceMock = mock<PlanetService>({
      findPlanetById: jest.fn(),
    });
    repositoryMock = mock<StarshipRepository>({
      findById: jest.fn(),
      findMultipleById: jest.fn(),
      deleteOne: jest.fn(),
      saveOne: jest.fn(),
    });
    characterServiceMock = mock<CharacterService>({
      findMultipleById: jest.fn(),
      findCharacterById: jest.fn(),
    });
  });

  describe('findStashipById', () => {
    it('should return throw an error when one entity was expected but not found', async () => {
      repositoryMock.findById = jest.fn().mockReturnValue(null);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await expect(service.findStarshipById('any-id', true)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return not throw an error when one entity was not expected and not found', async () => {
      repositoryMock.findById = jest.fn().mockReturnValue(null);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      expect(
        async () => await service.findStarshipById('any-id', false),
      ).not.toThrow(NotFoundException);
      expect(repositoryMock.findById).toHaveBeenCalledWith('any-id');
    });
  });

  describe('findMultipleById', () => {
    it('should call the repository method', async () => {
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await service.findMultipleById(['any-ids']);
      expect(repositoryMock.findMultipleById).toHaveBeenCalledWith(['any-ids']);
    });
  });

  describe('deleteStarshipById', () => {
    it('should call the repository method', async () => {
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);

      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await service.deleteStarshipById('starship-id');
      expect(repositoryMock.deleteOne).toHaveBeenCalledWith({
        id: 'starship-id',
      });
    });
  });

  describe('editStarshipById', () => {
    it('should update the coordinatesof starship', async () => {
      const editDto = {
        coordinates: '(40, 11)',
      };
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await service.editStarshipById('starship-id', editDto);
      expect(repositoryMock.saveOne).toHaveBeenCalledWith(
        new Starship({
          id: 'starship-id',
          name: 'any-name',
          coordinates: '(40, 11)',
        }),
      );
    });
    it('should update the enemies of the starship', async () => {
      const otherStarship = new Starship({
        id: 'other-starship-id',
      });
      repositoryMock.findMultipleById = jest
        .fn()
        .mockReturnValue([otherStarship]);
      const editDto = {
        enemies: ['starship-id'],
      };
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await service.editStarshipById('starship-id', editDto);
      expect(repositoryMock.saveOne).toHaveBeenCalledWith(
        new Starship({
          id: 'starship-id',
          name: 'any-name',
          enemies: [otherStarship],
        }),
      );
    });

    it('should update the passengers of the starship', async () => {
      characterServiceMock.findMultipleById = jest
        .fn()
        .mockReturnValue([characterMock]);
      const editDto = {
        passengers: ['any-char-id'],
      };
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await service.editStarshipById('starship-id', editDto);
      expect(repositoryMock.saveOne).toHaveBeenCalledWith(
        new Starship({
          id: 'starship-id',
          name: 'any-name',
          passengers: [characterMock],
        }),
      );
    });

    it('should throw an error when the character service fails', async () => {
      characterServiceMock.findMultipleById = jest
        .fn()
        .mockRejectedValue('error');
      const editDto = {
        passengers: ['any-char-id'],
      };
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await expect(
        service.editStarshipById('starship-id', editDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error starship repository fails', async () => {
      repositoryMock.findMultipleById = jest.fn().mockRejectedValue('error');
      const editDto = {
        enemies: ['starship-id'],
      };
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await expect(
        service.editStarshipById('starship-id', editDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createOne', () => {
    const createDto: CreateStarshipDto = {
      name: 'starship-1',
      model: 'any-model',
      capacity: 100,
      latitude: 10.23,
      longitude: 37.03,
    };
    it('should throw an error when the character service fails', async () => {
      createDto.passengers = ['any-char-id'];
      characterServiceMock.findMultipleById = jest
        .fn()
        .mockRejectedValue('error');
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await expect(service.createOne(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error starship repository fails', async () => {
      createDto.enemies = ['any-star-id'];
      repositoryMock.findMultipleById = jest.fn().mockRejectedValue('error');

      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await expect(service.createOne(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create one starship', async () => {
      const otherStarship = new Starship({
        id: 'other-starship-id',
      });
      createDto.enemies = ['other-starship-id'];
      repositoryMock.findMultipleById = jest
        .fn()
        .mockReturnValue([otherStarship]);
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await service.createOne(createDto);
      expect(repositoryMock.saveOne).toHaveBeenCalledWith(
        new Starship({
          name: 'starship-1',
          model: 'any-model',
          capacity: 100,
          coordinates: `(10.23, 37.03)`,
          enemies: [otherStarship],
        }),
      );
    });
  });

  describe('boardCharacterToStarship', () => {
    it('should update the starship when the character to board is not a passenger', async () => {
      starshipMock.passengers = [];
      characterServiceMock.findCharacterById = jest
        .fn()
        .mockReturnValue(characterMock);
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await service.boardCharacterToStarship('starship-id', 'char-id');
      expect(repositoryMock.saveOne).toHaveBeenCalledWith(
        new Starship({
          id: 'starship-id',
          passengers: [characterMock],
        }),
      );
    });

    it('should not update the starship when the character is already onboard', async () => {
      starshipMock.passengers = [characterMock];
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await service.boardCharacterToStarship('starship-id', 'character-id');
      expect(repositoryMock.saveOne).not.toHaveBeenCalled();
    });
  });

  describe('disembarkCharacter', () => {
    it('should update the starship when the character to disembark is a passenger', async () => {
      starshipMock.passengers = [characterMock];
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await service.disembarkCharacter('starship-id', 'character-id');
      expect(repositoryMock.saveOne).toHaveBeenCalledWith(
        new Starship({
          id: 'starship-id',
          passengers: [],
        }),
      );
    });

    it('should throw an error when the character to disembark is not on board', async () => {
      starshipMock.passengers = [];

      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await expect(
        service.disembarkCharacter('starship-id', 'character-id'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findDistanceToPlanet', () => {
    it('should return the distance from the starship to the planet', async () => {
      starshipMock.coordinates = { x: 10, y: 40 };
      const planetMock = { id: 'planet-id', coordinates: { x: 20, y: 80 } };
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      planetServiceMock.findPlanetById = jest.fn().mockReturnValue(planetMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      const result = await service.findDistanceToPlanet(
        'starship-id',
        'planet-id',
      );
      expect(result).toEqual({
        from: { x: 10, y: 40 },
        to: { x: 20, y: 80 },
        distance: 41.23105625617661,
      });
    });
  });
  describe('canTravelToPlanet', () => {
    it('should return the details about if a starship can travel to a planet', async () => {
      starshipMock.coordinates = { x: 10, y: 40 };
      starshipMock.capacity = 100;
      const planetMock = { id: 'planet-id', coordinates: { x: 20, y: 80 } };
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);
      planetServiceMock.findPlanetById = jest.fn().mockReturnValue(planetMock);
      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      const result = await service.canTravelToPlanet(
        'starship-id',
        'planet-id',
      );
      expect(result).toEqual({
        from: { x: 10, y: 40 },
        to: { x: 20, y: 80 },
        distance: 41.23105625617661,
        canTravel: true,
        capacity: 100,
      });
    });
  });

  describe('findNearbyEnemies', () => {
    it('should find the nearby enemies within a range', async () => {
      starshipMock.coordinates = { x: 10, y: 40 };
      starshipMock.enemies = [
        {
          id: 'starship-1',
          coordinates: { x: 10, y: 50 },
        },
        {
          id: 'starship-2',
          coordinates: { x: 120, y: 200 },
        },
      ];
      repositoryMock.findById = jest.fn().mockReturnValue(starshipMock);

      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      const result = await service.findNearbyEnemies('starship-id', 40);
      expect(result).toEqual([
        {
          id: 'starship-1',
          coordinates: { x: 10, y: 50 },
        },
      ]);
    });
  });

  describe('spawnRandomEnemy', () => {
    it('should create random enemies', async () => {
      starshipMock.enemies = [];
      repositoryMock.findById = jest.fn().mockReturnValueOnce(starshipMock);

      const service = new StarshipService(
        repositoryMock,
        characterServiceMock,
        planetServiceMock,
      );
      await service.spawnRandomEnemy('starship-id');
      expect(repositoryMock.saveOne).toHaveBeenCalledTimes(2);
      expect(repositoryMock.findById).toHaveBeenCalledTimes(2);
    });
  });
});
