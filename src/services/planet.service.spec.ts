import { NotFoundException } from '@nestjs/common';
import { Planet } from '../entities';
import { mock } from '../helpers';
import { PlanetRepository } from '../repositories';
import { PlanetService } from './planet.service';

describe('PlanetSerivce', () => {
  const planetMock = new Planet({
    id: 'any-id',
    name: 'any-name',
  });
  let planetRepositoryMock: PlanetRepository;
  beforeEach(() => {
    planetRepositoryMock = mock<PlanetRepository>({
      findAll: jest.fn(),
      saveOne: jest.fn(),
      findOne: jest.fn(),
      deleteOne: jest.fn(),
    });
  });

  describe('findAll', () => {
    it('should call the repository method with no params', async () => {
      const service = new PlanetService(planetRepositoryMock);
      await service.findAll();
      expect(planetRepositoryMock.findAll).toHaveBeenCalled();
    });
  });

  describe('createOne', () => {
    it('should call the repository method', async () => {
      const createDto = {
        name: 'Mars',
        population: 10000,
        climate: 'hot',
        terrain: 'sand',
        latitude: 30.45,
        longitude: 71,
      };
      const service = new PlanetService(planetRepositoryMock);
      await service.createOne(createDto);
      expect(planetRepositoryMock.saveOne).toHaveBeenCalledWith(
        new Planet({
          name: 'Mars',
          population: 10000,
          climate: 'hot',
          terrain: 'sand',
          coordinates: '(30.45, 71)',
        }),
      );
    });
  });

  describe('findPlanetById', () => {
    it('should return throw an error when one entity was expected but not found', async () => {
      planetRepositoryMock.findOne = jest.fn().mockReturnValue(null);
      const service = new PlanetService(planetRepositoryMock);
      await expect(service.findPlanetById('any-id', true)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return not throw an error when one entity was not expected and not found', async () => {
      planetRepositoryMock.findOne = jest.fn().mockReturnValue(null);
      const service = new PlanetService(planetRepositoryMock);
      expect(async () => await service.findPlanetById('any-id')).not.toThrow(
        NotFoundException,
      );
      expect(planetRepositoryMock.findOne).toHaveBeenCalledWith({
        id: 'any-id',
      });
    });
  });

  describe('deletePlanetById', () => {
    it('should call the repository method', async () => {
      planetRepositoryMock.findOne = jest.fn().mockReturnValue(planetMock);
      const service = new PlanetService(planetRepositoryMock);
      await service.deletePlanetById('any-id');
      expect(planetRepositoryMock.deleteOne).toHaveBeenCalledWith({
        id: 'any-id',
      });
    });
  });

  describe('editPlanetById', () => {
    it('should call the repository method', async () => {
      const editDto = {
        name: 'Earth',
      };
      planetRepositoryMock.findOne = jest.fn().mockReturnValue(planetMock);

      const service = new PlanetService(planetRepositoryMock);
      await service.editPlanetById('any-id', editDto);
      expect(planetRepositoryMock.saveOne).toHaveBeenCalledWith(
        new Planet({
          id: 'any-id',
          name: 'Earth',
        }),
      );
    });
  });
});
