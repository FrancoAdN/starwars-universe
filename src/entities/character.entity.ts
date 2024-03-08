import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Planet } from './planet.entity';
import { Type } from 'class-transformer';
import { Starship } from './starship.entity';

@Entity('characters')
export class Character {
  @ManyToOne(/* istanbul ignore next */ () => Planet)
  @JoinColumn({ name: 'planet_id', referencedColumnName: 'id' })
  @Type(/* istanbul ignore next */ () => Planet)
  planet: Planet;

  @Column('text', { name: 'planet_id' })
  planetId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  //Sesistivity to the Force
  @Column('int')
  sensitivity: number;

  @ManyToOne(() => Starship, (staship) => staship.passengers)
  starship?: Starship;

  constructor(character: Partial<Character> = {}) {
    Object.assign(this, character);
  }
}
