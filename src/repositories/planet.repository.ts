import { Injectable, Inject } from '@nestjs/common';
import { Planet } from '../entities';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class PlanetRepository extends BaseRepository<Planet> {
  constructor(
    @Inject(Planet.name)
    private planetRepository: Repository<Planet>,
  ) {
    super(planetRepository);
  }

  async findAll(): Promise<Planet[]> {
    return this.planetRepository.find();
  }
}
