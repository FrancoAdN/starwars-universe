import { Starship } from '../entities';
import { mock } from '../helpers';
import { In, Repository } from 'typeorm';
import { StarshipRepository } from './starship.repository';

describe('StarshipRepository', () => {
  let repositoryMock;

  beforeEach(() => {
    repositoryMock = mock<Repository<Starship>>({
      findBy: jest.fn(),
      findOne: jest.fn(),
    });
  });
  it('should call the findBy method', async () => {
    const starshipRepository = new StarshipRepository(repositoryMock);
    await starshipRepository.findMultipleById(['starship-id']);
    expect(repositoryMock.findBy).toHaveBeenCalledWith({
      id: In(['starship-id']),
    });
  });

  it('should call the findOne method', async () => {
    const starshipRepository = new StarshipRepository(repositoryMock);
    await starshipRepository.findById('starship-id');
    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: 'starship-id' },
      relationLoadStrategy: 'join',
      relations: {
        passengers: true,
        enemies: true,
      },
    });
  });
});
