import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StarshipRepository } from '../repositories';
import { CharacterService } from './character.service';
import { Starship } from '../entities';
import {
  CanTravelToPlanetDto,
  CreateStarshipDto,
  EditStarshipDto,
  StarshipDistanceToPlanetDto,
} from '../dtos';
import { PlanetService } from './planet.service';
import { calculateDistance, isNearby } from '../helpers';
import { createRandomStarship } from '../helpers/create-random.helper';

@Injectable()
export class StarshipService {
  constructor(
    private readonly repository: StarshipRepository,
    private readonly characterService: CharacterService,
    private readonly planetService: PlanetService,
  ) {}

  async createOne(createStarshipDto: CreateStarshipDto): Promise<Starship> {
    const { capacity, name, model, latitude, longitude } = createStarshipDto;
    const starship = new Starship({
      name,
      capacity,
      model,
      coordinates: `(${latitude}, ${longitude})`,
    });
    if (createStarshipDto.passengers?.length) {
      try {
        const passengers = await this.characterService.findMultipleById(
          createStarshipDto.passengers,
        );
        starship.passengers = passengers;
      } catch {
        throw new BadRequestException(
          'Error while trying to retrieve the passengers',
        );
      }
    }

    if (createStarshipDto.enemies?.length) {
      try {
        const enemies = await this.findMultipleById(createStarshipDto.enemies);
        starship.enemies = enemies;
      } catch {
        throw new BadRequestException(
          'Error while trying to retrieve the enemies',
        );
      }
    }

    return this.repository.saveOne(starship);
  }

  async findStarshipById(
    id: string,
    throwIfNotFound: boolean = false,
  ): Promise<Starship> {
    const starship = await this.repository.findById(id);

    if (throwIfNotFound && !starship) {
      throw new NotFoundException(`Starship with id ${id} was not found`);
    }

    return starship;
  }

  async findMultipleById(ids: string[]) {
    return this.repository.findMultipleById(ids);
  }

  async deleteStarshipById(id: string): Promise<void> {
    await this.findStarshipById(id, true);
    return this.repository.deleteOne({ id });
  }

  async editStarshipById(
    starshipId: string,
    editStarshipDto: EditStarshipDto,
  ): Promise<Starship> {
    let starship = await this.findStarshipById(starshipId, true);
    delete starship.coordinates;
    if (editStarshipDto.passengers?.length) {
      try {
        const passengers = await this.characterService.findMultipleById(
          editStarshipDto.passengers,
        );
        starship.passengers = passengers;
      } catch {
        throw new BadRequestException(
          'Error while trying to retrieve the passengers',
        );
      }
    }

    if (editStarshipDto.enemies?.length) {
      try {
        const enemies = await this.findMultipleById(editStarshipDto.enemies);
        starship.enemies = enemies;
      } catch {
        throw new BadRequestException(
          'Error while trying to retrieve the enemies',
        );
      }
    }
    const { capacity, name, model, coordinates } = editStarshipDto;
    if (coordinates) {
      starship.coordinates = coordinates;
    }
    starship = new Starship({
      ...starship,
      name: name || starship.name,
      capacity: capacity || starship.capacity,
      model: model || starship.model,
    });
    return this.repository.saveOne(starship);
  }

  async boardCharacterToStarship(
    starshipId: string,
    characterId: string,
  ): Promise<Starship> {
    let starship = await this.findStarshipById(starshipId);
    if (!starship.isPassenger(characterId)) {
      const character = await this.characterService.findCharacterById(
        characterId,
        true,
      );
      starship = new Starship({
        id: starshipId,
        passengers: [...starship.passengers, character],
      });

      starship = await this.repository.saveOne(starship);
    }

    return starship;
  }

  async disembarkCharacter(
    starshipId: string,
    characterId: string,
  ): Promise<Starship> {
    const starship = await this.findStarshipById(starshipId);
    if (!starship.isPassenger(characterId))
      throw new BadRequestException(
        `Cannot disembark character ${characterId} not passenger of starship ${starshipId}`,
      );

    const newPassengers = starship.passengers.filter(
      (char) => char.id !== characterId,
    );
    return this.repository.saveOne(
      new Starship({
        id: starshipId,
        passengers: newPassengers,
      }),
    );
  }

  async findDistanceToPlanet(
    starshipId: string,
    planetId: string,
  ): Promise<StarshipDistanceToPlanetDto> {
    const starship = await this.findStarshipById(starshipId, true);
    const planet = await this.planetService.findPlanetById(planetId, true);
    const distance = calculateDistance(
      starship.coordinates,
      planet.coordinates,
    );
    return { from: starship.coordinates, to: planet.coordinates, distance };
  }

  async canTravelToPlanet(
    starshipId: string,
    planetId: string,
  ): Promise<CanTravelToPlanetDto> {
    const starship = await this.findStarshipById(starshipId, true);
    const planet = await this.planetService.findPlanetById(planetId, true);
    const distance = calculateDistance(
      starship.coordinates,
      planet.coordinates,
    );

    return {
      from: starship.coordinates,
      to: planet.coordinates,
      capacity: starship.capacity,
      distance,
      canTravel: distance < starship.capacity,
    };
  }

  async findNearbyEnemies(
    starshipId: string,
    range: number,
  ): Promise<Starship[]> {
    const starship = await this.findStarshipById(starshipId, true);
    return starship.enemies.filter((enemy) =>
      isNearby(starship.coordinates, enemy.coordinates, range),
    );
  }

  async spawnRandomEnemy(starshipId: string): Promise<Starship> {
    const starship = await this.findStarshipById(starshipId, true);
    const enemy = await this.repository.saveOne(createRandomStarship(starship));
    await this.repository.saveOne(
      new Starship({
        id: starshipId,
        enemies: [...starship.enemies, enemy],
      }),
    );

    return this.findStarshipById(starshipId);
  }
}
