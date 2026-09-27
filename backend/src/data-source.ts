import { DataSource } from 'typeorm'
import { Product } from './entity/Product'
import { CreateProduct1730000000000 } from './migrations/1730000000000-CreateProduct'

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    migrationsRun: true,
    logging: false,
    entities: [Product],
    migrations: [CreateProduct1730000000000],
})
