import { StarshipDistanceToPlanetDto } from './distance-to-planet.dto';

export interface CanTravelToPlanetDto extends StarshipDistanceToPlanetDto {
  capacity: number;
  canTravel: boolean;
}
