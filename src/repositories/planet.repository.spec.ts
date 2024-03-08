import { Planet } from '../entities';
import { mock } from '../helpers';
import { Repository } from 'typeorm';
import { PlanetRepository } from './planet.repository';

describe('PlanetRepository', () => {
  let repositoryMock;

  beforeEach(() => {
    repositoryMock = mock<Repository<Planet>>({
      find: jest.fn(),
    });
  });
  it('should call the findAll method', async () => {
    const planetRepository = new PlanetRepository(repositoryMock);
    await planetRepository.findAll();
    expect(repositoryMock.find).toHaveBeenCalled();
  });
});
