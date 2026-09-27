import { DataSource } from 'typeorm'
import { Product } from './entity/Product'
import { CreateProduct1730000000000 } from './migrations/1730000000000-CreateProduct'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    migrationsRun: true,
    logging: false,
    entities: [Product],
    migrations: [CreateProduct1730000000000],
})
