import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { StarshipService } from '../services';
import { mock } from '../helpers';
import { StarshipController } from './starship.controller';

describe('StarshipController', () => {
  const starshipId = '33c8cde3-1279-4e24-ba92-a466dc22fa48';

  let app: INestApplication;
  const starshipServiceMock = mock<StarshipService>({
    boardCharacterToStarship: jest.fn(),
    disembarkCharacter: jest.fn(),
    findDistanceToPlanet: jest.fn(),
    createOne: jest.fn(),
    findStarshipById: jest.fn(),
    deleteStarshipById: jest.fn(),
    editStarshipById: jest.fn(),
    canTravelToPlanet: jest.fn(),
    findNearbyEnemies: jest.fn(),
    spawnRandomEnemy: jest.fn(),
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: StarshipService, useValue: starshipServiceMock }],
      controllers: [StarshipController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /starships/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .get(`/starships/${starshipId}`)
        .expect(200)
        .then(() => {
          expect(starshipServiceMock.findStarshipById).toHaveBeenCalledWith(
            starshipId,
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .get(`/starships/any-value`)
        .expect(400)
        .then(() => {
          expect(starshipServiceMock.findStarshipById).not.toHaveBeenCalled();
        });
    });
  });

  describe('POST /starships', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .post(`/starships`)
        .send({
          name: 'starship-1',
          model: 'any-model',
          capacity: 100,
          latitude: 10.23,
          longitude: 37.03,
        })
        .expect(201)
        .then(() => {
          expect(starshipServiceMock.createOne).toHaveBeenCalledWith({
            name: 'starship-1',
            model: 'any-model',
            capacity: 100,
            latitude: 10.23,
            longitude: 37.03,
          });
        });
    });

    it('should return 400 when the type validation fails', () => {
      return request(app.getHttpServer())
        .post(`/Starships`)
        .send({
          name: 'starship-1',
          model: 'any-model',
          capacity: 100,
        })
        .expect(400)
        .then(() => {
          expect(starshipServiceMock.createOne).not.toHaveBeenCalled();
        });
    });
  });

  describe('DELETE /starships/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .delete(`/Starships/${starshipId}`)
        .expect(200)
        .then(() => {
          expect(starshipServiceMock.deleteStarshipById).toHaveBeenCalledWith(
            starshipId,
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .delete(`/starships/any-value`)
        .expect(400)
        .then(() => {
          expect(starshipServiceMock.deleteStarshipById).not.toHaveBeenCalled();
        });
    });
  });

  describe('PUT /starships/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .put(`/starships/${starshipId}`)
        .expect(200)
        .send({
          name: 'any-name',
        })
        .then(() => {
          expect(starshipServiceMock.editStarshipById).toHaveBeenCalledWith(
            starshipId,
            { name: 'any-name' },
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .put(`/starships/any-value`)
        .expect(400)
        .then(() => {
          expect(starshipServiceMock.editStarshipById).not.toHaveBeenCalled();
        });
    });
    it('should return 400 when the type validation fails', () => {
      return request(app.getHttpServer())
        .put(`/starships/${starshipId}`)
        .expect(400)
        .send({ capacity: 'any' })
        .then(() => {
          expect(starshipServiceMock.editStarshipById).not.toHaveBeenCalled();
        });
    });
  });

  describe('PUT /starships.boardCharacter/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .put(`/starships.boardCharacter/${starshipId}`)
        .expect(200)
        .send({
          characterId: '86f1758f-edc9-419b-9666-01ecb10cd324',
        })
        .then(() => {
          expect(
            starshipServiceMock.boardCharacterToStarship,
          ).toHaveBeenCalledWith(
            starshipId,
            '86f1758f-edc9-419b-9666-01ecb10cd324',
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .put(`/starships.boardCharacter/any-value`)
        .expect(400)
        .then(() => {
          expect(
            starshipServiceMock.boardCharacterToStarship,
          ).not.toHaveBeenCalled();
        });
    });
    it('should return 400 when the type validation fails', () => {
      return request(app.getHttpServer())
        .put(`/starships.boardCharacter/${starshipId}`)
        .expect(400)
        .send({ characterId: 'any' })
        .then(() => {
          expect(
            starshipServiceMock.boardCharacterToStarship,
          ).not.toHaveBeenCalled();
        });
    });
  });

  describe('PUT /starships.disembarkCharacter/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .put(`/starships.disembarkCharacter/${starshipId}`)
        .expect(200)
        .send({
          characterId: '86f1758f-edc9-419b-9666-01ecb10cd324',
        })
        .then(() => {
          expect(starshipServiceMock.disembarkCharacter).toHaveBeenCalledWith(
            starshipId,
            '86f1758f-edc9-419b-9666-01ecb10cd324',
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .put(`/starships.disembarkCharacter/any-value`)
        .expect(400)
        .then(() => {
          expect(starshipServiceMock.disembarkCharacter).not.toHaveBeenCalled();
        });
    });
    it('should return 400 when the type validation fails', () => {
      return request(app.getHttpServer())
        .put(`/starships.disembarkCharacter/${starshipId}`)
        .expect(400)
        .send({ characterId: 'any' })
        .then(() => {
          expect(starshipServiceMock.disembarkCharacter).not.toHaveBeenCalled();
        });
    });
  });

  describe('GET /starships.distanceToPlanet', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .get(`/starships.distanceToPlanet`)
        .query({
          starshipId: starshipId,
          planetId: '86f1758f-edc9-419b-9666-01ecb10cd324',
        })
        .expect(200)
        .then(() => {
          expect(starshipServiceMock.findDistanceToPlanet).toHaveBeenCalledWith(
            starshipId,
            '86f1758f-edc9-419b-9666-01ecb10cd324',
          );
        });
    });
    it('should return 400 when planetId is not sent', () => {
      return request(app.getHttpServer())
        .get(`/starships.distanceToPlanet`)
        .query({
          starshipId: starshipId,
        })
        .expect(400)
        .then(() => {
          expect(
            starshipServiceMock.findDistanceToPlanet,
          ).not.toHaveBeenCalled();
        });
    });
    it('should return 400 when starshipId is not sent', () => {
      return request(app.getHttpServer())
        .get(`/starships.distanceToPlanet`)
        .query({
          planetId: '86f1758f-edc9-419b-9666-01ecb10cd324',
        })
        .expect(400)
        .then(() => {
          expect(
            starshipServiceMock.findDistanceToPlanet,
          ).not.toHaveBeenCalled();
        });
    });
  });

  describe('GET /starships.hasCapacityToTravel', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .get(`/starships.hasCapacityToTravel`)
        .query({
          starshipId: starshipId,
          planetId: '86f1758f-edc9-419b-9666-01ecb10cd324',
        })
        .expect(200)
        .then(() => {
          expect(starshipServiceMock.canTravelToPlanet).toHaveBeenCalledWith(
            starshipId,
            '86f1758f-edc9-419b-9666-01ecb10cd324',
          );
        });
    });
    it('should return 400 when planetId is not sent', () => {
      return request(app.getHttpServer())
        .get(`/starships.hasCapacityToTravel`)
        .query({
          starshipId: starshipId,
        })
        .expect(400)
        .then(() => {
          expect(starshipServiceMock.canTravelToPlanet).not.toHaveBeenCalled();
        });
    });
    it('should return 400 when starshipId is not sent', () => {
      return request(app.getHttpServer())
        .get(`/starships.hasCapacityToTravel`)
        .query({
          planetId: '86f1758f-edc9-419b-9666-01ecb10cd324',
        })
        .expect(400)
        .then(() => {
          expect(starshipServiceMock.canTravelToPlanet).not.toHaveBeenCalled();
        });
    });
  });

  describe('GET /starships.nearbyEnemies', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .get(`/starships.nearbyEnemies`)
        .query({
          starshipId: starshipId,
          range: 100,
        })
        .expect(200)
        .then(() => {
          expect(starshipServiceMock.findNearbyEnemies).toHaveBeenCalledWith(
            starshipId,
            100,
          );
        });
    });
    it('should return 400 when planetId is not sent', () => {
      return request(app.getHttpServer())
        .get(`/starships.nearbyEnemies`)
        .query({
          starshipId: starshipId,
        })
        .expect(400)
        .then(() => {
          expect(starshipServiceMock.findNearbyEnemies).not.toHaveBeenCalled();
        });
    });
    it('should return 400 when starshipId is not sent', () => {
      return request(app.getHttpServer())
        .get(`/starships.nearbyEnemies`)
        .query({
          range: 100,
        })
        .expect(400)
        .then(() => {
          expect(starshipServiceMock.findNearbyEnemies).not.toHaveBeenCalled();
        });
    });
  });

  describe('PUT /starships.spawnEnemy/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .put(`/starships.spawnEnemy/${starshipId}`)
        .expect(200)
        .then(() => {
          expect(starshipServiceMock.spawnRandomEnemy).toHaveBeenCalledWith(
            starshipId,
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .put(`/starships.spawnEnemy/any-value`)
        .expect(400)
        .then(() => {
          expect(starshipServiceMock.spawnRandomEnemy).not.toHaveBeenCalled();
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
