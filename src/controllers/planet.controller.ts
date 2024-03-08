import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Planet } from '../entities';
import { CreatePlanetDto } from '../dtos';
import { PlanetService } from '../services';
import { EditPlanetDto } from '../dtos/edit-planet.dto';

@Controller()
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  @Post('planets')
  createPlanet(@Body() createPlanetDto: CreatePlanetDto): Promise<Planet> {
    return this.planetService.createOne(createPlanetDto);
  }

  @Get('planets/:id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) planetId: string,
  ): Promise<Planet> {
    return this.planetService.findPlanetById(planetId);
  }

  @Delete('planets/:id')
  deleteOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) planetId: string,
  ): Promise<void> {
    return this.planetService.deletePlanetById(planetId);
  }

  @Put('planets/:id')
  editPlanet(
    @Body() editPlanetDto: EditPlanetDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) planetId: string,
  ): Promise<Planet> {
    return this.planetService.editPlanetById(planetId, editPlanetDto);
  }
}
