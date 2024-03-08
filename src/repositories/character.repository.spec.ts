import { Character } from '../entities';
import { mock } from '../helpers';
import { In, Repository } from 'typeorm';
import { CharacterRepository } from './character.repository';

describe('CharacterRepository', () => {
  let repositoryMock;

  beforeEach(() => {
    repositoryMock = mock<Repository<Character>>({
      findBy: jest.fn(),
    });
  });
  it('should call the findBy method', async () => {
    const characterRepository = new CharacterRepository(repositoryMock);
    await characterRepository.findMultipleByIds(['char-id']);
    expect(repositoryMock.findBy).toHaveBeenCalledWith({ id: In(['char-id']) });
  });
});
