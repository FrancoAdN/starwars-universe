import { Planet } from '../entities';
import { DataSource } from 'typeorm';

export const planetProviders = [
  {
    provide: Planet.name,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Planet),
    inject: ['DATA_SOURCE'],
  },
];
