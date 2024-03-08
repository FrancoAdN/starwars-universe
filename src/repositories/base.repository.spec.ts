import { mock } from '../helpers';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Planet } from '../entities';

describe('BaseRepository', () => {
  class TestPlanetRepository extends BaseRepository<Planet> {
    constructor(private planetRepository: Repository<Planet>) {
      super(planetRepository);
    }
  }
  let repository;

  beforeEach(() => {
    repository = mock<Repository<Planet>>({
      save: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
    });
  });

  describe('BaseMethods', () => {
    it('should call the save method', async () => {
      const entity = new Planet({ id: 'planet-id' });
      const testRepository = new TestPlanetRepository(repository);
      await testRepository.saveOne(entity);
      expect(repository.save).toHaveBeenCalledWith(entity);
    });

    it('should call the findOneBy method', async () => {
      const testRepository = new TestPlanetRepository(repository);
      await testRepository.findOne({ id: 'any-id' });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'any-id' });
    });

    it('should call the delete method', async () => {
      const testRepository = new TestPlanetRepository(repository);
      await testRepository.deleteOne({ id: 'any-id' });
      expect(repository.delete).toHaveBeenCalledWith({ id: 'any-id' });
    });
  });
});
