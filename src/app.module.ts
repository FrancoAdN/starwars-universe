import { Module } from '@nestjs/common';

import { CoreModule } from './core.module';
import {
  CharacterController,
  PlanetController,
  StarshipController,
} from './controllers';

@Module({
  imports: [CoreModule],
  controllers: [PlanetController, CharacterController, StarshipController],
})
export class AppModule {}
