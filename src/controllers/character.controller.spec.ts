import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CharacterService } from '../services';
import { mock } from '../helpers';
import { CharacterController } from './character.controller';

describe('CharacterController', () => {
  const characterId = '33c8cde3-1279-4e24-ba92-a466dc22fa48';

  let app: INestApplication;
  const characterServiceMock = mock<CharacterService>({
    createOne: jest.fn(),
    findCharacterById: jest.fn(),
    deleteCharacterById: jest.fn(),
    editCharacterById: jest.fn(),
    relocateCharacter: jest.fn(),
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: CharacterService, useValue: characterServiceMock },
      ],
      controllers: [CharacterController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /characters/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .get(`/characters/${characterId}`)
        .expect(200)
        .then(() => {
          expect(characterServiceMock.findCharacterById).toHaveBeenCalledWith(
            characterId,
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .get(`/characters/any-value`)
        .expect(400)
        .then(() => {
          expect(characterServiceMock.findCharacterById).not.toHaveBeenCalled();
        });
    });
  });

  describe('POST /characters', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .post(`/characters`)
        .send({
          name: 'Leia',
          sensitivity: 90,
          planetId: '5b3b1e90-7d59-4a55-8f21-9943e20348bd',
        })
        .expect(201)
        .then(() => {
          expect(characterServiceMock.createOne).toHaveBeenCalledWith({
            name: 'Leia',
            sensitivity: 90,
            planetId: '5b3b1e90-7d59-4a55-8f21-9943e20348bd',
          });
        });
    });

    it('should return 400 when the type validation fails', () => {
      return request(app.getHttpServer())
        .post(`/Characters`)
        .send({
          name: 'Leia',
          sensitivity: 90,
        })
        .expect(400)
        .then(() => {
          expect(characterServiceMock.createOne).not.toHaveBeenCalled();
        });
    });
  });

  describe('DELETE /characters/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .delete(`/characters/${characterId}`)
        .expect(200)
        .then(() => {
          expect(characterServiceMock.deleteCharacterById).toHaveBeenCalledWith(
            characterId,
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .delete(`/characters/any-value`)
        .expect(400)
        .then(() => {
          expect(
            characterServiceMock.deleteCharacterById,
          ).not.toHaveBeenCalled();
        });
    });
  });

  describe('PUT /characters/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .put(`/characters/${characterId}`)
        .expect(200)
        .send({
          name: 'any-name',
        })
        .then(() => {
          expect(characterServiceMock.editCharacterById).toHaveBeenCalledWith(
            characterId,
            { name: 'any-name' },
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .put(`/characters/any-value`)
        .expect(400)
        .then(() => {
          expect(characterServiceMock.editCharacterById).not.toHaveBeenCalled();
        });
    });
    it('should return 400 when the type validation fails', () => {
      return request(app.getHttpServer())
        .put(`/characters/${characterId}`)
        .expect(400)
        .send({ sensitivity: 'any' })
        .then(() => {
          expect(characterServiceMock.editCharacterById).not.toHaveBeenCalled();
        });
    });
  });

  describe('PUT /characters.relocate/:id', () => {
    it('should call the service method and return 200', async () => {
      return request(app.getHttpServer())
        .put(`/characters.relocate/${characterId}`)
        .expect(200)
        .send({
          to: '5b3b1e90-7d59-4a55-8f21-9943e20348bd',
        })
        .then(() => {
          expect(characterServiceMock.relocateCharacter).toHaveBeenCalledWith(
            characterId,
            '5b3b1e90-7d59-4a55-8f21-9943e20348bd',
          );
        });
    });

    it('should return 400 when the query param is not UUID', () => {
      return request(app.getHttpServer())
        .put(`/characters.relocate/any-value`)
        .expect(400)
        .then(() => {
          expect(characterServiceMock.relocateCharacter).not.toHaveBeenCalled();
        });
    });
    it('should return 400 when the type validation fails', () => {
      return request(app.getHttpServer())
        .put(`/characters.relocate/${characterId}`)
        .expect(400)
        .send({ to: 'any' })
        .then(() => {
          expect(characterServiceMock.relocateCharacter).not.toHaveBeenCalled();
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
