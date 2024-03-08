import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StarshipService } from '../services';
import {
  BoardDisembarkCharacterDto,
  CanTravelToPlanetDto,
  CreateStarshipDto,
  EditStarshipDto,
  StarshipDistanceToPlanetDto,
} from '../dtos';
import { Starship } from '../entities';

@Controller()
export class StarshipController {
  constructor(private readonly starshipService: StarshipService) {}

  @Post('starships')
  createCharacter(
    @Body() createStarshipDto: CreateStarshipDto,
  ): Promise<Starship> {
    return this.starshipService.createOne(createStarshipDto);
  }

  @Get('starships/:id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) starshipId: string,
  ): Promise<Starship> {
    return this.starshipService.findStarshipById(starshipId);
  }

  @Delete('starships/:id')
  deleteOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) starshipId: string,
  ): Promise<void> {
    return this.starshipService.deleteStarshipById(starshipId);
  }

  @Put('starships/:id')
  editStarship(
    @Body() editStarshipDto: EditStarshipDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) starshipId: string,
  ): Promise<Starship> {
    return this.starshipService.editStarshipById(starshipId, editStarshipDto);
  }

  @Put('starships.boardCharacter/:id')
  boardCharacter(
    @Body() boardCharacterDto: BoardDisembarkCharacterDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) starshipId: string,
  ) {
    return this.starshipService.boardCharacterToStarship(
      starshipId,
      boardCharacterDto.characterId,
    );
  }

  @Put('starships.disembarkCharacter/:id')
  disembarkCharacter(
    @Body() disembarkCharacterDto: BoardDisembarkCharacterDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) starshipId: string,
  ) {
    return this.starshipService.disembarkCharacter(
      starshipId,
      disembarkCharacterDto.characterId,
    );
  }

  @Get('starships.distanceToPlanet')
  distanceToPlanet(
    @Query('starshipId') starshipId: string,
    @Query('planetId') planetId: string,
  ): Promise<StarshipDistanceToPlanetDto> {
    if (!planetId || !starshipId)
      throw new BadRequestException(`Planet ID and Starship ID are required`);
    return this.starshipService.findDistanceToPlanet(starshipId, planetId);
  }

  @Get('starships.hasCapacityToTravel')
  hasCapacityToTravel(
    @Query('starshipId') starshipId: string,
    @Query('planetId') planetId: string,
  ): Promise<CanTravelToPlanetDto> {
    if (!planetId || !starshipId)
      throw new BadRequestException(`Planet ID and Starship ID are required`);
    return this.starshipService.canTravelToPlanet(starshipId, planetId);
  }

  @Get('starships.nearbyEnemies')
  findNearbyEnemies(
    @Query('starshipId') starshipId: string,
    @Query('range') range: string,
  ) {
    if (!range || !starshipId)
      throw new BadRequestException(`Range and Starship ID are required`);
    return this.starshipService.findNearbyEnemies(
      starshipId,
      parseFloat(range),
    );
  }

  @Put('starships.spawnEnemy/:id')
  spawnRandomEnemy(
    @Param('id', new ParseUUIDPipe({ version: '4' })) starshipId: string,
  ): Promise<Starship> {
    return this.starshipService.spawnRandomEnemy(starshipId);
  }
}
