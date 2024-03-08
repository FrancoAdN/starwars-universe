import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PlanetService } from '../services';
import { mock } from '../helpers';
import { PlanetController } from './planet.controller';

describe('PlanetController', () => {
  const planetId = '33c8cde3-1279-4e24-ba92-a466dc22fa48';

  let app: INestApplication;
  const planetServiceMock = mock<PlanetService>({
    createOne: jest.fn(),
    findPlanetById: jest.fn(),
    deletePlanetById: jest.fn(),
    editPlanetById: jest.fn(),
    findAll: jest.fn(),
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: PlanetService, useValue: planetServiceMock }],
      controllers: [PlanetController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /planets/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .get(`/planets/${planetId}`)
        .expect(200)
        .then(() => {
          expect(planetServiceMock.findPlanetById).toHaveBeenCalledWith(
            planetId,
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .get(`/planets/any-value`)
        .expect(400)
        .then(() => {
          expect(planetServiceMock.findPlanetById).not.toHaveBeenCalled();
        });
    });
  });

  describe('POST /planets', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .post(`/planets`)
        .send({
          name: 'Mars',
          population: 10000,
          climate: 'hot',
          terrain: 'sand',
          latitude: 30.45,
          longitude: 71,
        })
        .expect(201)
        .then(() => {
          expect(planetServiceMock.createOne).toHaveBeenCalledWith({
            name: 'Mars',
            population: 10000,
            climate: 'hot',
            terrain: 'sand',
            latitude: 30.45,
            longitude: 71,
          });
        });
    });

    it('should return 400 when the type validation fails', () => {
      return request(app.getHttpServer())
        .post(`/planets`)
        .send({
          name: 'Mars',
          population: 10000,
          climate: 'hot',
        })
        .expect(400)
        .then(() => {
          expect(planetServiceMock.createOne).not.toHaveBeenCalled();
        });
    });
  });

  describe('DELETE /planets/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .delete(`/planets/${planetId}`)
        .expect(200)
        .then(() => {
          expect(planetServiceMock.deletePlanetById).toHaveBeenCalledWith(
            planetId,
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .delete(`/planets/any-value`)
        .expect(400)
        .then(() => {
          expect(planetServiceMock.deletePlanetById).not.toHaveBeenCalled();
        });
    });
  });

  describe('PUT /planets/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .put(`/planets/${planetId}`)
        .expect(200)
        .send({
          name: 'any-name',
        })
        .then(() => {
          expect(planetServiceMock.editPlanetById).toHaveBeenCalledWith(
            planetId,
            { name: 'any-name' },
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .put(`/planets/any-value`)
        .expect(400)
        .then(() => {
          expect(planetServiceMock.editPlanetById).not.toHaveBeenCalled();
        });
    });
    it('should return 400 when the type validation fails', () => {
      return request(app.getHttpServer())
        .put(`/planets/${planetId}`)
        .expect(400)
        .send({ population: 'any' })
        .then(() => {
          expect(planetServiceMock.editPlanetById).not.toHaveBeenCalled();
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
