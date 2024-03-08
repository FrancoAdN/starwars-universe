import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Character } from './character.entity';

@Entity('starships')
export class Starship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  model: string;

  //Cargo Capacity
  @Column('int')
  capacity: number;

  @Column('point', { nullable: false })
  coordinates: string;

  @OneToMany(
    /* istanbul ignore next */ () => Character,

    /* istanbul ignore next */ (character) => character.starship,
    {
      cascade: true,
      eager: false,
    },
  )
  passengers?: Character[];

  @ManyToMany(() => Starship)
  @JoinTable()
  enemies?: Starship[];

  isPassenger(charId: string) {
    return (
      this.passengers.length &&
      this.passengers.some((char) => char.id === charId)
    );
  }
  constructor(star: Partial<Starship> = {}) {
    Object.assign(this, star);
  }
}
