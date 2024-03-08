import { Injectable, Inject } from '@nestjs/common';

import { In, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Character } from '../entities';

@Injectable()
export class CharacterRepository extends BaseRepository<Character> {
  constructor(
    @Inject(Character.name)
    private characterRepository: Repository<Character>,
  ) {
    super(characterRepository);
  }

  findMultipleByIds(characterIds: string[]): Promise<Character[]> {
    return this.repository.findBy({ id: In(characterIds) });
  }
}
