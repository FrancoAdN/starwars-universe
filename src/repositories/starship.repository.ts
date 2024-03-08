import { Injectable, Inject } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { Starship } from '../entities';

@Injectable()
export class StarshipRepository extends BaseRepository<Starship> {
  constructor(
    @Inject(Starship.name)
    private starshipRepository: Repository<Starship>,
  ) {
    super(starshipRepository);
  }

  findById(id: string): Promise<Starship> {
    return this.repository.findOne({
      where: { id },
      relationLoadStrategy: 'join',
      relations: {
        passengers: true,
        enemies: true,
      },
    });
  }

  findMultipleById(ids: string[]): Promise<Starship[]> {
    return this.repository.findBy({ id: In(ids) });
  }
}
