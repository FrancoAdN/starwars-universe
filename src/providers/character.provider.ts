import { Character } from '../entities';
import { DataSource } from 'typeorm';

export const characterProviders = [
  {
    provide: Character.name,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Character),
    inject: ['DATA_SOURCE'],
  },
];
