import { DataSource, EntityManager, Repository } from 'typeorm';

export class BaseRepository {
    constructor(
        private dataSource: DataSource,
        private request: Request,
    ) {}

    getRepository<T>(entityCls: new () => T): Repository<T> {
        const entityManager: EntityManager =
            this.request['ENTITY_MANAGER'] ?? this.dataSource.manager;
        return entityManager.getRepository(entityCls);
    }
}
