import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import {
  characterProviders,
  planetProviders,
  starshipProviders,
} from './providers';
import {
  CharacterRepository,
  PlanetRepository,
  StarshipRepository,
} from './repositories';
import { CharacterService, PlanetService, StarshipService } from './services';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...planetProviders,
    PlanetRepository,
    PlanetService,
    ...characterProviders,
    CharacterRepository,
    CharacterService,
    ...starshipProviders,
    StarshipRepository,
    StarshipService,
  ],
  exports: [
    ...planetProviders,
    PlanetRepository,
    PlanetService,
    ...characterProviders,
    CharacterRepository,
    CharacterService,
    ...starshipProviders,
    StarshipRepository,
    StarshipService,
  ],
})
export class CoreModule {}
