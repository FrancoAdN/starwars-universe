import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('planets')
export class Planet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('int')
  population: number;

  @Column('text')
  climate: string;

  @Column('text')
  terrain: string;

  @Column('point', { nullable: false })
  coordinates: string;

  constructor(planet: Partial<Planet> = {}) {
    Object.assign(this, planet);
  }
}
