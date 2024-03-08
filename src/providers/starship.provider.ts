import { Starship } from '../entities';
import { DataSource } from 'typeorm';

export const starshipProviders = [
  {
    provide: Starship.name,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Starship),
    inject: ['DATA_SOURCE'],
  },
];
