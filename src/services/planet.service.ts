import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanetDto, EditPlanetDto } from '../dtos';

import { Planet } from '../entities';
import { PlanetRepository } from '../repositories';

@Injectable()
export class PlanetService {
  constructor(private readonly repository: PlanetRepository) {}

  findAll() {
    return this.repository.findAll();
  }

  createOne(planetDto: CreatePlanetDto): Promise<Planet> {
    const coordinates = `(${planetDto.latitude}, ${planetDto.longitude})`;
    delete planetDto.longitude;
    delete planetDto.latitude;
    const planet: Planet = new Planet({
      ...planetDto,
      coordinates,
    });

    return this.repository.saveOne(planet);
  }

  async findPlanetById(
    id: string,
    throwIfNotFound: boolean = false,
  ): Promise<Planet> {
    const planet = await this.repository.findOne({ id });

    if (throwIfNotFound && !planet) {
      throw new NotFoundException(`Planet with id ${id} was not found`);
    }

    return planet;
  }

  async deletePlanetById(id: string): Promise<void> {
    await this.findPlanetById(id, true);
    return this.repository.deleteOne({ id });
  }

  async editPlanetById(
    planetId: string,
    editPlanetDto: EditPlanetDto,
  ): Promise<Planet> {
    let planet = await this.findPlanetById(planetId, true);
    planet = new Planet({ ...planet, ...editPlanetDto });
    return this.repository.saveOne(planet);
  }
}
