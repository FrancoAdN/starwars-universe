import { FindOptionsWhere, Repository } from 'typeorm';

export abstract class BaseRepository<T> {
  constructor(protected repository: Repository<T>) {}

  saveOne(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  findOne(filter: FindOptionsWhere<T>): Promise<T> {
    return this.repository.findOneBy(filter);
  }

  async deleteOne(filter: FindOptionsWhere<T>): Promise<void> {
    await this.repository.delete(filter);
  }
}
